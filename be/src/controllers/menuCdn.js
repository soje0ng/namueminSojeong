const moment = require('moment');
require('moment/locale/ko'); // 한글 로케일 추가
moment.locale('ko');
const { Op, Sequelize } = require('sequelize');
const { cdnImage } = require('../models');
const utilMiddleware = require('../middleware/util');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const db = require('../models');
const fs = require('fs');
const path = require('path');

// 세미나 일일 이미지 리스트
exports.getCdnImageList = async (req, res, next) => {
    const { getLimit, getPage, getFileKind } = req.query;
    try {
        const limit = parseInt(getLimit) || 10;
        const page = parseInt(getPage) || 1;
        const offset = (page - 1) * limit;
        const fileKind = getFileKind || 'I';

        const searchTxtQuery = req.query.searchTxt ? req.query.searchTxt.trim() : '';
        const whereCondition = { fileKind };

        if (searchTxtQuery) {
            whereCondition.path = {
                [Op.like]: `%${searchTxtQuery}%`,
            };
        }

        const imageList = await cdnImage.findAndCountAll({
            offset: offset,
            limit: parseInt(limit),
            attributes: ['idx', 'path'],
            where: whereCondition,
            order: [['idx', 'desc']],
            raw: true,
        });

        const count = imageList.count;
        const pagination = utilMiddleware.paginationCalc(count, page, limit);

        const resultObj = {
            ...pagination,
            data_list: imageList,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 세미나 일일 이미지 업로드
exports.postCdnImage = async (req, res, next) => {
    let { fileKind } = req.body;
    const overwrite = req.query.overwrite;

    try {
        // 파일 유무 확인
        if ((!req.file && !req.files) || (!req.file && !req.files['sessions'])) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '이미지를 선택하세요.');
        }

        let uploadedFiles = [];
        if (req.file) {
            uploadedFiles = [req.file];
        } else if (req.files && req.files['sessions']) {
            uploadedFiles = req.files['sessions'];
        }

        // DB 저장할 데이터 준비
        const imagePaths = uploadedFiles.map(file => file.path);

        let savedUrls = [];

        if (!fileKind || fileKind.trim() === '') {
            fileKind = 'I';
        }

        for (const path of imagePaths) {
            // overwrite=Y면 기존 path가 있으면 삭제
            // if (overwrite === 'Y') {
            // 	await cdnImage.destroy({ where: { path } });
            // }
            // 중복 방지: 이미 존재하지 않을 때만 추가
            const [row, created] = await cdnImage.findOrCreate({
                where: { path, fileKind },
                defaults: { path, fileKind },
            });
            savedUrls.push(row.path);
        }

        return errorHandler.successThrow(res, '', { imageUrls: savedUrls });
    } catch (err) {
        next(err);
    }
};

// 세미나 일일 이미지 삭제
exports.deleteCdnImageDelete = async (req, res, next) => {
    const { idx } = req.body;

    try {
        if (!idx) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'idx 입력하세요.');
        }

        // DB에서 이미지 경로 조회
        const imageRow = await cdnImage.findOne({ where: { idx }, raw: true });
        if (!imageRow) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '이미지 정보가 없습니다.');
        }

        // DB에서 삭제
        const result = await cdnImage.destroy({ where: { idx } });

        // 실제 파일 삭제
        const filePath = path.join(__dirname, '../../', imageRow.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return errorHandler.successThrow(res, '', result);
    } catch (err) {
        next(err);
    }
};
