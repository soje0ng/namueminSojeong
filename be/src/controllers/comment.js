const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_board, i_board_comment, i_category } = require('../models');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');
const { raw } = require('body-parser');

// 관리자 댓글 리스트
exports.getCommentListAdmin = async (req, res, next) => {
    const { getLimit = 10 } = req.params;
    const page = parseInt(req.query.page) || 1;

    try {
        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            idx: { [Op.gt]: 0 },
        };

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'c_contents') {
                whereCondition.c_contents = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }
            if (searchQuery === 'name') {
                whereCondition.m_name = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }
        }

        // whereCondition.board_idx = {
        //     [Op.in]: Sequelize.literal(`(SELECT idx FROM i_board WHERE i_board.idx = i_board_comment.board_idx)`),
        // };

        whereCondition.board_idx = {
            [Op.in]: Sequelize.literal(`(
                SELECT b.idx FROM i_board b JOIN i_category c 
                    ON c.id = b.category
                WHERE b.idx = i_board_comment.board_idx
                AND c.c_use_yn = '${enumConfig.useType.Y[0]}'
            )`),
        };

        let orderField;

        orderField = [['idx', 'DESC']];

        const subQuery = `(SELECT b_title FROM i_board WHERE i_board.idx = i_board_comment.board_idx)`;
        const subQuery2 = `(SELECT c_name FROM i_category WHERE id = (SELECT category FROM i_board WHERE i_board.idx = i_board_comment.board_idx) and i_category.c_use_yn = '${enumConfig.useType.Y[0]}')`;
        const subQuery3 = `(SELECT category FROM i_board WHERE i_board.idx = i_board_comment.board_idx)`;

        const limit = parseInt(getLimit);

        const offset = (page - 1) * limit;

        const result = await i_board_comment.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: [
                'board_idx',
                'idx',
                'c_contents',
                'm_name',
                'c_reg_date',
                [Sequelize.literal(subQuery), 'boardTitle'],
                [Sequelize.literal(subQuery2), 'boardName'],
                [Sequelize.literal(subQuery3), 'boardCategory'],
            ],
        });

        const formattedResult = result.rows.map(list => ({
            category: list.getDataValue('boardCategory'),
            board_idx: list.board_idx,
            idx: list.idx,
            c_contents: list.c_contents,
            boardName: list.getDataValue('boardName'),
            boardTitle: list.getDataValue('boardTitle'),
            m_name: list.m_name,
            c_reg_date: moment(list.c_reg_date).format('YYYY.MM.DD HH:mm'),
        }));

        const count = result.count;
        const pagination = utilMiddleware.paginationCalc(count, page, limit);

        const resultObj = {
            ...pagination,
            data_list: formattedResult,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 댓글 리스트
exports.getCommentList = async (req, res, next) => {
    const { board_idx, category } = req.params;

    try {
        utilMiddleware.validateIdx(category, 'category');
        utilMiddleware.validateIdx(board_idx, 'board_idx');

        const result = await i_board_comment.findAll({
            where: { board_idx: board_idx },
            order: [['idx', 'ASC']],
            attributes: ['idx', 'board_idx', 'parent_idx', 'depth', 'm_email', 'm_name', 'c_contents', 'c_reg_date'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = result.map(main => {
            const listObj = {
                idx: main.idx,
                board_idx: main.board_idx,
                parent_idx: main.parent_idx,
                depth: main.depth,
                m_email: main.m_email,
                m_name: main.m_name,
                c_contents: main.c_contents,
                c_reg_date: main.c_reg_date,
            };
            return listObj;
        });

        const commentTree = buildCommentTree(result);
        return errorHandler.successThrow(res, '', commentTree);
    } catch (err) {
        next(err);
    }
};

const buildCommentTree = (allComments, parentIdx = 0) => {
    const result = [];

    for (const comment of allComments) {
        if (comment.parent_idx === parentIdx) {
            const children = buildCommentTree(allComments, comment.idx);

            result.push({
                idx: comment.idx,
                board_idx: comment.board_idx,
                parent_idx: comment.parent_idx,
                depth: comment.depth,
                m_email: comment.m_email,
                m_name: comment.m_name,
                c_contents: comment.c_contents,
                c_reg_date: comment.c_reg_date,
                children: children,
            });
        }
    }

    return result;
};

// 댓글 등록
exports.postCommentCreate = async (req, res, next) => {
    const { board_idx, parent_idx, depth, m_email, m_name, m_pwd, c_contents } = req.body;
    let transaction;

    try {
        utilMiddleware.validateIdx(board_idx, 'board_idx');
        utilMiddleware.validateIdx(parent_idx, 'parent_idx');

        transaction = await db.mariaDBSequelize.transaction();

        const result = await i_board.findOne({
            where: {
                idx: board_idx,
            },
            attributes: ['idx'],
            transaction,
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '부모 게시물이 없습니다.');
        }

        const commentCreate = await i_board_comment.create(
            {
                board_idx: board_idx,
                parent_idx: parent_idx,
                depth: depth,
                m_email: m_email,
                m_name: m_name,
                m_pwd: m_pwd,
                c_contents: c_contents,
            },
            { transaction },
        );

        if (!commentCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        await transaction.commit();

        return errorHandler.successThrow(res, '', commentCreate);
    } catch (err) {
        if (transaction) {
            try {
                if (transaction.finished !== 'rollback' && transaction.finished !== 'commit') {
                    await transaction.rollback();
                }
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
        }
        next(err);
    }
};

// 댓글 수정
exports.putCommentUpdate = async (req, res, next) => {
    const { idx, c_contents, pass } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_board_comment.findOne({
            where: {
                idx: idx,
            },
            attributes: ['m_email'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        // 자기 자신 댓글 여부
        if (pass !== enumConfig.passTrueFalse.T[0]) {
            if (req.user !== result.m_email) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
            }
        }

        const commentUpdate = await i_board_comment.update(
            {
                c_contents: c_contents,
            },
            {
                where: {
                    idx: idx,
                },
            },
        );

        if (!commentUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', commentUpdate);
    } catch (err) {
        next(err);
    }
};

// 댓글 삭제
exports.deleteCommentDestroy = async (req, res, next) => {
    const { idx, pass } = req.body;

    try {
        let commentDelete;

        await db.mariaDBSequelize.transaction(async transaction => {
            const whereCondition = {
                idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
            };

            const result = await i_board_comment.findAll({
                where: whereCondition,
                attributes: ['idx', 'm_email'],
                raw: true,
                transaction,
            });

            if (!result || result.length === 0) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            // 권한 체크
            if (pass !== enumConfig.passTrueFalse.T[0]) {
                for (const commentView of result) {
                    if (req.user !== commentView.m_email && req.level !== enumConfig.userLevel.USER_LV9) {
                        return errorHandler.errorThrow(
                            enumConfig.statusErrorCode._403_ERROR[0],
                            '삭제 권한이 없습니다.',
                        );
                    }
                }
            }

            // 댓글별로 하위 댓글 여부 확인
            for (const comment of result) {
                const childCount = await i_board_comment.count({
                    where: { parent_idx: comment.idx },
                    transaction,
                });

                if (childCount > 0) {
                    // 하위 댓글이 있으면 실제 삭제 대신 내용 수정
                    await i_board_comment.update(
                        { c_contents: '삭제된 댓글입니다.' },
                        { where: { idx: comment.idx }, transaction },
                    );
                } else {
                    // 하위 댓글이 없으면 실제 삭제
                    await i_board_comment.destroy({
                        where: { idx: comment.idx },
                        transaction,
                    });
                }
            }

            commentDelete = true; // 처리 완료 표시
        });

        return errorHandler.successThrow(res, '', commentDelete);
    } catch (err) {
        next(err);
    }
};

// 댓글 비밀번호 확인
exports.postCommentPassword = async (req, res, next) => {
    const { idx, password } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_board_comment.findOne({
            where: {
                idx: idx,
            },
            attributes: ['idx', 'm_pwd'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        if (password !== result.m_pwd) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], '비밀번호가 다릅니다.');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};
