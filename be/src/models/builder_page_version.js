module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'i_builder_page_version',
        {
            idx: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            page_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            version_num: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            page_data: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
            },
            created_by: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        },
    );
};
