const enumConfig = require('./enum');
const multer = require('multer');

exports.statusCodeReturn = (err, req, res, next) => {
    console.error(err); // Log the error for debugging (you can customize this)

    const statusCode = err.statusCode || enumConfig.statusErrorCode._500_ERROR[0];
    const message = err.message || enumConfig.statusErrorCode._500_ERROR[1];
    const data = err.data;

    res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        data: data,
    });
};

exports.routesStatusCode = (req, res, next) => {
    const statusCode = enumConfig.statusErrorCode._404_ERROR[0];
    const message = enumConfig.statusErrorCode._404_ERROR[1];

    res.status(404).json({
        statusCode: statusCode,
        message: message,
    });
};

exports.successThrow = (res, msg, data) => {
    res.status(200).json({
        statusCode: enumConfig.statusErrorCode._200_STATUS[0],
        message: msg || enumConfig.statusErrorCode._200_STATUS[1],
        data: data || null,
    });
};

exports.errorThrow = (status, msg) => {
    const error = new Error();
    error.statusCode = enumConfig.statusErrorCode[`_${status}_ERROR`][0];
    error.message = msg || enumConfig.statusErrorCode[`_${status}_ERROR`][1];
    throw error;
};

exports.handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let statusCode;
        let message;

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                statusCode = enumConfig.statusErrorCode._413_ERROR[0];
                message = `파일 크기가 너무 큽니다. (최대 ${process.env.FILESIZE} MB)`;
                break;
            case 'LIMIT_FILE_COUNT':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '파일 개수가 초과되었습니다.';
                break;
            case 'LIMIT_FIELD_KEY':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '필드 이름이 너무 깁니다.';
                break;
            case 'LIMIT_FIELD_VALUE':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '필드 값이 너무 깁니다.';
                break;
            case 'LIMIT_FIELD_COUNT':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '필드 개수가 초과되었습니다.';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '예상치 못한 필드입니다.';
                break;
            case 'MISSING_FIELD_NAME':
                statusCode = enumConfig.statusErrorCode._422_ERROR[0];
                message = '필드 이름이 누락되었습니다.';
                break;
            default:
                statusCode = enumConfig.statusErrorCode._500_ERROR[0];
                message = `파일 업로드 에러: ${err.message}`;
                break;
        }

        try {
            exports.errorThrow(statusCode, message);
        } catch (error) {
            return next(error);
        }
    }

    try {
        exports.errorThrow(enumConfig.statusErrorCode._500_ERROR[0], err.message);
    } catch (error) {
        return next(error);
    }
};

exports.handleMulterUpload = uploadFunction => (req, res, next) => {
    uploadFunction(req, res, err => {
        if (err) {
            return exports.handleMulterError(err, req, res, next);
        }
        next();
    });
};
