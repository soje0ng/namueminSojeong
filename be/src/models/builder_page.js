module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'i_builder_page',
        {
            idx: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            page_slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            page_title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            page_lang: {
                type: DataTypes.STRING(10),
                allowNull: false,
                defaultValue: 'ko',
            },
            page_status: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: 'D', // D=Draft, P=Published
            },
            page_data: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
            },
            meta_title: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            meta_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            og_image: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
            },
            published_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ['page_slug', 'page_lang'],
                    name: 'idx_slug_lang',
                },
            ],
        },
    );
};
