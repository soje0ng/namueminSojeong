const parseurl = require('parseurl');
const { Op } = require('sequelize');
const { i_logs } = require('../models');
const { accessVerify } = require('../middleware/jwt');
const multer = require('multer');

exports.logs = async (req, res, next) => {
    const authHeader = req.get('Authorization') || ' ';

    let decodedTokenUser = null;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let decodedToken = null;
        decodedToken = accessVerify(token);
        if (decodedToken.decoded !== null) {
            decodedTokenUser = decodedToken.decoded.user;
        }
    }

    //const previousUrl = req.headers.referer;
    //const previousUrl = parseurl(req).path;
    const previousUrl = req.headers['x-react-route'];
    const clientIp = req.clientIp;
    const userAgent = req.get('user-agent');

    //const normalizedClientIp = clientIp.substring(clientIp.lastIndexOf(':') + 1);
    const normalizedClientIp = clientIp.includes(':') ? clientIp.split(':').pop() : clientIp;

    try {
        if (req.headers['x-react-route']) {
            // console.log('previousUrl:', previousUrl);
            // console.log('clientIp:', normalizedClientIp);
            //    console.log('userAgent:', userAgent);

            let bodyLog = null;
            const contentType = req.get('content-type') || '';

            if (contentType.includes('multipart/form-data')) {
                // 원본 req를 복사해서 multer 처리
                const tempReq = Object.create(req);
                const tempRes = Object.create(res);

                bodyLog = await new Promise(resolve => {
                    multer().any()(tempReq, tempRes, err => {
                        if (err) {
                            resolve(null);
                            return;
                        }

                        if (tempReq.body && Object.keys(tempReq.body).length > 0) {
                            resolve(JSON.stringify(tempReq.body));
                        } else {
                            resolve(null);
                        }
                    });
                });
            } else {
                bodyLog = req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : null; // body입력값 확인 추가
            }

            const log = await i_logs.create({
                user: decodedTokenUser,
                clientIp: normalizedClientIp,
                userAgent: userAgent,
                previousUrl: previousUrl,
                bodyLog: bodyLog,
            });
        }
    } catch (err) {
        next(err);
    }
};
