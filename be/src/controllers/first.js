const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_board, i_category, i_board_comment, i_member, i_logs } = require('../models');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');
const cheerio = require('cheerio');
const utilMiddleware = require('../middleware/util');

// 게시글 알림
exports.getFirstBoardAlarm = async (req, res, next) => {
    const follow = req.params.follow;

    try {
        const whereCondition = {
            a_delete: null,
        };

        if (req.user !== undefined) {
            whereCondition.m_email = {
                [Op.ne]: req.user,
            };
        }

        let data;

        const subQuery1 = ` (select c_name from i_category where i_category.id = i_board.category) `;
        const subQuery2 = ` (select c_name from i_category where i_category.id = (select category from i_board where i_board.idx = i_board_comment.parent_idx))`;
        const subQuery3 = ` (select b_title from i_board where i_board.idx = i_board_comment.parent_idx)`;

        if (follow === 'board') {
            data = await i_board.findAll({
                where: whereCondition,
                order: [['idx', 'DESC']],
                attributes: [
                    'idx',
                    'category',
                    'm_name',
                    'b_title',
                    'b_contents',
                    'b_reg_date',
                    [Sequelize.literal(subQuery1), 'c_name'],
                    'a_read',
                ],
            });
        } else if (follow === 'comment') {
            data = await i_board_comment.findAll({
                where: whereCondition,
                order: [['idx', 'DESC']],
                attributes: [
                    'idx',
                    'board_idx',
                    'm_name',
                    [Sequelize.literal(subQuery3), 'b_title'],
                    'c_contents',
                    'c_reg_date',
                    [Sequelize.literal(subQuery2), 'c_name'],
                    'a_read',
                ],
            });
        } else {
            const boardData = await i_board.findAll({
                where: whereCondition,
                order: [['idx', 'DESC']],
                attributes: [
                    'idx',
                    'category',
                    'm_name',
                    'b_title',
                    'b_contents',
                    'b_reg_date',
                    [Sequelize.literal(subQuery1), 'c_name'],
                    'a_read',
                ],
            });

            const commentData = await i_board_comment.findAll({
                where: whereCondition,
                order: [['idx', 'DESC']],
                attributes: [
                    'idx',
                    'board_idx',
                    'm_name',
                    [Sequelize.literal(subQuery3), 'b_title'],
                    'c_contents',
                    'c_reg_date',
                    [Sequelize.literal(subQuery2), 'c_name'],
                    'a_read',
                ],
            });

            data = [...boardData, ...commentData];
        }

        data.sort((a, b) => {
            return new Date(b.b_reg_date || b.c_reg_date) - new Date(a.b_reg_date || a.c_reg_date);
        });

        const resultObj = {
            totalCnt: data.length,
            list: data.map(item => ({
                idx: item.idx,
                category: item.c_contents === undefined ? item.category : item.board_idx,
                follow: item.c_contents === undefined ? '게시글' : '댓글',
                c_name: item.getDataValue('c_name'),
                m_name: item.m_name,
                title: item.c_contents === undefined ? item.b_title : item.getDataValue('b_title'),
                content:
                    item.c_contents === undefined
                        ? cheerio.load(item.b_contents).text()
                        : cheerio.load(item.c_contents).text(),
                reg_date:
                    item.c_contents === undefined
                        ? moment(item.b_reg_date).format('YYYY.MM.DD HH:mm')
                        : moment(item.c_reg_date).format('YYYY.MM.DD HH:mm'),
                a_read: item.a_read === null ? enumConfig.readType.N : enumConfig.readType.Y,
            })),
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 게시글 알림 전체읽기, 삭제
exports.putFirstBoardAlarmReadDelete = async (req, res, next) => {
    const { follow, idx, flg } = req.body;
    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        let whereCondition;
        let readValue;
        let deleteValue;

        switch (follow) {
            case 'read':
                whereCondition = {
                    a_read: null,
                    a_delete: null,
                };
                readValue = 'Y';
                deleteValue = null;
                break;
            case 'delete':
                whereCondition = {
                    a_read: 'Y',
                    a_delete: null,
                };
                readValue = 'Y';
                deleteValue = 'Y';
                break;
            default:
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'follow 파라미터 에러');
        }

        if (idx) {
            utilMiddleware.validateIdx(idx, 'idx');

            whereCondition.idx = {
                [Op.eq]: idx,
            };
        }

        //if (req.user !== undefined) {
        //   whereCondition.m_email = {
        //      [Op.ne]: req.user,
        //   };
        //}

        if (flg !== '댓글') {
            const boardUpdate = await i_board.update(
                {
                    a_read: readValue,
                    a_delete: deleteValue,
                },
                {
                    where: whereCondition,
                    transaction,
                },
            );

            if (!boardUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }
        }

        if (flg !== '게시글') {
            const commentUpdate = await i_board_comment.update(
                {
                    a_read: readValue,
                    a_delete: deleteValue,
                },
                {
                    where: whereCondition,
                    transaction,
                },
            );

            if (!commentUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }
        }

        await transaction.commit();

        return errorHandler.successThrow(res, '', '');
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

// 최근 게시글 정보
exports.getFirstBoardCnt = async (req, res, next) => {
    try {
        // 게시글 조건
        const whereCondition = {
            idx: {
                [Op.in]: Sequelize.literal(`(
                        SELECT b.idx FROM i_board b JOIN i_category c 
                            ON c.id = b.category
                        WHERE c.c_use_yn = '${enumConfig.useType.Y[0]}'
                    )`),
            },
        };

        const boardTotalCnt = await i_board.count({ where: whereCondition });

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 오늘 게시글 조건
        whereCondition.b_reg_date = { [Op.between]: [currentDate, endOfDay] };

        const boardTodayCnt = await i_board.count({
            where: whereCondition,
        });

        // 댓글 조건
        const commentWhereCondition = {
            board_idx: {
                [Op.in]: Sequelize.literal(`(
                    SELECT b.idx FROM i_board b JOIN i_category c 
                        ON c.id = b.category
                    WHERE b.idx = i_board_comment.board_idx
                    AND c.c_use_yn = '${enumConfig.useType.Y[0]}'
                )`),
            },
        };

        // 오늘 댓글 조건
        commentWhereCondition.c_reg_date = { [Op.between]: [currentDate, endOfDay] };

        const commentTotalCnt = await i_board_comment.count({ where: commentWhereCondition });

        const commentTodayCnt = await i_board_comment.count({
            where: commentWhereCondition,
        });

        const resultObj = {
            boardTotalCnt: boardTotalCnt || 0,
            boardTodayCnt: boardTodayCnt || 0,
            commentTotalCnt: commentTotalCnt || 0,
            commentTodayCnt: commentTodayCnt || 0,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 관리자 최근 게시판 조회
exports.getFirstBoardList = async (req, res, next) => {
    const { limit = 5 } = req.params;

    try {
        // 게시글 조건
        const whereCondition = {
            idx: {
                [Op.in]: Sequelize.literal(`(
                        SELECT b.idx FROM i_board b JOIN i_category c 
                            ON c.id = b.category
                        WHERE c.c_use_yn = '${enumConfig.useType.Y[0]}'
                    )`),
            },
        };

        const result = await i_board.findAll({
            limit: parseInt(limit),
            where: whereCondition,
            attributes: [
                'idx',
                'category',
                'b_title',
                'b_reg_date',
                'b_notice',
                //[subQuery, "c_name"],
            ],
            include: [
                {
                    model: i_category,
                    as: 'icategory',
                    attributes: ['c_name'],
                    required: true,
                },
            ],

            order: [['idx', 'DESC']],
        });
        const resultObj = result.map(main => {
            const listObj = {
                idx: main.idx,
                category: main.category,
                b_title: main.b_title,
                month: moment(main.b_reg_date).format('YYYY.MM.DD HH:mm:ss'),
                b_notice: main.b_notice,
                c_name: main.icategory.c_name,
            };
            return listObj;
        });

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//게시판 이름 메뉴
exports.getFirstBoardName = async (req, res, next) => {
    try {
        const result = await i_category.findAll({
            where: {
                c_use_yn: enumConfig.useType.Y[0],
                c_content_type: {
                    [Op.in]: [
                        //enumConfig.contentType.CUSTOM[0],
                        enumConfig.contentType.BOARD[0],
                        enumConfig.contentType.GALLERY[0],
                        enumConfig.contentType.FAQ[0],
                        enumConfig.contentType.QNA[0],
                    ],
                },
            },
            attributes: ['id', 'c_depth', 'c_name', 'c_reg_date', 'c_content_type'],
            order: [['id', 'ASC']],
        });

        const resultObj = result.map(main => {
            const listObj = {
                category: main.id,
                c_depth: main.c_depth,
                c_name: main.c_name,
                c_content_type: main.c_content_type,
            };
            return listObj;
        });

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//최근 접속자 정보
exports.getFirstConnectorCnt = async (req, res, next) => {
    try {
        const memberTotalCnt = await i_member.count({
            where: { m_level: { [Op.lt]: enumConfig.userLevel.USER_LV9 } },
        });

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const memberTodayCnt = await i_member.count({
            where: {
                reg_date: {
                    [Op.between]: [currentDate, endOfDay],
                },
            },
        });

        const logsTotalCnt = await i_logs.count({ where: { previousUrl: { [Op.notLike]: '/v1%' } } });

        const logsTodayCnt = await i_logs.count({
            where: {
                previousUrl: { [Op.notLike]: '/v1%' },
                reg_date: {
                    [Op.between]: [currentDate, endOfDay],
                },
            },
        });

        const resultObj = {
            memberTotalCnt: memberTotalCnt || 0,
            memberTodayCnt: memberTodayCnt || 0,
            logsTotalCnt: logsTotalCnt || 0,
            logsTodayCnt: logsTodayCnt || 0,
        };
        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//접속자 이력 조회
exports.getFirstConnectorList = async (req, res, next) => {
    const { limit = 5 } = req.params;

    try {
        const result = await i_logs.findAll({
            limit: parseInt(limit),
            attributes: ['id', 'user', 'clientIp', 'previousUrl', 'userAgent', 'reg_date'],
            order: [['id', 'DESC']],
        });

        const resultObj = result.map(main => {
            const listObj = {
                id: main.id,
                user: main.user,
                clientIp: main.clientIp,
                previousUrl: main.previousUrl,
                userAgent: utilMiddleware.extractBrowserVersion(main.userAgent),
                reg_date: moment(main.reg_date).format('YYYY.MM.DD HH:mm:ss'),
            };
            return listObj;
        });

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};
