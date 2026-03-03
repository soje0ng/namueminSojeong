const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const {
    i_member,
    i_member_level,
    i_member_login,
    i_member_sec,
    i_category,
    i_board,
    i_board_comment,
    i_pw_token,
    i_popup,
} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('../middleware/jwt');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');
const utilMiddleware = require('../middleware/util');
const { validationResult } = require('express-validator');

/*
// Name         : postSignup
// writer        : chy
// Discription  : 회원가입
*/
exports.postSignup = async (req, res, next) => {
    const { m_email, m_password, m_name, m_mobile, m_sms_yn, m_mail_yn } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }

        const hashedPw = await bcrypt.hash(m_password, 12);
        if (!hashedPw) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Password Hashed Error');
        }

        await db.mariaDBSequelize.transaction(async transaction => {
            const existingUser = await i_member.findOne({
                where: {
                    m_email,
                },
                transaction,
            });

            if (existingUser) {
                if (existingUser.m_email === m_email) {
                    return errorHandler.errorThrow(
                        enumConfig.statusErrorCode._422_ERROR[0],
                        '이미 등록된 E-mail 주소 입니다.',
                    );
                } else {
                    return errorHandler.errorThrow(
                        enumConfig.statusErrorCode._422_ERROR[0],
                        '이미 등록된 연락처입니다.',
                    );
                }
            }

            const signupLv = await i_member_level.findOne({
                where: { signup_lv: 'Y' },
                attributes: ['l_level', 'signup_lv'],
                raw: true,
                transaction,
            });

            if (!signupLv) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Non Signup Lv');
            }

            const [user, created] = await i_member.findOrCreate({
                where: {
                    m_email,
                },
                defaults: {
                    m_email,
                    m_password: hashedPw,
                    m_name,
                    m_mobile,
                    m_sms_yn,
                    m_mail_yn,
                    m_level: signupLv.l_level,
                },
                transaction,
                raw: true,
            });

            if (!created) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._409_ERROR[0], '회원정보가 존재합니다.');
            }

            const resultObj = {
                m_email,
                m_name,
                m_mobile,
            };
        });

        return errorHandler.successThrow(res, '회원가입이 완료되었습니다.', resultObj);
    } catch (err) {
        next(err);
    }
};

/*
// Name         : commonLoginProcess
// writer        : chy
// Discription  : 공통 로그인 처리 함수
*/
const commonLoginProcess = async (req, res, next, isAdminLogin = false) => {
    const { m_email, m_password } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }

        let result;
        let accessToken;
        let refreshToken;

        await db.mariaDBSequelize.transaction(async transaction => {
            // 사용자 또는 관리자 조회
            result = await i_member.findOne({
                where: {
                    m_email,
                    m_level: {
                        [Op.in]: isAdminLogin ? enumConfig.levelType.ADMIN : enumConfig.levelType.USER,
                    },
                },
                attributes: ['idx', 'm_email', 'm_level', 'm_name', 'm_mobile', 'm_password', 'm_menu_auth'],
                transaction,
            });

            if (!result) {
                errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '사용자 정보를 찾을 수 없습니다.');
            }

            if (result.m_level === enumConfig.userLevel.USER_LV0) {
                errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '계정 정지 상태입니다.');
            }

            const isEqual = await bcrypt.compare(m_password, result.m_password);

            if (!isEqual) {
                errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '계정 정보가 일치하지 않습니다');
            }

            accessToken = jwt.access(
                // isAdminLogin ? result.m_id : result.m_mobile,
                result.m_email,
                result.m_mobile,
                result.m_level,
                result.m_name,
            );

            refreshToken = jwt.refresh(
                // isAdminLogin ? result.m_id : result.m_mobile,
                result.m_email,
                result.m_mobile,
                result.m_level,
                result.m_name,
            );

            if (!accessToken) {
                errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'accessToken Error');
            }

            if (!refreshToken) {
                errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'refreshToken Error');
            }

            const clientIp = req.clientIp;
            const normalizedClientIp = clientIp.includes(':') ? clientIp.split(':').pop() : clientIp;

            await i_member_login.create(
                {
                    m_email: result.m_email,
                    m_mobile: result.m_mobile,
                    clientIp: normalizedClientIp,
                    log_date: moment(),
                },
                { transaction },
            );
        });

        errorHandler.successThrow(res, '', {
            accessToken: accessToken,
            refreshToken: refreshToken,
            m_email: result.m_email,
            m_mobile: result.m_mobile,
            m_level: result.m_level,
            m_name: result.m_name,
            m_menu_auth: result.m_menu_auth,
        });
    } catch (err) {
        next(err);
    }
};

/*
// Name         : postLogin
// writer        : chy
// Discription  : 로그인 jwt발행
*/
exports.postLogin = async (req, res, next) => {
    const admin = false;
    await commonLoginProcess(req, res, next, admin);
};

