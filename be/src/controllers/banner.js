const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_banner } = require('../models');
const multerMiddleware = require('../middleware/multer');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');

// 배너 등록
// 2023.09.13 ash
exports.postBannerCreate = async (req, res, next) => {
    const {
        b_type,
        b_open,
        b_title,
        b_s_date,
        b_e_date,
        b_size,
        b_width_size,
        b_height_size,
        b_c_type,
        b_file,
        b_mov_url,
        b_url,
        b_url_target,
        b_mov_type,
        b_mov_play,
        b_mov_sound,
        b_content,
        b_lang = 'KR',
    } = req.body;
    let transaction;

    try {
        let formattedTargetStartDate = null;
        let formattedTargetEndDate = null;
        if (b_s_date) {
            formattedTargetStartDate = utilMiddleware.validateAndFormatDate(b_s_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'b_s_date',
                useDefault: false,
            });
        }
        if (b_e_date) {
            formattedTargetEndDate = utilMiddleware.validateAndFormatDate(b_e_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'b_e_date',
                useDefault: false,
            });
        }

        transaction = await db.mariaDBSequelize.transaction();

        const processedContents = await utilMiddleware.base64ToImagesPath(b_content);

        const categoryCount = await i_banner.max('b_moveNum', { transaction });

        const countWithIncrement = (categoryCount || 0) + 1;

        const bannerCreate = await i_banner.create(
            {
                b_type: b_type,
                b_open: b_open,
                b_title: b_title,
                b_s_date: formattedTargetStartDate,
                b_e_date: formattedTargetEndDate,
                b_size: b_size,
                b_width_size: b_width_size.replace(',', ''),
                b_height_size: b_height_size.replace(',', ''),
                b_c_type: b_c_type,
                b_file: req.file ? req.file.path : null,
                b_mov_url: b_mov_url,
                b_url: b_url,
                b_url_target: b_url_target,
                b_mov_type: b_mov_type,
                b_mov_play: b_mov_play,
                b_mov_sound: b_mov_sound,
                b_content: processedContents.temp_contents,
                b_moveNum: countWithIncrement,
                b_lang: b_lang,
            },
            { transaction },
        );

        if (!bannerCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
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

// 배너 리스트
// 2023.09.14 ash
exports.getBannerList = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const b_type = req.query.b_type || 'P';
    const b_lang = req.query.b_lang || 'KR';

    try {
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            b_type: b_type,
            b_lang: b_lang,
        };

        if (searchTxtQuery) {
            whereCondition.b_title = {
                [Op.like]: `%${searchTxtQuery}%`,
            };
        }

        const result = await i_banner.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: [['b_moveNum', 'ASC']],
            attributes: [
                'idx',
                'b_type',
                'b_file',
                'b_title',
                'b_s_date',
                'b_e_date',
                'b_size',
                'b_width_size',
                'b_height_size',
                'b_mov_url',
                'b_mov_type',
                'b_mov_play',
                'b_content',
                'b_open',
                'b_c_type',
                'b_moveNum',
                'b_lang',
            ],
        });

        const formattedResult = result.rows.map(list => ({
            idx: list.idx,
            b_type:
                list.b_type === enumConfig.bannerType.PC[0]
                    ? enumConfig.bannerType.PC
                    : list.b_type === enumConfig.bannerType.MOBILE[0]
                    ? enumConfig.bannerType.MOBILE
                    : null,
            b_file: list.b_file,
            b_title: list.b_title,
            b_s_date: list.b_s_date,
            b_e_date: list.b_e_date,
            b_size:
                list.b_size === enumConfig.bannerSizeType.COVER[0]
                    ? enumConfig.bannerSizeType.COVER
                    : list.b_size === enumConfig.bannerSizeType.ORIGINAL[0]
                    ? enumConfig.bannerSizeType.ORIGINAL
                    : null,
            b_width_size: list.b_width_size,
            b_height_size: list.b_height_size,
            b_mov_url: list.b_mov_url,
            b_mov_type:
                list.b_mov_type === enumConfig.bannerMovType.DIRECT[0]
                    ? enumConfig.bannerMovType.DIRECT
                    : list.b_mov_type === enumConfig.bannerMovType.URL[0]
                    ? enumConfig.bannerMovType.URL
                    : null,
            b_mov_play: list.b_mov_play,
            b_content: list.b_content,
            b_open:
                list.b_open === enumConfig.bannerOpenType.Y[0]
                    ? enumConfig.bannerOpenType.Y
                    : list.b_open === enumConfig.bannerOpenType.N[0]
                    ? enumConfig.bannerOpenType.N
                    : null,
            b_c_type: list.b_c_type,
            b_moveNum: list.b_moveNum,
            b_lang: list.b_lang,
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

// 배너 내용 보기
// 2023.09.14 ash
exports.getBannerView = async (req, res, next) => {
    const { idx } = req.params;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_banner.findOne({
            where: {
                idx: idx,
            },
            attributes: [
                'b_type',
                'b_open',
                'b_title',
                'b_s_date',
                'b_e_date',
                'b_size',
                'b_width_size',
                'b_height_size',
                'b_c_type',
                'b_file',
                'b_mov_url',
                'b_url',
                'b_url_target',
                'b_mov_type',
                'b_mov_play',
                'b_mov_sound',
                'b_content',
                'b_lang',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = {
            b_type:
                result.b_type === enumConfig.bannerType.PC[0]
                    ? enumConfig.bannerType.PC
                    : result.b_type === enumConfig.bannerType.MOBILE[0]
                    ? enumConfig.bannerType.MOBILE
                    : null,
            b_open:
                result.b_open === enumConfig.bannerOpenType.Y[0]
                    ? enumConfig.bannerOpenType.Y
                    : result.b_open === enumConfig.bannerOpenType.N[0]
                    ? enumConfig.bannerOpenType.N
                    : null,
            b_title: result.b_title,
            b_s_date: result.b_s_date,
            b_e_date: result.b_e_date,
            b_size:
                result.b_size === enumConfig.bannerSizeType.COVER[0]
                    ? enumConfig.bannerSizeType.COVER
                    : result.b_size === enumConfig.bannerSizeType.ORIGINAL[0]
                    ? enumConfig.bannerSizeType.ORIGINAL
                    : null,
            b_width_size: result.b_width_size,
            b_height_size: result.b_height_size,
            b_c_type:
                result.b_c_type === enumConfig.bannerCategoryType.IMG[0]
                    ? enumConfig.bannerCategoryType.IMG
                    : result.b_c_type === enumConfig.bannerCategoryType.MOV[0]
                    ? enumConfig.bannerCategoryType.MOV
                    : result.b_c_type === enumConfig.bannerCategoryType.HTML[0]
                    ? enumConfig.bannerCategoryType.HTML
                    : null,
            b_file: result.b_file,
            b_mov_url: result.b_mov_url,
            b_url: result.b_url,
            b_url_target:
                result.b_url_target === enumConfig.bannerLinkType.PARENT[0]
                    ? enumConfig.bannerLinkType.PARENT
                    : result.b_url_target === enumConfig.bannerLinkType.BLANK[0]
                    ? enumConfig.bannerLinkType.BLANK
                    : null,
            b_mov_type:
                result.b_mov_type === enumConfig.bannerMovType.DIRECT[0]
                    ? enumConfig.bannerMovType.DIRECT
                    : result.b_mov_type === enumConfig.bannerMovType.URL[0]
                    ? enumConfig.bannerMovType.URL
                    : null,
            b_mov_play: result.b_mov_play,
            b_mov_sound: result.b_mov_sound,
            b_content: result.b_content,
            b_lang: result.b_lang,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 배너 수정
// 2023.09.14 ash
exports.postBannerUpdate = async (req, res, next) => {
    const {
        idx,
        b_type,
        b_open,
        b_title,
        b_s_date,
        b_e_date,
        b_size,
        b_width_size,
        b_height_size,
        b_c_type,
        b_file,
        b_mov_url,
        b_url,
        b_url_target,
        b_mov_type,
        b_mov_play,
        b_mov_sound,
        b_content,
        b_lang,
    } = req.body;

    let file_name;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        let formattedTargetStartDate = null;
        let formattedTargetEndDate = null;
        if (b_s_date) {
            formattedTargetStartDate = utilMiddleware.validateAndFormatDate(b_s_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'b_s_date',
                useDefault: false,
            });
        }
        if (b_e_date) {
            formattedTargetEndDate = utilMiddleware.validateAndFormatDate(b_e_date, {
                format: 'YYYY.MM.DD',
                fieldName: 'b_e_date',
                useDefault: false,
            });
        }

        const result = await i_banner.findOne({
            where: {
                idx: idx,
            },
            attributes: ['idx', 'b_file'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        if (b_c_type === enumConfig.bannerCategoryType.HTML[0]) {
            if (result.b_file) {
                await multerMiddleware.clearFile(result.b_file);
            }
            file_name = null;
        } else {
            if (req.file) {
                if (result.b_file !== null && result.b_file !== req.file.path) {
                    await multerMiddleware.clearFile(result.b_file);
                }
            }

            if (req.file) {
                file_name = req.file.path;
            } else if (result) {
                file_name = result.b_file;
            } else {
                file_name = null;
            }
        }

        const processedContents = await utilMiddleware.base64ToImagesPath(b_content);

        const bannerUpdate = await i_banner.update(
            {
                b_type: b_type,
                b_open: b_open,
                b_title: b_title,
                b_s_date: formattedTargetStartDate,
                b_e_date: formattedTargetEndDate,
                b_size: b_size,
                b_width_size: b_width_size.replace(',', ''),
                b_height_size: b_height_size.replace(',', ''),
                b_c_type: b_c_type,
                b_file: file_name,
                b_mov_url: b_mov_url,
                b_url: b_url,
                b_url_target: b_url_target,
                b_mov_type: b_mov_type,
                b_mov_play: b_mov_play,
                b_mov_sound: b_mov_sound,
                b_content: processedContents.temp_contents,
                b_lang: b_lang,
            },
            {
                where: {
                    idx: idx,
                },
            },
        );

        if (!bannerUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// 배너 삭제
// 2023.09.14 ash
exports.deleteBannerDestroy = async (req, res, next) => {
    const { idx } = req.body;
    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_banner.findAll({
            where: whereCondition,
            attributes: ['idx', 'b_file'],
            transaction,
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No boards found');
        }

        for (const bannerView of result) {
            if (bannerView.b_file) {
                await multerMiddleware.clearFile(bannerView.b_file);
            }
        }

        const bannerDelete = await i_banner.destroy({
            where: whereCondition,
            transaction,
        });

        if (!bannerDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제 할 게시물이 없습니다.');
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

// 배너 노출, 중단
// 2023.09.14 ash
exports.postBannerOpen = async (req, res, next) => {
    const { idx, b_open } = req.body;
    let transaction;

    try {
        transaction = await db.mariaDBSequelize.transaction();

        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_banner.findAll({
            where: whereCondition,
            attributes: ['idx'],
            transaction,
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'No boards found');
        }

        const bannerOpen = await i_banner.update(
            {
                b_open: b_open,
            },
            {
                where: whereCondition,
                transaction,
            },
        );

        if (!bannerOpen) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '게시물이 없습니다.');
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

// 배너 이동
// 2024.01.12 ash
exports.putBannerMove = async (req, res, next) => {
    const { idx, moveNum } = req.body;
    let transaction;

    try {
        utilMiddleware.validateIdx(idx, 'idx');
        utilMiddleware.validateIdx(moveNum, 'moveNum');

        transaction = await db.mariaDBSequelize.transaction();

        const result = await i_banner.findByPk(idx, { transaction });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '배너가 없습니다.');
        }

        let moveDirection;
        if (moveNum < result.b_moveNum) {
            moveDirection = 'UP';
        }

        if (moveNum > result.b_moveNum) {
            moveDirection = 'DOWN';
        }

        if (moveDirection === 'UP') {
            await i_banner.update(
                {
                    b_moveNum: Sequelize.literal('b_moveNum + 1'),
                },
                {
                    where: {
                        b_moveNum: { [Op.gte]: moveNum, [Op.lt]: result.b_moveNum },
                    },
                    transaction,
                },
            );
        }

        if (moveDirection === 'DOWN') {
            await i_banner.update(
                {
                    b_moveNum: Sequelize.literal('b_moveNum - 1'),
                },
                {
                    where: {
                        b_moveNum: { [Op.gt]: result.b_moveNum, [Op.lte]: moveNum },
                    },
                    transaction,
                },
            );
        }

        const bannerMoves = await i_banner.update(
            {
                b_moveNum: moveNum,
            },
            {
                where: { idx: idx },
                transaction,
            },
        );

        if (!bannerMoves) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '이동 할 게시물이 없습니다.');
        }

        await transaction.commit();

        return errorHandler.successThrow(res, '', bannerMoves);
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
