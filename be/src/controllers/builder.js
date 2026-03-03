const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_builder_page, i_builder_page_version } = require('../models');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');

// 빌더 페이지 생성
exports.postBuilderPageCreate = async (req, res, next) => {
    const {
        page_slug,
        page_title,
        page_lang = 'ko',
        page_data,
        meta_title,
        meta_description,
        og_image,
    } = req.body;

    try {
        utilMiddleware.validateNotEmpty(page_slug, 'page_slug');
        utilMiddleware.validateNotEmpty(page_title, 'page_title');
        utilMiddleware.validateNotEmpty(page_data, 'page_data');

        // 슬러그 중복 체크 (같은 언어 내에서)
        const existingPage = await i_builder_page.findOne({
            where: {
                page_slug: page_slug,
                page_lang: page_lang,
            },
            attributes: ['idx'],
        });

        if (existingPage) {
            return errorHandler.errorThrow(
                enumConfig.statusErrorCode._409_ERROR[0],
                '이미 존재하는 슬러그입니다.',
            );
        }

        const pageCreate = await i_builder_page.create({
            page_slug: page_slug,
            page_title: page_title,
            page_lang: page_lang,
            page_status: 'D',
            page_data: typeof page_data === 'string' ? page_data : JSON.stringify(page_data),
            meta_title: meta_title || page_title,
            meta_description: meta_description,
            og_image: og_image,
            created_at: new Date(),
            updated_at: new Date(),
        });

        if (!pageCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', pageCreate);
    } catch (err) {
        next(err);
    }
};

// 빌더 페이지 리스트
exports.getBuilderPageList = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const page_lang = req.query.page_lang || 'ko';
    const page_status = req.query.page_status;

    try {
        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        const whereCondition = {
            page_lang: page_lang,
        };

        if (page_status) {
            whereCondition.page_status = page_status;
        }

        if (searchTxtQuery) {
            whereCondition[Op.or] = [
                { page_title: { [Op.like]: `%${searchTxtQuery}%` } },
                { page_slug: { [Op.like]: `%${searchTxtQuery}%` } },
            ];
        }

        const result = await i_builder_page.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereCondition,
            order: [['idx', 'DESC']],
            attributes: [
                'idx',
                'page_slug',
                'page_title',
                'page_lang',
                'page_status',
                'meta_title',
                'created_at',
                'updated_at',
                'published_at',
            ],
        });

        const formattedResult = result.rows.map(item => ({
            idx: item.idx,
            page_slug: item.page_slug,
            page_title: item.page_title,
            page_lang: item.page_lang,
            page_status: item.page_status === 'P' ? ['P', '발행'] : ['D', '임시저장'],
            meta_title: item.meta_title,
            created_at: item.created_at ? moment(item.created_at).format('YYYY.MM.DD HH:mm') : null,
            updated_at: item.updated_at ? moment(item.updated_at).format('YYYY.MM.DD HH:mm') : null,
            published_at: item.published_at ? moment(item.published_at).format('YYYY.MM.DD HH:mm') : null,
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

// 빌더 페이지 상세 조회
exports.getBuilderPageView = async (req, res, next) => {
    const { idx } = req.params;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_builder_page.findOne({
            where: { idx: idx },
            attributes: [
                'idx',
                'page_slug',
                'page_title',
                'page_lang',
                'page_status',
                'page_data',
                'meta_title',
                'meta_description',
                'og_image',
                'created_at',
                'updated_at',
                'published_at',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        let parsedPageData;
        try {
            parsedPageData = JSON.parse(result.page_data);
        } catch (e) {
            parsedPageData = result.page_data;
        }

        const resultObj = {
            idx: result.idx,
            page_slug: result.page_slug,
            page_title: result.page_title,
            page_lang: result.page_lang,
            page_status: result.page_status === 'P' ? ['P', '발행'] : ['D', '임시저장'],
            page_data: parsedPageData,
            meta_title: result.meta_title,
            meta_description: result.meta_description,
            og_image: result.og_image,
            created_at: result.created_at ? moment(result.created_at).format('YYYY.MM.DD HH:mm') : null,
            updated_at: result.updated_at ? moment(result.updated_at).format('YYYY.MM.DD HH:mm') : null,
            published_at: result.published_at ? moment(result.published_at).format('YYYY.MM.DD HH:mm') : null,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 빌더 페이지 수정
exports.putBuilderPageUpdate = async (req, res, next) => {
    const {
        idx,
        page_slug,
        page_title,
        page_lang,
        page_data,
        meta_title,
        meta_description,
        og_image,
        save_version = false,
    } = req.body;

    try {
        utilMiddleware.validateIdx(idx, 'idx');
        utilMiddleware.validateNotEmpty(page_slug, 'page_slug');
        utilMiddleware.validateNotEmpty(page_title, 'page_title');
        utilMiddleware.validateNotEmpty(page_data, 'page_data');

        // 현재 페이지 확인
        const existingPage = await i_builder_page.findOne({
            where: { idx: idx },
            attributes: ['idx', 'page_slug', 'page_lang', 'page_data'],
        });

        if (!existingPage) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        // 슬러그 중복 체크 (다른 페이지와 중복 확인)
        const duplicatePage = await i_builder_page.findOne({
            where: {
                page_slug: page_slug,
                page_lang: page_lang || existingPage.page_lang,
                idx: { [Op.ne]: idx },
            },
            attributes: ['idx'],
        });

        if (duplicatePage) {
            return errorHandler.errorThrow(
                enumConfig.statusErrorCode._409_ERROR[0],
                '이미 존재하는 슬러그입니다.',
            );
        }

        // 버전 히스토리 저장 (선택적)
        if (save_version) {
            const versionCount = await i_builder_page_version.count({
                where: { page_idx: idx },
            });

            await i_builder_page_version.create({
                page_idx: idx,
                version_num: versionCount + 1,
                page_data: existingPage.page_data,
                created_at: new Date(),
            });
        }

        const pageUpdate = await i_builder_page.update(
            {
                page_slug: page_slug,
                page_title: page_title,
                page_lang: page_lang,
                page_data: typeof page_data === 'string' ? page_data : JSON.stringify(page_data),
                meta_title: meta_title || page_title,
                meta_description: meta_description,
                og_image: og_image,
                updated_at: new Date(),
            },
            {
                where: { idx: idx },
            },
        );

        if (!pageUpdate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, 'Update Success', pageUpdate);
    } catch (err) {
        next(err);
    }
};

// 빌더 페이지 삭제
exports.deleteBuilderPageDestroy = async (req, res, next) => {
    const { idx } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_builder_page.findAll({
            where: whereCondition,
            attributes: ['idx'],
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제할 페이지가 없습니다.');
        }

        const pageDelete = await i_builder_page.destroy({
            where: whereCondition,
        });

        if (!pageDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '삭제할 페이지가 없습니다.');
        }

        return errorHandler.successThrow(res, '', pageDelete);
    } catch (err) {
        next(err);
    }
};

// 빌더 페이지 발행/발행취소
exports.postBuilderPagePublish = async (req, res, next) => {
    const { idx, page_status } = req.body;

    try {
        const whereCondition = {
            idx: Array.isArray(idx) ? { [Op.in]: idx } : idx,
        };

        const result = await i_builder_page.findAll({
            where: whereCondition,
            attributes: ['idx'],
        });

        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '페이지를 찾을 수 없습니다.');
        }

        const updateData = {
            page_status: page_status,
            updated_at: new Date(),
        };

        // 발행 시 발행일 설정
        if (page_status === 'P') {
            updateData.published_at = new Date();
        }

        const pagePublish = await i_builder_page.update(updateData, {
            where: whereCondition,
        });

        if (!pagePublish) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '페이지를 찾을 수 없습니다.');
        }

        return errorHandler.successThrow(res, '', pagePublish);
    } catch (err) {
        next(err);
    }
};

// 버전 히스토리 목록
exports.getBuilderPageVersionList = async (req, res, next) => {
    const { idx } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_builder_page_version.findAndCountAll({
            where: { page_idx: idx },
            offset: offset,
            limit: limit,
            order: [['version_num', 'DESC']],
            attributes: ['idx', 'page_idx', 'version_num', 'created_at', 'created_by'],
        });

        const formattedResult = result.rows.map(item => ({
            idx: item.idx,
            page_idx: item.page_idx,
            version_num: item.version_num,
            created_at: item.created_at ? moment(item.created_at).format('YYYY.MM.DD HH:mm') : null,
            created_by: item.created_by,
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

// 버전 히스토리 상세 조회
exports.getBuilderPageVersionView = async (req, res, next) => {
    const { idx } = req.params;

    try {
        utilMiddleware.validateIdx(idx, 'idx');

        const result = await i_builder_page_version.findOne({
            where: { idx: idx },
            attributes: ['idx', 'page_idx', 'version_num', 'page_data', 'created_at', 'created_by'],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        let parsedPageData;
        try {
            parsedPageData = JSON.parse(result.page_data);
        } catch (e) {
            parsedPageData = result.page_data;
        }

        const resultObj = {
            idx: result.idx,
            page_idx: result.page_idx,
            version_num: result.version_num,
            page_data: parsedPageData,
            created_at: result.created_at ? moment(result.created_at).format('YYYY.MM.DD HH:mm') : null,
            created_by: result.created_by,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 버전 복원
exports.postBuilderPageVersionRestore = async (req, res, next) => {
    const { page_idx, version_idx } = req.body;

    try {
        utilMiddleware.validateIdx(page_idx, 'page_idx');
        utilMiddleware.validateIdx(version_idx, 'version_idx');

        // 버전 데이터 조회
        const versionData = await i_builder_page_version.findOne({
            where: { idx: version_idx, page_idx: page_idx },
            attributes: ['page_data'],
        });

        if (!versionData) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '버전을 찾을 수 없습니다.');
        }

        // 현재 페이지 데이터를 버전으로 저장
        const currentPage = await i_builder_page.findOne({
            where: { idx: page_idx },
            attributes: ['page_data'],
        });

        if (currentPage) {
            const versionCount = await i_builder_page_version.count({
                where: { page_idx: page_idx },
            });

            await i_builder_page_version.create({
                page_idx: page_idx,
                version_num: versionCount + 1,
                page_data: currentPage.page_data,
                created_at: new Date(),
                created_by: 'restore_backup',
            });
        }

        // 페이지 데이터 복원
        await i_builder_page.update(
            {
                page_data: versionData.page_data,
                updated_at: new Date(),
            },
            {
                where: { idx: page_idx },
            },
        );

        return errorHandler.successThrow(res, '버전이 복원되었습니다.', null);
    } catch (err) {
        next(err);
    }
};

// AI 코드 생성 (Gemini API 프록시)
exports.postBuilderAiGenerate = async (req, res, next) => {
    const { prompt } = req.body;

    try {
        utilMiddleware.validateNotEmpty(prompt, 'prompt');

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return errorHandler.errorThrow(
                enumConfig.statusErrorCode._500_ERROR[0],
                'Gemini API 키가 설정되지 않았습니다.',
            );
        }

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `당신은 웹 페이지 빌더 코드 생성 어시스턴트입니다.
사용자 요청에 맞는 HTML과 Tailwind CSS 코드를 생성하세요.
반드시 \`\`\`html 코드블록 형태로 응답하세요.
Tailwind CSS 클래스만 사용하고, 인라인 스타일은 최소화하세요.
반응형 디자인을 고려하세요.`;

        const result = await model.generateContent(`${systemPrompt}\n\n사용자 요청: ${prompt}`);
        const response = await result.response;
        const content = response.text();

        return errorHandler.successThrow(res, '', { content });
    } catch (err) {
        console.error('AI Generation Error:', err);
        next(err);
    }
};

// 사용자용 발행된 페이지 조회 (Public)
exports.getPublicBuilderPage = async (req, res, next) => {
    const { slug, lang } = req.params;
    const pageLang = lang || 'ko';

    try {
        const result = await i_builder_page.findOne({
            where: {
                page_slug: slug,
                page_lang: pageLang,
                page_status: 'P',
            },
            attributes: [
                'idx',
                'page_slug',
                'page_title',
                'page_lang',
                'page_data',
                'meta_title',
                'meta_description',
                'og_image',
                'published_at',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '페이지를 찾을 수 없습니다.');
        }

        let parsedPageData;
        try {
            parsedPageData = JSON.parse(result.page_data);
        } catch (e) {
            parsedPageData = result.page_data;
        }

        const resultObj = {
            idx: result.idx,
            page_slug: result.page_slug,
            page_title: result.page_title,
            page_lang: result.page_lang,
            page_data: parsedPageData,
            meta_title: result.meta_title,
            meta_description: result.meta_description,
            og_image: result.og_image,
            published_at: result.published_at ? moment(result.published_at).format('YYYY.MM.DD HH:mm') : null,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};
