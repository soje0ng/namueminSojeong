const applyXssHook = require('../middleware/xssHook'); // 경로 확인 후 사용

module.exports = (sequelize, DataTypes) => {
    const i_config = sequelize.define(
        'i_config',
        {
            site_id: {
                type: DataTypes.STRING(50),
                allowNull: true,
                primaryKey: true,
            },
            c_site_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_web_title: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_ceo: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_tel: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_num: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_num2: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_email: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_address: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_fax: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_manager: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_b_title: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_meta: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_meta_tag: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            c_lang: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        },
    );

    // ✅ XSS Hook 적용
    applyXssHook(i_config);

    return i_config;
};
