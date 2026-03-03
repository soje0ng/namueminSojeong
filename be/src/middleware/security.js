const rateLimit = require('express-rate-limit');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');

// 허용 IP
const ipAllowed = process.env.ALLOWED_IP ? process.env.ALLOWED_IP.split(',').map(ip => ip.trim()) : [];
const whiteIPs = new Set(ipAllowed);

// 차단 IP
const ipDenied = process.env.DENIED_IP ? process.env.DENIED_IP.split(',').map(ip => ip.trim()) : [];
const suspiciousIPs = new Set(ipDenied);

// 차단 user agent
const blockedUserAgents = [
    /^$/, // 빈 User-Agent 추가
    /curl/i,
    /wget/i,
    /python-requests/i,
    /postman/i,
    /insomnia/i,
    /httpie/i,
    /go-http-client/i,
    /okhttp/i,
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /ruby/i,
    /node/i,
    /fetch/i,
    /java/i,
    /axios/i,
];

/*
// Name         : matchesAllowedIp
// writer        : chy
// Discription  : IP필터
*/
exports.matchesAllowedIp = (ip, allowedIps) => {
    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }
    for (const pattern of allowedIps) {
        if (pattern.endsWith('.*')) {
            const prefix = pattern.slice(0, -1);
            if (ip.startsWith(prefix)) return true;
        } else if (pattern === ip) {
            return true;
        }
    }
    return false;
};

/*
// Name         : requestLimiter
// writer        : chy
// Discription  : API 요청한도 제한
*/
exports.requestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5분
    max: 500,
    message: {
        statusCode: enumConfig.statusErrorCode._429_ERROR[0],
        message: '요청 한도를 초과했습니다.',
        data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => req.clientIp,
    skip: req => exports.matchesAllowedIp(req.clientIp, whiteIPs),
});

/*
// Name         : security
// writer        : chy
// Discription  : 보안 미들웨어
*/
exports.security = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const acceptHeader = req.get('Accept') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const clientIP = req.clientIp;
    // console.log({
    //     'Accept-Languag': acceptLanguage,
    //     'Accept-Encoding': acceptEncoding,
    //     clientIP: clientIP,
    // });

    if (exports.matchesAllowedIp(clientIP, whiteIPs)) {
        return next();
    }

    // 의심스러운 IP 차단
    if (suspiciousIPs.has(clientIP)) {
        console.log(`차단된 의심스러운 IP 접근: ${clientIP}`);
        return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
    }

    // User-Agent가 없거나 차단 목록에 있는 경우
    const isBlockedUserAgent = blockedUserAgents.some(pattern => pattern.test(userAgent));

    if (userAgent === '' || isBlockedUserAgent) {
        console.log(`차단된 User-Agent: ${userAgent} from IP: ${clientIP}`);
        // suspiciousIPs.add(clientIP);
        return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
    }

    // curl 특별 검사 강화
    if (userAgent.toLowerCase().includes('curl') || userAgent.toLowerCase().includes('libcurl')) {
        console.log(`curl/libcurl 감지: ${userAgent} from IP: ${clientIP}`);
        // suspiciousIPs.add(clientIP);
        return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
    }

    // 의심스러운 패턴 감지
    const trustedUserAgents = process.env.ALLOWEDUSERAGENT
        ? process.env.ALLOWEDUSERAGENT.split(',').map(ua => ua.trim())
        : [];
    const isTrustedUA = trustedUserAgents.includes(userAgent);
    const suspiciousPatterns = isTrustedUA
        ? []
        : [
            { name: 'User-Agent 너무 짧음', condition: userAgent.length < 5 },
            { name: 'Accept-Language 헤더 없음', condition: !acceptLanguage },
            { name: 'Accept-Encoding 헤더 없음', condition: !acceptEncoding },
            { name: 'User-Agent에 python/ruby 포함', condition: /python|ruby/.test(userAgent.toLowerCase()) },
        ];

    suspiciousPatterns.forEach(({ name, condition }) => {
        if (condition) {
            console.log(`의심 조건 발생: ${name}`, {
                userAgent,
                acceptHeader,
                acceptLanguage,
                acceptEncoding,
                clientIP,
            });
        }
    });

    const suspiciousCount = suspiciousPatterns.filter(({ condition }) => condition).length;

    if (suspiciousCount >= 3) {
        console.log(`의심스러운 요청 감지 (IP: ${clientIP}, User-Agent: ${userAgent})`);
        // suspiciousIPs.add(clientIP);
        return errorHandler.errorThrow(enumConfig.statusErrorCode._403_ERROR[0], '');
    }

    // 정상 요청 로깅
    // console.log(`정상 요청 허용됨 (IP: ${clientIP}, User-Agent: ${userAgent.substring(0, 50)})`);
    return next();
};
