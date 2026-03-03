const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const {
    i_member,
    i_member_level,
    i_board,
    i_board_comment,
    i_member_login,
    i_member_sec,
    i_sms_txt,
} = require('../models');
const bcrypt = require('bcryptjs');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');

// 회원 리스트
// 2023.09.11 ash
exports.getMemberList = async (req, res, next) => {
    const m_level = req.query.m_level;
    const page = parseInt(req.query.page) || 1;

    const m_mail_yn = req.query.m_mail_yn;
    const m_sms_yn = req.query.m_sms_yn;

    //const currentDate = new Date();
    //const lastMonth = new Date(currentDate);

    const startDate = req.query.sdate;
    //parseInt(req.query.sdate) ||
    //moment
    //   (lastMonth.setMonth(currentDate.getMonth() - 1))
    //   .format('YYYY.MM.DD');
    const endDate = req.query.edate;
    //parseInt(req.query.edate) || moment(currentDate).format('YYYY.MM.DD');

    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const orderBy = req.query.orderBy;

    try {
        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            idx: {
                [Op.not]: null,
            },
        };

        if (m_level) {
            if (parseInt(m_level) === enumConfig.userLevel.USER_LV9) {
                whereCondition.m_level = {
                    [Op.eq]: enumConfig.userLevel.USER_LV9,
                };
            } else {
                whereCondition.m_level = {
                    [Op.ne]: enumConfig.userLevel.USER_LV9,
                };
            }
        }

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'email') {
                whereCondition.m_email = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'name') {
                whereCondition.m_name = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'phone') {
                whereCondition.m_mobile = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }
        }

        if (m_mail_yn) {
            whereCondition.m_mail_yn = {
                [Op.eq]: enumConfig.receiptType.Y,
            };
        }

        if (m_sms_yn) {
            whereCondition.m_sms_yn = {
                [Op.eq]: enumConfig.receiptType.Y,
            };
        }

        if (startDate && endDate) {
            whereCondition.reg_date = {
                [Op.between]: [startDate, endDate],
            };
        }

        let orderField;
        if (orderBy === 'email') {
            orderField = [['m_email', 'ASC']];
        } else if (orderBy === 'name') {
            orderField = [['m_name', 'ASC']];
        } else {
            orderField = [['reg_date', 'DESC']];
        }

        const subQuery1 = `(SELECT COUNT(*) FROM i_member_login WHERE i_member_login.m_email = i_member.m_email)`;
        const subQuery2 = `(SELECT COUNT(*) FROM i_board WHERE i_board.m_email = i_member.m_email)`;
        const subQuery3 = `(SELECT COUNT(*) FROM i_board_comment WHERE i_board_comment.m_email = i_member.m_email)`;

        const result = await i_member.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: [
                'idx',
                'm_email',
                'm_name',
                'm_level',
                'reg_date',
                'm_mobile',
                [Sequelize.literal(subQuery1), 'log_cnt'],
                [Sequelize.literal(subQuery2), 'board_cnt'],
                [Sequelize.literal(subQuery3), 'comment_cnt'],
            ],
        });

        const formattedResult = result.rows.map(list => ({
            idx: list.idx,
            m_email: list.m_email,
            m_name: list.m_name,
            m_level: list.m_level,
            reg_date: moment(list.reg_date).format('YYYY.MM.DD HH:mm'),
            m_mobile: list.m_mobile,
            log_cnt: list.getDataValue('log_cnt'),
            board_cnt: list.getDataValue('board_cnt'),
            comment_cnt: list.getDataValue('comment_cnt'),
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

//회원 레벨 불러오기
// 2023.09.11 ash
exports.getMemberLevel = async (req, res, next) => {
    try {
        const result = await i_member_level.findAll({
            attributes: ['l_level', 'l_name', 'signup_lv'],
            order: [['l_level', 'ASC']],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = result.map(list => ({
            l_level: list.l_level,
            l_name: list.l_name,
            signup_lv: list.signup_lv,
        }));

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//회원 내용 보기
// 2023.09.11 ash
exports.getMemberView = async (req, res, next) => {
    const idx = req.params.idx;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const subQuery1 = `(SELECT COUNT(*) FROM i_member_login WHERE i_member_login.m_email = i_member.m_email)`;
        const subQuery2 = `(SELECT COUNT(*) FROM i_board WHERE i_board.m_email = i_member.m_email)`;
        const subQuery3 = `(SELECT COUNT(*) FROM i_board_comment WHERE i_board_comment.m_email = i_member.m_email)`;

        const result = await i_member.findOne({
            where: {
                idx,
            },
            attributes: [
                'idx',
                'm_email',
                'm_name',
                'm_level',
                'm_mobile',
                'm_sms_yn',
                'm_mail_yn',
                'm_menu_auth',
                'm_memo',
                'reg_date',
                [Sequelize.literal(subQuery1), 'log_cnt'],
                [Sequelize.literal(subQuery2), 'board_cnt'],
                [Sequelize.literal(subQuery3), 'comment_cnt'],
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = {
            idx: result.idx,
            m_email: result.m_email,
            m_name: result.m_name,
            m_level: result.m_level,
            m_mobile: result.m_mobile,
            m_sms_yn:
                result.m_sms_yn === enumConfig.receiptType.Y[0]
                    ? enumConfig.receiptType.Y
                    : result.m_sms_yn === enumConfig.receiptType.N[0]
                    ? enumConfig.receiptType.N
                    : null,
            m_mail_yn:
                result.m_mail_yn === enumConfig.receiptType.Y[0]
                    ? enumConfig.receiptType.Y
                    : result.m_mail_yn === enumConfig.receiptType.N[0]
                    ? enumConfig.receiptType.N
                    : null,
            m_menu_auth:
                result.m_level === enumConfig.userLevel.USER_LV9 && result.m_menu_auth
                    ? result.m_menu_auth.split(',').map(key => enumConfig.adminMenu[`M${key}`])
                    : null,
            m_memo: result.m_memo,
            reg_date: moment(result.reg_date).format('YYYY.MM.DD HH:mm'),
            log_cnt: result.getDataValue('log_cnt'),
            board_cnt: result.getDataValue('board_cnt'),
            comment_cnt: result.getDataValue('comment_cnt'),
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//회원 수정
// 2023.09.11 ash
exports.putMemberUpdate = async (req, res, next) => {
    const { m_email, m_name, m_mobile, m_level, m_menu_auth, m_memo, m_sms_yn, m_mail_yn, m_password } = req.body;

    try {
        const result = await i_member.findOne({
            where: { m_email: m_email },
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        // 업데이트 데이터 생성
        const updateData = {
            m_name,
            m_mobile,
            m_level,
            m_menu_auth,
            m_memo,
            m_sms_yn,
            m_mail_yn,
        };

        // ✅ 비밀번호 값이 있으면 추가
        if (m_password && m_password.trim() !== '') {
            const hashedPw = await bcrypt.hash(m_password, 12);
            updateData.m_password = hashedPw;
        }

        const memberUpdate = await i_member.update(updateData, {
            where: {
                m_email: m_email,
            },
        });

        if (!memberUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

//회원 탈퇴
// 2023.09.11 ash
exports.deleteMemberDestroy = async (req, res, next) => {
    const { idx } = req.body;
    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };
        const result = await i_member.findAll({
            where: whereCondition,
            attributes: ['m_email'],
            transaction,
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No member found');
        }

        for (const member of result) {
            const secCreate = await i_member_sec.create(
                {
                    m_email: member.m_email,
                    memo: '관리자 탈퇴',
                },
                { transaction },
            );

            if (!secCreate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제로그 등록 실패.');
            }
        }

        const memberDelete = await i_member.destroy({
            where: whereCondition,
            transaction,
        });

        if (!memberDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제 할 회원이 없습니다.');
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

//회원 등급 변경
exports.putMemberLvUpdate = async (req, res, next) => {
    const { idx, m_level } = req.body;

    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };
        const result = await i_member.findAll({
            where: whereCondition,
            attributes: ['m_email'],
            transaction,
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No member found');
        }

        const memberUpdate = await i_member.update(
            {
                m_level: m_level,
            },
            {
                where: whereCondition,
                transaction,
            },
        );

        if (!memberUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        await transaction.commit();

        return errorHandler.successThrow(res, '', memberUpdate);
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

// SMS 전송 리스트
exports.getSmsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const orderBy = req.query.orderBy;

    try {
        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {};

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'email') {
                whereCondition.m_email = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'name') {
                whereCondition.m_name = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'phone') {
                whereCondition.m_mobile = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }
        }

        let orderField;
        if (orderBy === 'email') {
            orderField = [['m_email', 'ASC']];
        } else if (orderBy === 'name') {
            orderField = [['m_name', 'ASC']];
        } else {
            orderField = [['reg_date', 'DESC']];
        }

        const result = await i_member.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: ['idx', 'm_email', 'm_name', 'm_level', 'reg_date', 'm_mobile'],
        });

        const formattedResult = result.rows.map(list => ({
            idx: list.idx,
            m_email: list.m_email,
            m_name: list.m_name,
            m_level: list.m_level,
            reg_date: moment(list.reg_date).format('YYYY.MM.DD HH:mm'),
            m_mobile: list.m_mobile,
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

// sms 문구
exports.getSmsTextList = async (req, res, next) => {
    try {
        const result = await i_sms_txt.findAll({
            order: [['idx', 'ASC']],
            attributes: ['idx', 'send_txt'],
        });

        return errorHandler.successThrow(res, '', result);
    } catch (err) {
        next(err);
    }
};

// sms 문구 수정
exports.putSmsTextUpdate = async (req, res, next) => {
    const { idx, send_txt } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const smsUpdate = await i_sms_txt.update(
            {
                send_txt: send_txt,
            },
            {
                where: {
                    idx: idx,
                },
            },
        );

        if (!smsUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', smsUpdate);
    } catch (err) {
        next(err);
    }
};

// 탈퇴회원 리스트
// 2023.09.12 ash
exports.getSecessionList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {};

        if (searchTxtQuery) {
            whereCondition.m_email = {
                [Op.like]: `%${searchTxtQuery}%`,
            };
        }

        let orderField;
        orderField = [['sec_date', 'DESC']];

        const result = await i_member_sec.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: orderField,
            attributes: ['id', 'm_email', 'sec_date'],
        });

        const formattedResult = result.rows.map(list => ({
            id: list.id,
            m_email: list.m_email,
            sec_date: moment(list.sec_date).format('YYYY.MM.DD HH:mm'),
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

//회원 탈퇴 정보 영구 삭제
// 2023.09.12 ash
exports.postSecessionDestroy = async (req, res, next) => {
    const { id } = req.body;
    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            id: Array.isArray(id) ? { [Op.in]: id } : id,
        };
        const result = await i_member_sec.findAll({
            where: whereCondition,
            attributes: ['id', 'm_email', 'sec_date'],
            transaction,
        });
        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No member found');
        }

        for (const member of result) {
            const secessionDelete = await i_member_sec.destroy({
                where: {
                    id: member.id,
                },
                transaction,
            });

            if (!secessionDelete) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '탈퇴 로그 삭제 실패.');
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
