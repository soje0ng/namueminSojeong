module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'cdnImage',
        {
            idx: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            path: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            regDate: {
                type: DataTypes.DATE,
            },
            fileKind: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'cdnImage',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'idx' }],
                },
            ],
        },
    );
};