/*
// Name         : adminPostLogin
// writer        : chy
// Discription  : 관리자 로그인 jwt발행
*/
exports.adminPostLogin = async (req, res, next) => {
    const admin = true;
    await commonLoginProcess(req, res, next, admin);
};

// 이메일 중복 확인
exports.postEmailDoubleCheck = async (req, res, next) => {
    const { m_email, m_level = 1 } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }

        const result = await i_member.findOne({
            where: {
                m_email: m_email,
                m_level: m_level,
            },
            attributes: ['m_email'],
        });

        if (result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._409_ERROR[0], '이미 등록된 이메일 주소 입니다.');
        }

        return errorHandler.successThrow(res, '등록 가능한 이메일 주소 입니다', '');
    } catch (err) {
        next(err);
    }
};

//비밀번호 재설정 이메일 전송
exports.postPasswordResetEmailSend = async (req, res, next) => {
    const { m_email } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }

        await db.mariaDBSequelize.transaction(async transaction => {
            const result = await i_member.findOne({
                where: {
                    m_email: m_email,
                    m_level: {
                        [Op.in]: enumConfig.levelType.USER,
                    },
                },
                transaction,
            });

            if (!result) {
                return errorHandler.errorThrow(
                    enumConfig.statusErrorCode._404_ERROR[0],
                    '등록된 이메일 주소가 없습니다.',
                );
            }

            if (result.m_level === enumConfig.userLevel.USER_LV0) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '계정 정지 상태입니다.');
            }

            const uuid = uuidv4();

            await i_pw_token.create(
                {
                    member_idx: result.idx,
                    token: uuid,
                },
                { transaction },
            );

            const link = `${process.env.BASE_URL}/reset-password/${result.idx}/${uuid}`;

            const data = {
                from: process.env.FROMMAIL,
                to: m_email,
                subject: '비밀번호 재설정 링크',
                html: `비밀번호 재설정 링크입니다. <br><br>재설정 링크는 다음과 같습니다: <br><a href="${link}" target="_blank">${link}</a>`,
            };

            const sendResult = await utilMiddleware.sendMail(data.from, data.to, data.subject, data.html);
        });

        return errorHandler.successThrow(res, '', '비밀번호 재설정 링크가 메일로 전송되었습니다.');
    } catch (err) {
        next(err);
    }
};

/*
// Name         : postTokenRefresh
// writer        : chy
// Discription  : 토큰 리프레시
*/
exports.postTokenRefresh = async (req, res, next) => {
    const { refresh_token } = req.body;
    try {
        if (!refresh_token) {
            errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '리프레시 토큰이 없습니다.');
        }

        const token = refresh_token;
        let decodedToken = null;

        decodedToken = jwt.refreshVerify(token);

        if (!decodedToken.decoded) {
            if (decodedToken.err.name === 'TokenExpiredError') {
                errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], '리프레시 토큰 인증 만료');
            }
            errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], '리프레시 토큰 인증 실패');
        }

        const result = await i_member.findOne({
            where: {
                m_email: decodedToken.decoded.user,
            },
        });

        if (!result) {
            errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '사용자 정보를 찾을 수 없습니다.');
        }

        // const adminLevels = Object.values(enumConfig.userLevel).filter(level =>
        //     enumConfig.levelType.ADMIN.includes(level),
        // );

        const accessToken = jwt.access(
            // adminLevels.includes(result.m_level) ? result.m_id : result.m_mobile,
            result.m_email,
            result.m_mobile,
            result.m_level,
            result.m_name,
        );

        errorHandler.successThrow(res, '액세스 토큰 재발급', {
            accessToken: accessToken,
            refreshToken: token,
            m_email: result.m_email,
            m_mobile: result.m_mobile,
            m_level: result.m_level,
            m_name: result.m_name,
        });
    } catch (err) {
        next(err);
    }
};

/*
// Name         : putPasswordResetEmail
// writer       : chy
// Discription  : 이메일 비밀번호 재설정
*/
exports.putPasswordResetEmail = async (req, res, next) => {
    const { member_idx, token, new_password } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }

        utilMiddleware.validateIdx(member_idx, 'member_idx');

        await db.mariaDBSequelize.transaction(async transaction => {
            const result = await i_pw_token.findOne({
                where: {
                    member_idx,
                },
                order: [['reg_date', 'DESC']],
                transaction,
            });

            if (!result) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '유효하지 않은 링크입니다.');
            }

            if (token !== result.token) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], ' 유효하지 않은 링크입니다.');
            }

            const now = moment();
            const codeDate = moment(result.reg_date);
            const minutesDifference = now.diff(codeDate, 'minutes');
            if (minutesDifference > 5) {
                return errorHandler.errorThrow(
                    enumConfig.statusErrorCode._401_ERROR[0],
                    ' 링크 유효기간이 초과했습니다.',
                );
            }

            const hashedPw = await bcrypt.hash(new_password, 12);
            if (!hashedPw) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Password Hashed Error');
            }

            await i_member.update({ m_password: hashedPw }, { where: { idx: member_idx }, transaction });

            await i_pw_token.destroy({
                where: { member_idx, token },
                transaction,
            });
        });

        errorHandler.successThrow(res, '비밀번호 재설정이 완료되었습니다.', '');
    } catch (err) {
        next(err);
    }
};

