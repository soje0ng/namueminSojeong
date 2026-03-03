const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_board, i_board_comment, i_board_file, i_category, i_category_board } = require('../models');
const multerMiddleware = require('../middleware/multer');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const boardAuth = require('../middleware/boardAuth');
const utilMiddleware = require('../middleware/util');
const db = require('../models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const he = require('he');

// 게시글 메인 리스트
// 2023.08.30 ash
exports.getBoardMain = async (req, res, next) => {
    const { category, limit = 5 } = req.params;

    try {
        utilMiddleware.validateIdx(category, 'category');

        const result = await i_board.findAll({
            limit: parseInt(limit),
            where: {
                category: category,
                b_depth: 0,
            },
            order: [['idx', 'DESC']],
            attributes: ['idx', 'category', 'b_depth', 'b_title', 'b_reg_date', 'b_notice', 'b_contents', 'b_file'],
        });

        const resultObj = result.map(item => ({
            idx: item.idx,
            category: item.category,
            b_title: item.b_title,
            b_reg_date: moment(item.b_reg_date).format('YYYY.MM.DD'),
            b_notice: item.b_notice,
            b_contents: item.b_contents.replace(/<[^>]*>/g, ''),
            b_file: item.b_file,
        }));

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 게시글 리스트
// 2023.08.30 ash
exports.getBoardList = async (req, res, next) => {
    const { category, getLimit } = req.params;
    const page = parseInt(req.query.page) || 1;
    const group_id = req.query.group_id;
    const orderBy = req.query.orderBy;

    try {
        utilMiddleware.validateIdx(category, 'category');

        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';

        const whereCondition = {
            category: category,
            b_depth: 0,
        };

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'title') {
                whereCondition.b_title = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'contents') {
                whereCondition.b_contents = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'name') {
                whereCondition.m_name = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'titlecontents') {
                whereCondition[Op.or] = [
                    {
                        b_title: {
                            [Op.like]: `%${searchTxtQuery}%`,
                        },
                    },
                    {
                        b_contents: {
                            [Op.like]: `%${searchTxtQuery}%`,
                        },
                    },
                ];
            }
        }

        if (group_id) {
            whereCondition.group_id = {
                [Op.eq]: group_id,
            };
        }

        let orderField;
        if (orderBy === 'title') {
            orderField = [
                ['b_title', 'ASC'],
                ['b_num', 'DESC'],
                ['idx', 'DESC'],
            ];
        } else if (orderBy === 'view') {
            orderField = [
                ['b_view', 'ASC'],
                ['b_num', 'DESC'],
                ['idx', 'DESC'],
            ];
        } else {
            orderField = [
                ['b_notice', 'DESC'],
                ['b_num', 'DESC'],
                [Sequelize.fn('IFNULL', Sequelize.col('parent_id'), Sequelize.col('idx')), 'DESC'],
                ['parent_id', 'ASC'],
                ['idx', 'DESC'],
            ];
        }

        const subQuery = `(SELECT COUNT(*) FROM i_board_comment WHERE i_board_comment.board_idx = i_board.idx)`;
        const subQuery2 = `(SELECT c_content_type FROM i_category WHERE i_category.id = i_board.category)`;
        const subQuery3 =
            `(SELECT COUNT(*) FROM i_board_file WHERE i_board_file.parent_idx = i_board.idx and i_board_file.kind = '` +
            enumConfig.boardFileType.B[0] +
            `')`;
        const subQuery4 = `(SELECT g_name FROM i_category_board_group WHERE i_category_board_group.id = i_board.group_id and i_category_board_group.use_yn = 'Y')`;

        const subQuery5 = `(SELECT COUNT(*) FROM i_board AS reply_board WHERE reply_board.parent_id = i_board.idx AND b_depth > ${whereCondition.b_depth})`;

        // const subQuery2 = Sequelize.literal(`
        //    (SELECT c_name FROM i_category WHERE i_category.id = i_board.category)
        // `);

        const boardItemResult = await boardAuth.boardListItem(category);

        if (boardItemResult) {
            if (boardItemResult.statusCode) {
                return errorHandler.errorThrow(boardItemResult.statusCode, boardItemResult.message);
            }
        }

        const limit = parseInt(getLimit) || boardItemResult.b_list_cnt;

        const offset = (page - 1) * limit;
        const result = await i_board.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: [
                'idx',
                'category',
                'parent_id',
                'b_depth',
                'b_notice',
                'b_view',
                'b_secret',
                'b_title',
                'b_contents',
                'm_email',
                'm_name',
                'b_reply',
                'b_num',
                'b_img',
                [Sequelize.literal(subQuery), 'comment_count'],
                [Sequelize.literal(subQuery2), 'c_content_type'],
                [Sequelize.literal(subQuery3), 'file_count'],
                [Sequelize.literal(subQuery4), 'g_name'],
                [Sequelize.literal(subQuery5), 'reply_count'],
                ...boardItemResult.boardItem,
            ],
            include: [
                {
                    model: i_category,
                    as: 'icategory',
                    attributes: ['c_name'],
                    required: true,
                },
            ],
        });

        const sanitizeHtml = html => {
            // HTML 태그 제거 후 HTML 엔티티 디코딩
            return he.decode(html.replace(/<\/?[^>]+(>|$)/g, ''));
        };

        const formattedResult = await Promise.all(
            result.rows.map(async (list, index) => {
                const rawContents = list.b_contents || '';
                const contents = boardItemResult.b_gallery_type === '3' ? rawContents : sanitizeHtml(rawContents);

                // childBoard 조회
                let childBoard = [];
                if (list.getDataValue('reply_count') > 0) {
                    const child = await i_board.findAll({
                        where: {
                            parent_id: list.idx,
                            b_depth: { [Op.gt]: list.b_depth },
                        },
                        order: [['idx', 'ASC']],
                        attributes: ['idx'],
                        raw: true,
                    });
                    childBoard = child.map(item => item.idx);
                }

                return {
                    idx: list.idx,
                    num: list.b_notice === '1' ? '공지' : result.count - (offset + index),
                    category: list.category,
                    b_depth: list.b_depth,
                    b_title: list.b_title,
                    b_contents: contents,
                    b_contents_tag: rawContents,
                    m_email: list.m_email,
                    m_name: list.m_name,
                    b_reg_date: moment(list.b_reg_date).format('YYYY.MM.DD'),
                    b_notice: list.b_notice,
                    b_view: list.b_view,
                    b_img: list.b_img,
                    b_file: list.getDataValue('file_count'),
                    b_recom: list.b_recom,
                    b_secret: list.b_secret,
                    comment_count: list.getDataValue('comment_count'),
                    reply_count: list.getDataValue('reply_count'),
                    c_content_type: list.getDataValue('c_content_type'),
                    g_name: list.getDataValue('g_name'),
                    g_status:
                        list.getDataValue('reply_count') > 0
                            ? '답변완료'
                            : list.b_reply !== null
                            ? '답변완료'
                            : '답변대기',
                    c_name: list.icategory.c_name,
                    b_num: list.b_num,
                    childBoard, // ✅ 추가됨
                };
            }),
        );

        const BoardName = await i_category.findAll({
            where: {
                id: { [Op.ne]: [category] },
                c_use_yn: enumConfig.useType.Y[0],
                c_content_type: boardItemResult.c_content_type,
            },
            attributes: ['id', 'c_depth', 'c_name', 'c_reg_date', 'c_content_type'],
            order: [['id', 'ASC']],
        });

        const boardNameResult = BoardName.map(main => {
            const listObj = {
                category: main.id,
                c_depth: main.c_depth,
                c_name: main.c_name,
                c_content_type: main.c_content_type,
            };
            return listObj;
        });

        const count = result.count;
        const pagination = utilMiddleware.paginationCalc(count, page, limit);

        const resultObj = {
            ...pagination,
            c_content_type: boardItemResult.c_content_type, //게시판 유형
            b_column_title: boardItemResult.b_column_title, //제목 노출 여부
            b_column_date: boardItemResult.b_column_date, //등록일자 노출 여부
            b_column_view: boardItemResult.b_column_view, //조회수 노출 여부
            b_column_recom: boardItemResult.b_column_recom, //추천수 노출 여부
            b_column_file: boardItemResult.b_column_file, //파일 노출 여부
            b_thumbnail_with: boardItemResult.b_thumbnail_with, //갤러리 게시판 썸네일 가로 사이즈
            b_thumbnail_height: boardItemResult.b_thumbnail_height, // 썸네일 세로 사이즈
            b_read_lv: boardItemResult.b_read_lv, //읽기권한
            b_write_lv: boardItemResult.b_write_lv, //쓰기권한
            b_group: boardItemResult.b_group, //게시판 분류 사용 여부
            b_secret: boardItemResult.b_secret, //비밀글 설정
            b_reply: boardItemResult.b_reply, //답변사용 여부
            b_reply_lv: boardItemResult.b_reply_lv, //답변사용권한
            b_comment: boardItemResult.b_comment, //댓글사용 여부
            b_comment_lv: boardItemResult.b_comment_lv, //댓글사용권한
            b_write_alarm: boardItemResult.b_write_alarm, //작성자 답변 알림 여부
            b_write_send: boardItemResult.b_write_send, //작성자 답변 알림 전송 구분 (이메일, 문자)
            b_write_sms: boardItemResult.b_write_sms,
            b_alarm: boardItemResult.b_alarm, //게시 알림 여부
            b_alarm_phone: boardItemResult.b_alarm_phone, //게시 알림 전송 휴대폰 번호
            b_top_html: boardItemResult.b_top_html, //게시판 상단 HTML 내용
            b_template: boardItemResult.b_template, // 게시글 템플릿 적용
            b_template_text: boardItemResult.b_template_text, //템플릿 내용
            board_Name: boardNameResult,
            data_list: formattedResult,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 본인 게시물 리스트
exports.postMyBoardList = async (req, res, next) => {
    const { category, getLimit, m_email } = req.body;
    const page = parseInt(req.query.page) || 1;
    const orderBy = req.query.orderBy;
    //const group_id = req.query.group_id;

    try {
        utilMiddleware.validateIdx(category, 'category');

        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            category: category,
            b_depth: 0,
        };

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'title') {
                whereCondition.b_title = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'contents') {
                whereCondition.b_contents = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'name') {
                whereCondition.m_name = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'titlecontents') {
                whereCondition[Op.or] = [
                    {
                        b_title: {
                            [Op.like]: `%${searchTxtQuery}%`,
                        },
                    },
                    {
                        b_contents: {
                            [Op.like]: `%${searchTxtQuery}%`,
                        },
                    },
                ];
            }
        }

        if (m_email) {
            if (!req.user) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '토큰 정보가 없습니다.');
            } else {
                whereCondition.m_email = {
                    [Op.eq]: req.user,
                };
            }
        } else {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        let orderField;
        if (orderBy === 'title') {
            orderField = [
                ['b_title', 'ASC'],
                ['b_num', 'DESC'],
                ['idx', 'DESC'],
            ];
        } else if (orderBy === 'view') {
            orderField = [
                ['b_view', 'ASC'],
                ['b_num', 'DESC'],
                ['idx', 'DESC'],
            ];
        } else {
            orderField = [
                ['b_notice', 'DESC'],
                ['b_num', 'DESC'],
                [Sequelize.fn('IFNULL', Sequelize.col('parent_id'), Sequelize.col('idx')), 'DESC'],
                ['parent_id', 'ASC'],
                ['idx', 'DESC'],
            ];
        }

        const subQuery = `(SELECT COUNT(*) FROM i_board_comment WHERE i_board_comment.board_idx = i_board.idx)`;
        const subQuery2 = `(SELECT c_content_type FROM i_category WHERE i_category.id = i_board.category)`;
        const subQuery3 =
            `(SELECT COUNT(*) FROM i_board_file WHERE i_board_file.parent_idx = i_board.idx and i_board_file.kind = '` +
            enumConfig.boardFileType.B[0] +
            `')`;
        const subQuery4 = `(SELECT g_name FROM i_category_board_group WHERE i_category_board_group.id = i_board.group_id)`;

        const subQuery5 = `(SELECT COUNT(*) FROM i_board AS reply_board WHERE reply_board.parent_id = i_board.idx AND b_depth > ${whereCondition.b_depth})`;

        // const subQuery2 = Sequelize.literal(`
        //    (SELECT c_name FROM i_category WHERE i_category.id = i_board.category)
        // `);

        const boardItemResult = await boardAuth.boardListItem(category);

        if (boardItemResult) {
            if (boardItemResult.statusCode) {
                return errorHandler.errorThrow(boardItemResult.statusCode, boardItemResult.message);
            }
        }

        const limit = parseInt(getLimit) || boardItemResult.b_list_cnt;

        const offset = (page - 1) * limit;
        const result = await i_board.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: [
                'idx',
                'category',
                'parent_id',
                'b_depth',
                'b_notice',
                'b_view',
                'b_secret',
                'b_title',
                'm_email',
                'm_name',
                'b_reply',
                'b_num',
                'b_img',
                [Sequelize.literal(subQuery), 'comment_count'],
                [Sequelize.literal(subQuery2), 'c_content_type'],
                [Sequelize.literal(subQuery3), 'file_count'],
                [Sequelize.literal(subQuery4), 'g_name'],
                [Sequelize.literal(subQuery5), 'reply_count'],
                ...boardItemResult.boardItem,
            ],
            include: [
                {
                    model: i_category,
                    as: 'icategory',
                    attributes: ['c_name'],
                    required: true,
                },
            ],
        });

        const formattedResult = result.rows.map((list, index) => ({
            idx: list.idx,
            num: list.b_notice === '1' ? '공지' : result.count - (offset + index),
            category: list.category,
            b_depth: list.b_depth,
            b_title: list.b_title,
            m_email: list.m_email,
            m_name: list.m_name,
            b_reg_date: moment(list.b_reg_date).format('YYYY.MM.DD'),
            b_notice: list.b_notice,
            b_view: list.b_view,
            b_img: list.b_img,
            b_file: list.getDataValue('file_count'),
            b_recom: list.b_recom,
            b_secret: list.b_secret,
            comment_count: list.getDataValue('comment_count'),
            reply_count: list.getDataValue('reply_count'),
            c_content_type: list.getDataValue('c_content_type'),
            g_name: list.getDataValue('g_name'),
            g_status:
                list.getDataValue('reply_count') > 0 ? '답변완료' : list.b_reply !== null ? '답변완료' : '답변대기',
            c_name: list.icategory.c_name,
            b_num: list.b_num, // 게시글 순서
        }));

        const BoardName = await i_category.findAll({
            where: {
                id: { [Op.ne]: [category] },
                c_use_yn: enumConfig.useType.Y[0],
                c_content_type: boardItemResult.c_content_type,
            },
            attributes: ['id', 'c_depth', 'c_name', 'c_reg_date', 'c_content_type'],
            order: [['id', 'ASC']],
        });

        const boardNameResult = BoardName.map(main => {
            const listObj = {
                category: main.id,
                c_depth: main.c_depth,
                c_name: main.c_name,
                c_content_type: main.c_content_type,
            };
            return listObj;
        });

        const count = result.count;
        const pagination = utilMiddleware.paginationCalc(count, page, limit);

        const resultObj = {
            ...pagination,
            c_content_type: boardItemResult.c_content_type, //게시판 유형
            b_column_title: boardItemResult.b_column_title, //제목 노출 여부
            b_column_date: boardItemResult.b_column_date, //등록일자 노출 여부
            b_column_view: boardItemResult.b_column_view, //조회수 노출 여부
            b_column_recom: boardItemResult.b_column_recom, //추천수 노출 여부
            b_column_file: boardItemResult.b_column_file, //파일 노출 여부
            b_thumbnail_with: boardItemResult.b_thumbnail_with, //갤러리 게시판 썸네일 가로 사이즈
            b_thumbnail_height: boardItemResult.b_thumbnail_height, // 썸네일 세로 사이즈
            b_read_lv: boardItemResult.b_read_lv, //읽기권한
            b_write_lv: boardItemResult.b_write_lv, //쓰기권한
            b_group: boardItemResult.b_group, //게시판 분류 사용 여부
            b_secret: boardItemResult.b_secret, //비밀글 설정
            b_reply: boardItemResult.b_reply, //답변사용 여부
            b_reply_lv: boardItemResult.b_reply_lv, //답변사용권한
            b_comment: boardItemResult.b_comment, //댓글사용 여부
            b_comment_lv: boardItemResult.b_comment_lv, //댓글사용권한
            b_write_alarm: boardItemResult.b_write_alarm, //작성자 답변 알림 여부
            b_write_send: boardItemResult.b_write_send, //작성자 답변 알림 전송 구분 (이메일, 문자)
            b_write_sms: boardItemResult.b_write_sms,
            b_alarm: boardItemResult.b_alarm, //게시 알림 여부
            b_alarm_phone: boardItemResult.b_alarm_phone, //게시 알림 전송 휴대폰 번호
            b_top_html: boardItemResult.b_top_html, //게시판 상단 HTML 내용
            b_template: boardItemResult.b_template, // 게시글 템플릿 적용
            b_template_text: boardItemResult.b_template_text, //템플릿 내용
            board_Name: boardNameResult,
            data_list: formattedResult,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//게시글 내용 보기
// 2023.08.30 ash
exports.getBoardView = async (req, res, next) => {
    const { category, idx } = req.params;
    const pass = req.query.pass || enumConfig.passTrueFalse.F[0];

    try {
        utilMiddleware.validateIdx(category, 'category');
        utilMiddleware.validateIdx(idx, 'idx');

        //게시판 보기 권한 확인
        // const authorizationResult = await boardAuth.authorizeUser(
        //    category,
        //    enumConfig.boardAuthType.READ,
        //    req.level
        // );

        // if (authorizationResult) {
        //    return errorHandler.errorThrow(
        //       authorizationResult.statusCode,
        //       authorizationResult.message
        //    );
        // }

        const viewUpdate = await i_board.update(
            {
                b_view: Sequelize.literal('b_view + 1'),
            },
            {
                where: {
                    category: category,
                    idx: idx,
                },
            },
        );

        const subQuery = `(SELECT COUNT(*) FROM i_board_comment WHERE i_board_comment.board_idx = i_board.idx)`;
        const subQuery2 = `(SELECT c_content_type FROM i_category WHERE i_category.id = i_board.category)`;
        const subQuery4 = `(SELECT g_name FROM i_category_board_group WHERE i_category_board_group.id = i_board.group_id)`;
        const subQuery5 = `(SELECT COUNT(*) FROM i_board AS reply_board WHERE reply_board.parent_id = i_board.idx AND reply_board.b_depth > i_board.b_depth)`;

        const result = await i_board.findOne({
            where: {
                category: category,
                idx: idx,
            },
            attributes: [
                'idx',
                'category',
                'm_email',
                'm_name',
                'm_pwd',
                'b_title',
                'b_contents',
                'b_reg_date',
                'parent_id',
                'b_depth',
                'b_notice',
                'b_view',
                'b_img',
                'b_file',
                'b_sms_yn',
                'b_sms_phone',
                'b_email_yn',
                'b_email',
                'b_secret',
                'b_reply',
                'group_id',
                [Sequelize.literal(subQuery), 'comment_count'],
                [Sequelize.literal(subQuery5), 'reply_count'],
                [Sequelize.literal(subQuery4), 'g_name'],
                [Sequelize.literal(subQuery2), 'c_content_type'],
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        if (result.b_secret) {
            if (pass !== enumConfig.passTrueFalse.T[0]) {
                if (res.user !== result.m_email && res.level !== enumConfig.userLevel.USER_LV9) {
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '비밀글 입니다.');
                }
            }
        }

        const [prevBoard, nextBoard] = await Promise.all([
            i_board.findOne({
                where: {
                    category: category,
                    b_depth: { [Op.eq]: 0 },
                    idx: { [Op.lt]: idx },
                },
                order: [['idx', 'DESC']],
                attributes: ['idx', 'b_title'],
            }),
            i_board.findOne({
                where: {
                    category: category,
                    b_depth: { [Op.eq]: 0 },
                    idx: { [Op.gt]: idx },
                },
                order: [['idx', 'ASC']],
                attributes: ['idx', 'b_title'],
            }),
        ]);

        const boardFileViews = await i_board_file.findAll({
            where: {
                parent_idx: idx,
                kind: enumConfig.boardFileType.B[0],
            },
            attributes: ['idx', 'parent_idx', 'file_name', 'original_name'],
            raw: true,
        });

        let childBoard = [];
        if (result.getDataValue('reply_count') > 0) {
            const child = await i_board.findAll({
                where: {
                    parent_id: result.idx,
                    b_depth: { [Op.gt]: result.b_depth },
                },
                order: [['idx', 'ASC']],
                attributes: ['idx'],
                raw: true,
            });
            childBoard = child.map(item => item.idx);
        }

        const resultObj = {
            idx: result.idx,
            category: result.category,
            m_email: result.m_email,
            m_name: result.m_name,
            m_pwd: result.m_pwd,
            b_title: result.b_title,
            b_contents: result.b_contents,
            b_reg_date: moment(result.b_reg_date).format('YYYY.MM.DD'),
            parent_id: result.parent_id,
            b_depth: result.b_depth,
            b_notice: result.b_notice,
            b_view: result.b_view,
            b_img: result.b_img,
            b_file: boardFileViews,
            b_sms_yn: result.b_sms_yn,
            b_sms_phone: result.b_sms_phone,
            b_email_yn: result.b_email_yn,
            b_email: result.b_email,
            b_secret: result.b_secret,
            b_reply: result.b_reply,
            group_id: result.group_id,
            c_content_type: result.getDataValue('c_content_type'),
            comment_count: result.getDataValue('comment_count'),
            reply_count: result.getDataValue('reply_count'),
            g_name: result.getDataValue('g_name'),
            reply_idx: childBoard,
            // prev_board: prevBoard !== null ? prevBoard : false,
            // next_board: nextBoard !== null ? nextBoard : false,
            prev_board: prevBoard
                ? {
                      idx: prevBoard.idx,
                      b_title: prevBoard.b_title,
                  }
                : null,
            next_board: nextBoard
                ? {
                      idx: nextBoard.idx,
                      b_title: nextBoard.b_title,
                  }
                : null,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//게시글 등록
// 2023.08.30 ash
exports.postBoardCreate = async (req, res, next) => {
    const {
        category,
        m_email,
        m_name,
        m_pwd,
        b_title,
        b_contents,
        parent_id,
        b_depth,
        b_notice,
        b_img,
        b_file,
        b_sms_yn,
        b_sms_phone,
        b_email_yn,
        b_secret,
        group_id,
    } = req.body;

    try {
        utilMiddleware.validateIdx(category, 'category');

        let hashedPw;
        if (m_pwd) {
            hashedPw = await bcrypt.hash(m_pwd, 12);
        } else {
            hashedPw = m_pwd;
        }

        const board_b_file = req.files['b_file'];
        const board_b_img = req.files['b_img'];

        const processedContents = await utilMiddleware.base64ToImagesPath(b_contents);

        let boardCreate;
        await db.mariaDBSequelize.transaction(async transaction => {
            const maxBNumResult = await i_board.findOne({
                where: {
                    category: category,
                    b_depth: 0,
                    parent_id: null,
                },
                attributes: [[Sequelize.fn('MAX', Sequelize.col('b_num')), 'max_b_num']],
                raw: true,
                transaction,
            });

            const newBNum = (maxBNumResult?.max_b_num || 0) + 1;

            boardCreate = await i_board.create(
                {
                    category: category,
                    m_email: m_email ? m_email : req.user,
                    m_name: m_name,
                    m_pwd: hashedPw,
                    b_title: b_title,
                    b_contents: processedContents.temp_contents,
                    parent_id: parent_id ? parent_id : null,
                    b_depth: b_depth ? b_depth : 0,
                    b_notice: b_notice ? b_notice : '0',
                    b_img: board_b_img ? board_b_img[0].path : null,
                    b_sms_yn: b_sms_yn,
                    b_sms_phone: b_sms_phone,
                    b_email_yn: b_email_yn,
                    b_secret: b_secret,
                    group_id: group_id ? group_id : null,
                    b_num: newBNum,
                },
                { transaction },
            );

            if (!boardCreate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            if (board_b_file) {
                for (let index = 0; index < board_b_file.length; index++) {
                    const boardFileCreate = await i_board_file.create(
                        {
                            parent_idx: boardCreate.getDataValue('idx'),
                            file_name: board_b_file[index].path,
                            // original_name: Buffer.from(
                            //    board_b_file[index].originalname,
                            //    'latin1'
                            // ).toString('utf8'),
                            original_name: board_b_file[index].originalname,
                            kind: enumConfig.boardFileType.B[0],
                        },
                        { transaction },
                    );
                    if (!boardFileCreate) {
                        return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
                    }
                }
            }

            //에디터 이미지 경로 저장
            if (processedContents.imagePaths) {
                for (const editFile of processedContents.imagePaths) {
                    const editFileCreate = await i_board_file.create(
                        {
                            parent_idx: boardCreate.getDataValue('idx'),
                            file_name: editFile,
                            kind: enumConfig.boardFileType.E[0],
                        },
                        { transaction },
                    );
                }
            }
        });

        // 게시판 설정 땡겨유~
        const boardItem = await boardAuth.boardListItem(category);

        //게시판 등록 알림 일 경우 등록된 번호로 SMS 발송
        if (boardItem.b_alarm === enumConfig.receiptType.Y[0]) {
            // if (boardItem.b_alarm_phone) {
            // } else {
            //     const sendResult = await utilMiddleware.postEmailSendGun(
            //         res,
            //         '',
            //         req.user,
            //         b_title + ' 게시글이 등록 되었습니다.',
            //         processedContents.temp_contents,
            //     );
            // }
            if (boardItem.b_alarm_email) {
                const sendResult = await utilMiddleware.postEmailSendGun(
                    res,
                    boardItem.b_alarm_email,
                    req.user,
                    b_title + ' 게시글이 등록 되었습니다.',
                    processedContents.temp_contents,
                );
            }
        }

        //답변 게시물
        if (boardItem.b_write_alarm === enumConfig.receiptType.Y[0]) {
            if (b_depth > 0) {
                // boardItem.b_write_send 작성자 이메일 or 문자 발송
            }
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

//답변 등록
exports.postBoardReplyUpdate = async (req, res, next) => {
    const { category, idx, b_reply } = req.body;

    try {
        utilMiddleware.validateIdx(category, 'category');
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_board.findOne({
            where: {
                category: category,
                idx: idx,
            },
            attributes: ['idx'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const boardUpdate = await i_board.update(
            {
                b_reply: b_reply,
            },
            {
                where: {
                    category: category,
                    idx: idx,
                },
            },
        );

        if (!boardUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', boardUpdate);
    } catch (err) {
        next(err);
    }
};

//게시글 수정
// 2023.08.30 ash
exports.putBoardUpdate = async (req, res, next) => {
    const {
        idx,
        category,
        m_email,
        m_name,
        m_pwd,
        b_title,
        b_contents,
        b_depth,
        b_notice,
        b_img,
        b_img_name,
        b_file,
        b_secret,
        b_sms_yn,
        b_sms_phone,
        b_email_yn,
        group_id,
        pass,
    } = req.body;

    try {
        utilMiddleware.validateIdx(category, 'category');
        utilMiddleware.validateIdx(idx, 'idx');

        let boardUpdate;
        await db.mariaDBSequelize.transaction(async transaction => {
            const result = await i_board.findOne({
                where: {
                    category: category,
                    idx: idx,
                },
                attributes: ['idx', 'category', 'm_email', 'b_file', 'b_img'],
                transaction,
            });

            if (!result) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            if (pass !== enumConfig.passTrueFalse.T[0]) {
                if (req.user !== undefined) {
                    if (req.user !== result.m_email && req.level !== enumConfig.userLevel.USER_LV9) {
                        return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
                    }
                }
            }

            const board_b_file = req.files['b_file'];
            const board_b_img = req.files['b_img'];

            // if (board_b_file) {
            //    if (
            //       result.b_file !== null &&
            //       result.b_file !== board_b_file[0].path
            //    ) {
            //       await multerMiddleware.clearFile(result.b_file);
            //    }
            // }

            if (board_b_file) {
                for (let index = 0; index < board_b_file.length; index++) {
                    const boardFileCreate = await i_board_file.create(
                        {
                            parent_idx: idx,
                            file_name: board_b_file[index].path,
                            //original_name: Buffer.from(
                            //   board_b_file[index].originalname,
                            //   'latin1'
                            //).toString('utf8'),
                            original_name: board_b_file[index].originalname,
                            kind: enumConfig.boardFileType.B[0],
                        },
                        { transaction },
                    );
                    if (!boardFileCreate) {
                        return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
                    }
                }
            }

            if (board_b_img) {
                if (result.b_img !== null && result.b_img !== board_b_img[0].path) {
                    await multerMiddleware.clearFile(result.b_img);
                }
            }

            const processedContents = await utilMiddleware.base64ToImagesPath(b_contents);

            //에디터 이미지 경로 저장
            if (processedContents.imagePaths) {
                for (const editFile of processedContents.imagePaths) {
                    const editFileCreate = await i_board_file.create(
                        {
                            parent_idx: idx,
                            file_name: editFile,
                            kind: enumConfig.boardFileType.E[0],
                        },
                        { transaction },
                    );
                }
            }

            boardUpdate = await i_board.update(
                {
                    m_email: m_email,
                    m_name: m_name,
                    b_title: b_title,
                    b_contents: processedContents.temp_contents,
                    b_depth: b_depth ? b_depth : 0,
                    b_notice: b_notice ? b_notice : '0',
                    b_img: board_b_img ? board_b_img[0].path : b_img_name,
                    b_secret: b_secret,
                    b_sms_yn: b_sms_yn,
                    b_sms_phone: b_sms_phone,
                    b_email_yn: b_email_yn,
                    group_id: group_id,
                },
                {
                    where: {
                        category: category,
                        idx: idx,
                    },
                    transaction,
                },
            );

            if (!boardUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }
        });

        return errorHandler.successThrow(res, '', boardUpdate);
    } catch (err) {
        next(err);
    }
};

//게시글 삭제
// 2023.09.08 ash
exports.deleteBoardDestroy = async (req, res, next) => {
    const { idx, category, pass } = req.body;
    let transaction;

    try {
        utilMiddleware.validateIdx(category, 'category');

        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            category: category,
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_board.findAll({
            where: whereCondition,
            attributes: ['idx', 'category', 'm_email', 'b_file', 'b_img'],
            transaction,
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No boards found');
        }

        if (pass !== enumConfig.passTrueFalse.T[0]) {
            for (const boardView of result) {
                if (req.user !== boardView.m_email && req.level !== enumConfig.userLevel.USER_LV9) {
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], 'No authorization');
                }

                //if (boardView.b_file) {
                //   await multerMiddleware.clearFile(boardView.b_file);
                //}

                if (boardView.b_img) {
                    await multerMiddleware.clearFile(boardView.b_img);
                }
            }
        }

        const boardDelete = await i_board.destroy({
            where: whereCondition,
            transaction,
        });

        if (!boardDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제 할 게시물이 없습니다.');
        }

        //첨부파일 삭제
        const boardFileViews = await i_board_file.findAll({
            where: {
                parent_idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
            },
            attributes: ['file_name'],
            transaction,
        });

        for (const boardFile of boardFileViews) {
            if (boardFile.file_name) {
                await multerMiddleware.clearFile(boardFile.file_name);
            }
        }

        const boardFileDelete = await i_board_file.destroy({
            where: {
                parent_idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
            },
            transaction,
        });

        await transaction.commit();

        return errorHandler.successThrow(res, '', boardDelete);
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

// 게시글 첨부파일 삭제
exports.deleteBoardFileDestroy = async (req, res, next) => {
    const { idx, parent_idx } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_board_file.findAll({
            where: whereCondition,
            attributes: ['idx', 'parent_idx', 'file_name'],
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No boards File found');
        }

        for (const boardFile of result) {
            if (boardFile.file_name) {
                await multerMiddleware.clearFile(boardFile.file_name);
            }
        }

        const boardFileDelete = await i_board_file.destroy({
            where: whereCondition,
        });

        return errorHandler.successThrow(res, '', boardFileDelete);
    } catch (err) {
        next(err);
    }
};

// 게시글 비밀번호 확인
exports.postBoardPassword = async (req, res, next) => {
    const { idx, password } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_board.findOne({
            where: {
                idx: idx,
            },
            attributes: ['idx', 'm_pwd'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const isEqual = await bcrypt.compare(password, result.m_pwd);

        if (!isEqual) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '비밀번호가 다릅니다.');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// 게시글 이동
// 2023.09.08 ash
exports.putBoardMove = async (req, res, next) => {
    const { idx, category } = req.body;

    try {
        utilMiddleware.validateIdx(category, 'category');

        const whereCondition = {
            //category: category,
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const boardMoves = await i_board.update(
            {
                category: category,
                b_depth: 0,
            },
            {
                where: whereCondition,
            },
        );

        if (!boardMoves) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '이동 할 게시물이 없습니다.');
        }

        return errorHandler.successThrow(res, '', boardMoves);
    } catch (err) {
        next(err);
    }
};

// 게시글 공지 설정
// 2023.09.11 ash
exports.putBoardNotice = async (req, res, next) => {
    const { notice, idx, category } = req.body;

    try {
        utilMiddleware.validateIdx(category, 'category');

        const whereCondition = {
            category: category,
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
            b_depth: 0,
        };

        const boardNotice = await i_board.update(
            {
                b_notice: notice || 1,
            },
            {
                where: whereCondition,
            },
        );

        if (!boardNotice) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// 게시글 첨부파일 다운로드
exports.getFileDownload = async (req, res, next) => {
    const { parent_idx, idx } = req.params;

    try {
        utilMiddleware.validateIdx(parent_idx, 'parent_idx');
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_board_file.findOne({
            where: {
                parent_idx: parent_idx,
                idx: idx,
            },
            attributes: ['file_name', 'original_name'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const originalFileName = result.original_name;
        const changedFileName = result.file_name;

        const filePath = path.join(__dirname, '../../', changedFileName);

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(originalFileName));
            res.setHeader('Content-Type', 'application/octet-stream');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'File not found');
        }
    } catch (err) {
        next(err);
    }
};

// 게시글 리스트 순서 변경
exports.putBoardMoveOrder = async (req, res, next) => {
    const { idx, category, b_num } = req.body;
    let transaction;

    try {
        utilMiddleware.validateIdx(category, 'category');
        utilMiddleware.validateIdx(idx, 'idx');

        transaction = await db.mariaDBSequelize.transaction();

        const result = await i_board.findOne({
            attributes: ['idx', 'b_num'],
            where: {
                idx: idx,
                b_depth: 0,
                category: category,
                parent_id: null,
            },
            transaction,
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '해당 게시글이 없습니다.');
        }

        let moveDirection;
        if (b_num < result.b_num) {
            moveDirection = 'UP';
        }

        if (b_num > result.b_num) {
            moveDirection = 'DOWN';
        }

        if (moveDirection === 'UP') {
            await i_board.update(
                {
                    b_num: Sequelize.literal('b_num + 1'),
                },
                {
                    where: {
                        b_num: {
                            [Op.gte]: b_num,
                            [Op.lt]: result.b_num,
                        },
                        category: category,
                        b_depth: 0,
                        parent_id: null,
                    },
                    transaction,
                },
            );
        }

        if (moveDirection === 'DOWN') {
            await i_board.update(
                {
                    b_num: Sequelize.literal('b_num - 1'),
                },
                {
                    where: {
                        b_num: {
                            [Op.gt]: result.b_num,
                            [Op.lte]: b_num,
                        },
                        category: category,
                        b_depth: 0,
                        parent_id: null,
                    },
                    transaction,
                },
            );
        }

        await i_board.update(
            {
                b_num: b_num,
            },
            {
                where: {
                    idx: idx,
                    category: category,
                    b_depth: 0,
                    parent_id: null,
                },
                transaction,
            },
        );

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
