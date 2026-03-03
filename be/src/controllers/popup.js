const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_popup } = require('../models');
const multerMiddleware = require('../middleware/multer');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');

// 팝업 생성 ash
// 2023.09.15 rainy
exports.postPopupCreate = async (req, res, next) => {
    const {
        p_type,
        p_open,
        p_title,
        p_s_date,
        p_e_date,
        p_one_day,
        p_layer_pop,
        p_width_size = 0,
        p_height_size = 0,
        p_left_point = 0,
        p_top_point = 0,
        p_scroll,
        p_link_target,
        p_link_url,
        p_content,
        p_content_type,
        p_lang,
    } = req.body;

    try {
        let formattedTargetStartDate = null;
        let formattedTargetEndDate = null;
        if (p_s_date) {
            formattedTargetStartDate = utilMiddleware.validateAndFormatDate(p_s_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'p_s_date',
                useDefault: false,
            });
        }
        if (p_e_date) {
            formattedTargetEndDate = utilMiddleware.validateAndFormatDate(p_e_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'p_e_date',
                useDefault: false,
            });
        }
        const processedContents = await utilMiddleware.base64ToImagesPath(p_content);

        const popupCreate = await i_popup.create({
            p_type: p_type,
            p_open: p_open,
            p_title: p_title,
            p_s_date: formattedTargetStartDate,
            p_e_date: formattedTargetEndDate,
            p_one_day: p_one_day,
            p_layer_pop: p_layer_pop,
            p_width_size: p_width_size,
            p_height_size: p_height_size,
            p_left_point: p_left_point,
            p_top_point: p_top_point,
            p_scroll: p_scroll,
            p_link_target: p_link_target,
            p_link_url: p_link_url,
            p_content: processedContents.temp_contents,
            p_content_type: p_content_type,
            p_lang: p_lang,
        });

        if (!popupCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', popupCreate);
    } catch (err) {
        next(err);
    }
};

// 팝업 리스트 ash
// 2023.09.15 cold
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
                'p_link_url',
                'p_lang',
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
            p_link_url: list.p_link_url,
            p_lang: list.p_lang,
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

