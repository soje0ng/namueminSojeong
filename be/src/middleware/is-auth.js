const { accessVerify } = require('../middleware/jwt');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const boardAuth = require('../middleware/boardAuth');

// 회원 인증 함수 (allowGuest: 비회원 허용)
const authenticate = (req, allowGuest = false, allowedLevels = null) => {
    const authHeader = req.get('Authorization');
    console.log(`authHeader : ${authHeader}`);
    if (!authHeader) {
        if (allowGuest) {
            req.user = '';
            req.mobile = '';
            req.level = 0;
            req.name = '';
            return;
        }
        return errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], 'No token in header.');
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = null;

    decodedToken = accessVerify(token);
    if (decodedToken.decoded !== null) {
        req.user = decodedToken.decoded.user;
        req.mobile = decodedToken.decoded.mobile;
        req.level = decodedToken.decoded.level;
        req.name = decodedToken.decoded.name;
    }

    if (!decodedToken.decoded) {
        if (decodedToken.err.name === 'TokenExpiredError') {
            return errorHandler.errorThrow(
                enumConfig.statusErrorCode._401_ERROR[0],
                'Access token authentication expiration.',
            );
        }

        return errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], 'Access token authentication failed.');
    }

    if (allowedLevels && allowedLevels.length > 0) {
        if (!allowedLevels.includes(parseInt(req.level))) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._401_ERROR[0], '접근 권한이 없습니다.');
        }
    }
};

const authMiddleware =
    (allowGuest, allowedLevels = []) =>
    async (req, res, next) => {
        try {
            authenticate(req, allowGuest, allowedLevels);
            next();
        } catch (err) {
            next(err);
        }
    };

module.exports = {
    isAuth: authMiddleware(false, []), // 모든 회원
    isAuthWithGuest: authMiddleware(true, []), // 회원 + 비회원
    isAuthAdmin: authMiddleware(false, [enumConfig.userLevel.USER_LV9]), // 관리자 // 입력 조회 삭제
    isAuthBoard: async (req, res, next) => {
        let category = req.body.category || req.params.category;
        let boardAuthType = req.body.boardAuthType;
        let idx = req.query.idx;
        try {
            // 조회일 경우
            if (!idx && boardAuthType === undefined) {
                boardAuthType = enumConfig.boardAuthType.READ;
            }

            if (boardAuthType === undefined) {
                return errorHandler.errorThrow(
                    enumConfig.statusErrorCode._404_ERROR[0],
                    '게시판 인증 정보가 없습니다.',
                );
            }

            // 회원인증
            authenticate(req, true);

            const authorizationResult = await boardAuth.authorizeUser(category, boardAuthType, req.level);

            if (authorizationResult) {
                return errorHandler.errorThrow(authorizationResult.statusCode, authorizationResult.message);
            }

            next();
        } catch (err) {
            next(err);
        }
    },
};
