module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'i_pw_token',
        {
            pw_token_idx: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                comment: '토큰 index',
            },
            member_idx: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '회원 index',
            },
            token: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: '접속 토큰',
            },
            reg_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: '등록일',
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        },
    );
};
