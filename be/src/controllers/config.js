const moment = require('moment');
const { Op } = require('sequelize');
const { i_config, i_member_level, i_policy, i_config_lang } = require('../models');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const utilMiddleware = require('../middleware/util');
const db = require('../models');
const xss = require('xss');

exports.getConfigSite = async (req, res, next) => {
    const site_id = req.params.site_id;
    const c_lang = req.params.c_lang;
    try {
        const result = await i_config.findOne({
            attributes: [
                'c_site_name',
                'c_web_title',
                'c_ceo',
                'c_tel',
                'c_num',
                'c_num2',
                'c_email',
                'c_address',
                'c_fax',
                'c_manager',
                'c_b_title',
                'c_meta',
                'c_meta_tag',
                'c_meta_type',
                'c_lang',
            ],
            where: {
                site_id: site_id,
                c_lang: c_lang,
            },
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const configLangView = await i_config_lang.findAll({
            where: {
                site_id: site_id,
                use_yn: enumConfig.useType.Y[0],
            },
            attributes: ['site_lang_hangul', 'site_lang'],
        });

        const resultObj = {
            c_site_name: result.c_site_name,
            c_site_lang: configLangView,
            c_web_title: result.c_web_title,
            c_ceo: result.c_ceo,
            c_tel: result.c_tel,
            c_num: result.c_num,
            c_num2: result.c_num2,
            c_email: result.c_email,
            c_address: result.c_address,
            c_fax: result.c_fax,
            c_manager: result.c_manager,
            c_b_title: result.c_b_title,
            c_meta: result.c_meta,
            c_meta_tag: result.c_meta_tag,
            c_meta_type: result.c_meta_type,
            c_lang: result.c_lang,
        };
        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

exports.putConfigSiteUpdate = async (req, res, next) => {
    const {
        site_id,
        site_lang,
        c_site_name,
        c_web_title,
        c_ceo,
        c_tel,
        c_num,
        c_num2,
        c_email,
        c_address,
        c_fax,
        c_manager,
        c_b_title,
        c_meta,
        c_meta_tag,
        c_meta_type,
        c_lang,
    } = req.body;

    try {
        await db.mariaDBSequelize.transaction(async transaction => {
            const configLangNUpdate = await i_config_lang.update(
                {
                    use_yn: enumConfig.useType.N[0],
                },
                {
                    where: {
                        site_id: site_id,
                        site_lang: Array.isArray(site_lang) ? { [Op.notIn]: site_lang } : { [Op.ne]: site_lang },
                    },
                    transaction,
                },
            );

            const configLangYUpdate = await i_config_lang.update(
                {
                    use_yn: enumConfig.useType.Y[0],
                },
                {
                    where: {
                        site_id: site_id,
                        site_lang: Array.isArray(site_lang) ? { [Op.in]: site_lang } : site_lang,
                    },
                    transaction,
                },
            );

            if (!configLangYUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            const configUpdate = await i_config.update(
                {
                    c_site_name: c_site_name,
                    c_web_title: c_web_title,
                    c_ceo: c_ceo,
                    c_tel: c_tel,
                    c_num: c_num,
                    c_num2: c_num2,
                    c_email: c_email,
                    c_address: c_address,
                    c_fax: c_fax,
                    c_manager: c_manager,
                    c_b_title: c_b_title,
                    c_meta: c_meta,
                    c_meta_tag: c_meta_tag,
                    c_meta_type: c_meta_type,
                    c_lang: c_lang,
                },
                {
                    where: {
                        site_id: site_id,
                        c_lang: c_lang,
                    },
                    transaction,
                    individualHooks: true,
                },
            );

            if (!configUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

exports.getConfigPolicy = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const p_lang = req.query.p_lang || 'KR';

    try {
        const searchQuery = req.query.search;
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            idx: { [Op.gt]: 0 },
            p_lang: p_lang,
        };

        if (searchQuery && searchTxtQuery) {
            if (searchQuery === 'title') {
                whereCondition.p_title = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }

            if (searchQuery === 'contents') {
                whereCondition.p_contents = {
                    [Op.like]: `%${searchTxtQuery}%`,
                };
            }
        }

        const result = await i_policy.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: [['idx', 'ASC']],
            attributes: [
                'idx',
                'p_title',
                'p_contents',
                'p_reg_date',
                'p_use_yn',
                'policy_type',
                'constraint_type',
                'p_lang',
            ],
        });

        const formattedResult = result.rows.map((list, index) => {
            const boardDate = moment(list.p_reg_date).format('YYYY.MM.DD');
            const listObj = {
                idx: list.idx,
                num: result.count - (offset + index),
                p_title: list.p_title,
                p_contents: list.p_contents,
                p_reg_date: boardDate,
                p_use_yn: list.p_use_yn,
                policy_type: list.policy_type,
                constraint_type: list.constraint_type,
                p_lang: list.p_lang,
            };
            return listObj;
        });

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

exports.postConfigPolicyCreate = async (req, res, next) => {
    const { p_title, p_contents, p_contents_type, p_use_yn, p_lang } = req.body;

    try {
        const processedContents = await utilMiddleware.base64ToImagesPath(p_contents);

        const policyCreate = await i_policy.create({
            p_title: p_title,
            p_contents: processedContents.temp_contents,
            p_contents_type: p_contents_type,
            p_use_yn: p_use_yn,
            p_lang: p_lang,
        });

        if (!policyCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

exports.getConfigPolicyView = async (req, res, next) => {
    const { idx } = req.params;
    const p_lang = req.query.p_lang || 'KR';

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_policy.findOne({
            where: {
                idx: idx,
                p_lang: p_lang,
            },
            attributes: [
                'idx',
                'p_title',
                'p_contents',
                'p_contents_type',
                'p_use_yn',
                'policy_type',
                'constraint_type',
                'p_lang',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = {
            idx: result.idx,
            p_title: result.p_title,
            p_contents: result.p_contents,
            p_contents_type: result.p_contents_type,
            p_use_yn: result.p_use_yn,
            policy_type: result.policy_type,
            constraint_type: result.constraint_type,
            p_lang: result.p_lang,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

exports.putConfigPolicyUpdate = async (req, res, next) => {
    const { idx, p_title, p_contents, p_contents_type, p_use_yn } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_policy.findOne({
            where: {
                idx: idx,
            },
            attributes: ['idx'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const processedContents = await utilMiddleware.base64ToImagesPath(p_contents);

        const policyUpdate = await i_policy.update(
            {
                p_title: p_title,
                p_contents: processedContents.temp_contents,
                p_contents_type: p_contents_type,
                p_use_yn: p_use_yn,
            },
            {
                where: {
                    idx: idx,
                },
            },
        );

        if (!policyUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

exports.deleteConfigPolicyDestroy = async (req, res, next) => {
    const { idx } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };
        const result = await i_policy.findOne({
            where: whereCondition,
            attributes: ['idx'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const policyDelete = await i_policy.destroy({
            where: {
                idx: { [Op.in]: idx },
            },
        });

        if (!policyDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', policyDelete);
    } catch (err) {
        next(err);
    }
};

exports.postConfigPolicyUseYn = async (req, res, next) => {
    const { idx, p_use_yn } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };
        const policyUpdate = await i_policy.update(
            {
                p_use_yn: p_use_yn,
            },
            {
                where: whereCondition,
            },
        );

        if (!policyUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

exports.getConfigLevel = async (req, res, next) => {
    try {
        const result = await i_member_level.findAll({
            attributes: ['l_level', 'signup_lv', 'l_name'],
            order: [['l_level', 'DESC']],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = result.map(list => {
            const listObj = {
                l_level: list.l_level,
                signup_lv: list.signup_lv,
                l_name: list.l_name,
            };
            return listObj;
        });

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

exports.putConfigLevelUpdate = async (req, res, next) => {
    const { l_name, l_level, signup_lv } = req.body;

    try {
        await db.mariaDBSequelize.transaction(async transaction => {
            if (signup_lv) {
                const signupLvUpdate = await i_member_level.update(
                    {
                        signup_lv: null,
                    },
                    {
                        where: {
                            signup_lv: signup_lv,
                        },
                        transaction,
                    },
                );

                if (!signupLvUpdate) {
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
                }
            }

            const configUpdate = await i_member_level.update(
                {
                    l_name: l_name,
                    signup_lv: signup_lv,
                },
                {
                    where: {
                        l_level: l_level,
                    },
                    transaction,
                },
            );

            if (!configUpdate) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};