// 팝업 내용 보기 ash
// 2023.09.15 so so
exports.getPopupView = async (req, res, next) => {
    const { idx } = req.params;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_popup.findOne({
            where: {
                idx: idx,
            },
            attributes: [
                'idx',
                'p_type',
                'p_open',
                'p_title',
                'p_s_date',
                'p_e_date',
                'p_one_day',
                'p_layer_pop',
                'p_width_size',
                'p_height_size',
                'p_left_point',
                'p_top_point',
                'p_scroll',
                'p_link_target',
                'p_link_url',
                'p_content',
                'p_content_type',
                'p_lang',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }
        const resultObj = {
            idx: result.idx,
            p_type:
                result.p_type === enumConfig.bannerType.PC[0]
                    ? enumConfig.bannerType.PC
                    : result.p_type === enumConfig.bannerType.MOBILE[0]
                    ? enumConfig.bannerType.MOBILE
                    : null,
            p_open:
                result.p_open === enumConfig.bannerOpenType.Y[0]
                    ? enumConfig.bannerOpenType.Y
                    : result.p_open === enumConfig.bannerOpenType.N[0]
                    ? enumConfig.bannerOpenType.N
                    : null,
            p_title: result.p_title,
            p_s_date: result.p_s_date,
            p_e_date: result.p_e_date,
            p_one_day:
                result.p_one_day === enumConfig.useType.Y[0]
                    ? enumConfig.useType.Y
                    : result.p_one_day === enumConfig.useType.N[0]
                    ? enumConfig.useType.N
                    : null,
            p_layer_pop:
                result.p_layer_pop === enumConfig.popupType.LAYER[0]
                    ? enumConfig.popupType.LAYER
                    : result.p_layer_pop === enumConfig.popupType.POPUP[0]
                    ? enumConfig.popupType.POPUP
                    : null,
            p_width_size: result.p_width_size,
            p_height_size: result.p_height_size,
            p_left_point: result.p_left_point,
            p_top_point: result.p_top_point,
            p_scroll:
                result.p_scroll === enumConfig.useType.Y[0]
                    ? enumConfig.useType.Y
                    : result.p_scroll === enumConfig.useType.N[0]
                    ? enumConfig.useType.N
                    : null,
            p_link_target:
                result.p_link_target === enumConfig.bannerLinkType.PARENT[0]
                    ? enumConfig.bannerLinkType.PARENT
                    : result.p_link_target === enumConfig.bannerLinkType.BLANK[0]
                    ? enumConfig.bannerLinkType.BLANK
                    : null,
            p_link_url: result.p_link_url,
            p_content: result.p_content,
            p_content_type: result.p_content_type,
            p_lang: result.p_lang,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 팝업 수정 ash
// 2023.09.15 hurry
exports.putBannerUpdate = async (req, res, next) => {
    const {
        idx,
        p_type,
        p_open,
        p_title,
        p_s_date,
        p_e_date,
        p_one_day,
        p_layer_pop,
        p_width_size = 0,
        p_height_size = 0,
        p_left_point = 0,
        p_top_point = 0,
        p_scroll,
        p_link_target,
        p_link_url,
        p_content,
        p_content_type,
        p_lang,
    } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        let formattedTargetStartDate = null;
        let formattedTargetEndDate = null;
        if (p_s_date) {
            formattedTargetStartDate = utilMiddleware.validateAndFormatDate(p_s_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'p_s_date',
                useDefault: false,
            });
        }
        if (p_e_date) {
            formattedTargetEndDate = utilMiddleware.validateAndFormatDate(p_e_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'p_e_date',
                useDefault: false,
            });
        }

        const result = await i_popup.findOne({
            where: {
                idx: idx,
            },
            attributes: ['idx'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const processedContents = await utilMiddleware.base64ToImagesPath(p_content);

        const popupUpdate = await i_popup.update(
            {
                p_type: p_type,
                p_open: p_open,
                p_title: p_title,
                p_s_date: formattedTargetStartDate,
                p_e_date: formattedTargetEndDate,
                p_one_day: p_one_day,
                p_layer_pop: p_layer_pop,
                p_width_size: p_width_size,
                p_height_size: p_height_size,
                p_left_point: p_left_point,
                p_top_point: p_top_point,
                p_scroll: p_scroll,
                p_link_target: p_link_target,
                p_link_url: p_link_url,
                p_content: processedContents.temp_contents,
                p_content_type: p_content_type,
                p_lang: p_lang,
            },
            {
                where: {
                    idx: idx,
                },
            },
        );

        if (!popupUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, 'Update Success', popupUpdate);
    } catch (err) {
        next(err);
    }
};

// 팝업 삭제 ash
// 2023.09.15
exports.deletePopupDestroy = async (req, res, next) => {
    const { idx } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_popup.findAll({
            where: whereCondition,
            attributes: ['idx'],
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No popup found');
        }

        const popupDelete = await i_popup.destroy({
            where: whereCondition,
        });

        if (!popupDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제 할 게시물이 없습니다.');
        }

        return errorHandler.successThrow(res, '', popupDelete);
    } catch (err) {
        next(err);
    }
};

// 팝업 노출, 중단 ash
// 2023.09.15 dirty
exports.postPopupOpen = async (req, res, next) => {
    const { idx, p_open } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_popup.findAll({
            where: whereCondition,
            attributes: ['idx'],
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No boards found');
        }

        const popupOpen = await i_popup.update(
            {
                p_open: p_open,
            },
            {
                where: whereCondition,
            },
        );

        if (!popupOpen) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '게시물이 없습니다.');
        }

        return errorHandler.successThrow(res, '', popupOpen);
    } catch (err) {
        next(err);
    }
};
