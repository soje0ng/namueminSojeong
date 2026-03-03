const { check, body, query, param, oneOf } = require('express-validator');
const { Op, Sequelize } = require('sequelize');
const { i_member } = require('../models');
const enumConfig = require('../middleware/enum');

const mailValidation = (fieldName, required = true) => {
    let validator = body(fieldName);

    if (required) {
        validator = validator.notEmpty().withMessage('이메일주소를 입력해 주세요.');
    } else {
        validator = validator.optional({ nullable: true, checkFalsy: true });
    }

    return [
        validator
            .isEmail()
            .withMessage('올바른 이메일 형식이 아닙니다.')
            .matches(/^[\x00-\x7F]+$/)
            .withMessage('이메일 주소에는 한글이나 특수 문자를 포함할 수 없습니다.')
            .normalizeEmail(),
    ];
};

const mailDupValidation = fieldName => [
    body(fieldName)
        .notEmpty()
        .isEmail()
        .withMessage('이메일주소를 입력해 주세요.')
        .matches(/^[\x00-\x7F]+$/)
        .withMessage('이메일 주소에는 한글이나 특수 문자를 포함할 수 없습니다.')
        .normalizeEmail()
        .custom((value, { req }) => {
            const where = { m_email: value };

            if (req.user && req.level === enumConfig.userLevel.USER_LV1) {
                where.m_email = { [Op.ne]: req.user };
            }

            return i_member
                .findOne({
                    where,
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('이미 등록된 E-mail 주소 입니다.');
                    }
                });
        }),
];

const mobileValidation = (fieldName, required = true) => {
    let validator = body(fieldName);

    if (required) {
        validator = validator.notEmpty().withMessage('연락처를 입력해주세요.');
    } else {
        validator = validator.optional({ nullable: true, checkFalsy: true });
    }

    return [
        validator
            .matches(/^(?:\d{2,4}-\d{3}-\d{4}|\d{2,4}-\d{4}-\d{4}|\d{3,4}-\d{4})$/)
            .withMessage('연락처는 올바른 형식이어야 합니다.')
            .isLength({ max: 13 })
            .withMessage('연락처는 최대 13자까지 입력 가능합니다.'),
    ];
};

const mobileDupValidation = fieldName => [
    body(fieldName)
        .notEmpty()
        .withMessage('연락처를 입력해주세요.')
        .matches(/^(?:\d{2,4}-\d{3}-\d{4}|\d{2,4}-\d{4}-\d{4}|\d{3,4}-\d{4})$/)
        .withMessage('연락처는 올바른 형식이어야 합니다.')
        .isLength({ max: 13 })
        .withMessage('연락처는 최대 13자까지 입력 가능합니다.')
        .custom((value, { req }) => {
            const where = { m_mobile: value };

            if (req.mobile && req.level === enumConfig.userLevel.USER_LV1) {
                where.m_mobile = { [Op.ne]: req.mobile };
            }

            return i_member
                .findOne({
                    where,
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('이미 등록된 연락처입니다.');
                    }
                });
        }),
];

const telNumberValidation = fieldName => [
    body(fieldName)
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^(?:\d{2,4}-\d{3}-\d{4}|\d{2,4}-\d{4}-\d{4}|\d{3,4}-\d{4})$/)
        .withMessage('사번은 올바른 형식이어야 합니다.')
        .isLength({ max: 13 })
        .withMessage('사번은 최대 13자까지 입력 가능합니다.'),
];

const notEmptyValidation = (fieldName, required = true) => {
    let validator = body(fieldName);

    if (required) {
        validator = validator.notEmpty().withMessage(`필수값을 입력해주세요.`);
    } else {
        validator = validator.optional({ nullable: true, checkFalsy: true });
    }

    return [validator];
};

const passwordValidation = (fieldName, required = true) => {
    let validator = body(fieldName);

    if (required) {
        validator = validator.notEmpty().withMessage('비밀번호를 입력해주세요.');
    } else {
        validator = validator.optional({ nullable: true, checkFalsy: true });
    }

    return [
        validator
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,12}$/)
            .withMessage('영문, 숫자, 특수문자를 모두 포함하여 8~12자의 비밀번호를 입력해주세요.'),
    ];
};

exports.mailValidator = [mailValidation('m_email', false)];
exports.mailValidatorRequired = [mailValidation('m_email', true)];

exports.mobileValidator = [mobileValidation('m_mobile', false)];
exports.mobileValidatorRequired = [mobileValidation('m_mobile', true)];

exports.passwordValidator = [passwordValidation('m_password', false)];
exports.passwordValidatorRequired = [passwordValidation('m_password', true)];
exports.newPasswordValidatorRequired = [passwordValidation('new_password', true)];

exports.mobileDupValidator = [mobileDupValidation('m_mobile')];

exports.mailDupValidator = [mailDupValidation('m_email')];

exports.singUpValidator = [
    ...exports.mailValidatorRequired,
    ...exports.mobileValidatorRequired,
    ...exports.passwordValidatorRequired,
];

exports.loginValidator = [...exports.mailValidatorRequired, ...exports.passwordValidatorRequired];