// 비밀번호 재설정
exports.postResetPassword = async (req, res, next) => {
    const { old_password, new_password } = req.body;

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }
        const result = await i_member.findOne({
            where: {
                m_email: req.user,
            },
            attributes: ['m_password'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        if (old_password) {
            const isEqual = await bcrypt.compare(old_password, result.m_password);

            if (!isEqual) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '기존 비빌번호가 다릅니다.');
            }
        }

        const hashedPw = await bcrypt.hash(new_password, 12);

        const pwdUpdate = await i_member.update(
            {
                m_password: hashedPw,
            },
            {
                where: {
                    m_email: req.user,
                },
            },
        );

        if (!pwdUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '비밀번호 변경 되었습니다.', pwdUpdate);
    } catch (err) {
        next(err);
    }
};

// 회원 정보 조회
exports.getUserView = async (req, res, next) => {
    try {
        const result = await i_member.findOne({
            where: { m_email: req.user },
            attributes: ['idx', 'm_email', 'm_name', 'm_mobile', 'm_sms_yn', 'm_mail_yn', 'm_level', 'm_menu_auth'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        // qna 게시판 id
        const qnaBoardIds = (
            await i_category.findAll({
                attributes: ['id'],
                where: {
                    c_content_type: enumConfig.contentType.QNA[0],
                    c_use_yn: enumConfig.useType.Y[0],
                },
            })
        ).map(result => result.id);

        const BoardIds = (
            await i_category.findAll({
                attributes: ['id'],
                where: {
                    c_content_type: {
                        [Op.in]: [
                            enumConfig.contentType.BOARD[0],
                            enumConfig.contentType.GALLERY[0],
                            enumConfig.contentType.FAQ[0],
                        ],
                    },
                    c_use_yn: enumConfig.useType.Y[0],
                },
            })
        ).map(result => result.id);

        const [boardCnt, commentCnt, qnaCnt] = await Promise.all([
            i_board.count({
                where: {
                    m_email: req.user,
                    category: { [Op.in]: BoardIds }, // QNA 카테고리를 제외한 게시글 수
                },
            }),
            i_board_comment.count({
                where: { m_email: req.user }, // 댓글 수
            }),
            i_board.count({
                where: {
                    m_email: req.user,
                    category: { [Op.in]: qnaBoardIds }, // QNA 카테고리에 해당하는 게시글 수
                },
            }),
        ]);

        const resultObj = {
            boardCnt: boardCnt,
            commentCnt: commentCnt,
            qnaCnt: qnaCnt,
            member: result,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 회원 정보 수정
exports.putUserUpdate = async (req, res, next) => {
    const { m_mobile, m_sms_yn, m_mail_yn } = req.body;
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._422_ERROR[0], error.errors[0].msg);
        }
        const result = await i_member.findOne({
            where: { m_email: req.user },
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const memberUpdate = await i_member.update(
            {
                m_mobile: m_mobile,
                m_sms_yn: m_sms_yn,
                m_mail_yn: m_mail_yn,
            },
            {
                where: {
                    m_email: req.user,
                },
            },
        );

        if (!memberUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', memberUpdate);
    } catch (err) {
        next(err);
    }
};

// 회원 탈퇴
exports.deleteUserDestroy = async (req, res, next) => {
    try {
        await db.mariaDBSequelize.transaction(async transaction => {
            const secCreate = await i_member_sec.create(
                {
                    m_email: req.user,
                    memo: '사용자 탈퇴',
                },
                { transaction },
            );

            if (!secCreate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제로그 등록 실패.');
            }

            const memberDelete = await i_member.destroy({
                where: {
                    m_email: req.user,
                },
                transaction,
            });

            if (!memberDelete) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제 할 회원이 없습니다.');
            }
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

//사용자 페이지 팝업 리스트
exports.getPopupList = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const p_type = req.query.p_type || 'P';
    const p_lang = req.query.p_lang || 'KR';

    try {
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            p_type: p_type,
            p_open: enumConfig.bannerOpenType.Y[0],
            p_lang: p_lang,
        };

        if (searchTxtQuery) {
            whereCondition.p_title = {
                [Op.like]: `%${searchTxtQuery}%`,
            };
        }

        const result = await i_popup.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: [['idx', 'DESC']],
            attributes: [
                'idx',
                'p_type',
                'p_title',
                'p_s_date',
                'p_e_date',
                'p_width_size',
                'p_height_size',
                'p_one_day',
                'p_left_point',
                'p_top_point',
                'p_open',
                'p_layer_pop',
                'p_scroll',
                'p_link_target',
                'p_link_url',
                'p_content',
                'p_content_type',
            ],
        });

        const formattedResult = result.rows.map(list => ({
            idx: list.idx,
            p_type:
                list.p_type === enumConfig.bannerType.PC[0]
                    ? enumConfig.bannerType.PC
                    : list.p_type === enumConfig.bannerType.MOBILE[0]
                    ? enumConfig.bannerType.MOBILE
                    : null,
            p_title: list.p_title,
            p_s_date: list.p_s_date,
            p_e_date: list.p_e_date,
            p_width_size: list.p_width_size,
            p_height_size: list.p_height_size,
            p_one_day:
                list.p_one_day === enumConfig.useType.Y[0]
                    ? enumConfig.useType.Y
                    : list.p_one_day === enumConfig.useType.N[0]
                    ? enumConfig.useType.N
                    : null,
            p_left_point: list.p_left_point,
            p_top_point: list.p_top_point,
            p_open:
                list.p_open === enumConfig.bannerOpenType.Y[0]
                    ? enumConfig.bannerOpenType.Y
                    : list.p_open === enumConfig.bannerOpenType.N[0]
                    ? enumConfig.bannerOpenType.N
                    : null,
            p_layer_pop:
                list.p_layer_pop === enumConfig.popupType.LAYER[0]
                    ? enumConfig.popupType.LAYER
                    : list.p_layer_pop === enumConfig.popupType.POPUP[0]
                    ? enumConfig.popupType.POPUP
                    : null,
            p_scroll: list.p_scroll,
            p_link_target: list.p_link_target,
            p_link_url: list.p_link_url,
            p_content: list.p_content,
            p_content_type: list.p_content_type,
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

exports.getPopupDetail = async (req, res, next) => {
    const { idx } = req.params;

    try {
        if (!idx) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._400_ERROR[0], 'idx 값이 없습니다.');
        }

        const result = await i_popup.findOne({
            where: { idx: idx },
            attributes: [
                'idx',
                'p_type',
                'p_title',
                'p_s_date',
                'p_e_date',
                'p_width_size',
                'p_height_size',
                'p_one_day',
                'p_left_point',
                'p_top_point',
                'p_open',
                'p_layer_pop',
                'p_scroll',
                'p_link_target',
                'p_link_url',
                'p_content',
                'p_content_type',
            ],
            raw: true,
        });

        const formattedResult = {
            idx: result.idx,
            p_type:
                result.p_type === enumConfig.bannerType.PC[0]
                    ? enumConfig.bannerType.PC
                    : result.p_type === enumConfig.bannerType.MOBILE[0]
                    ? enumConfig.bannerType.MOBILE
                    : null,
            p_title: result.p_title,
            p_s_date: result.p_s_date,
            p_e_date: result.p_e_date,
            p_width_size: result.p_width_size,
            p_height_size: result.p_height_size,
            p_one_day:
                result.p_one_day === enumConfig.useType.Y[0]
                    ? enumConfig.useType.Y
                    : result.p_one_day === enumConfig.useType.N[0]
                    ? enumConfig.useType.N
                    : null,
            p_left_point: result.p_left_point,
            p_top_point: result.p_top_point,
            p_open:
                result.p_open === enumConfig.bannerOpenType.Y[0]
                    ? enumConfig.bannerOpenType.Y
                    : result.p_open === enumConfig.bannerOpenType.N[0]
                    ? enumConfig.bannerOpenType.N
                    : null,
            p_layer_pop:
                result.p_layer_pop === enumConfig.popupType.LAYER[0]
                    ? enumConfig.popupType.LAYER
                    : result.p_layer_pop === enumConfig.popupType.POPUP[0]
                    ? enumConfig.popupType.POPUP
                    : null,
            p_scroll: result.p_scroll,
            p_link_target:
                result.p_link_target === enumConfig.bannerLinkType.PARENT[0]
                    ? enumConfig.bannerLinkType.PARENT
                    : result.p_link_target === enumConfig.bannerLinkType.BLANK[0]
                    ? enumConfig.bannerLinkType.BLANK
                    : null,
            p_link_url: result.p_link_url,
            p_content: result.p_content,
            p_content_type: result.p_content_type,
        };

        return errorHandler.successThrow(res, '', formattedResult);
    } catch (err) {
        next(err);
    }
};
