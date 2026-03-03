const development = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    dialect: 'mariadb',
    logging: process.env.APP_ENV === 'development' ? console.log : false,
    port: process.env.DB_PORT,
    timezone: '+09:00',
};
const maintenance = {
    username: process.env.LW_USER,
    password: process.env.LW_PASS,
    host: process.env.LW_HOST,
    database: process.env.LW_NAME,
    dialect: 'mssql',
    port: process.env.LW_PORT,
    timezone: '+09:00',
    dialectOptions: {
        dateStrings: true, // 날짜 문자열 형식 허용
        typeCast: true, // 데이터 형식 자동 변환 허용
    },
};

const jwToken = {
    secretkey: process.env.SECRETKEY,
    refreshSecretkey: process.env.REFRESHSECRETKEY,
    option: {
        algorithm: process.env.ALG,
        expiresIn: process.env.EXP,
        refreshExpiresIn: process.env.REFRESHEXP,
        issuer: process.env.ISS,
    },
};

module.exports = { development, maintenance, jwToken };
