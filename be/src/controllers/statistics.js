const moment = require('moment');
const { Op, Sequelize, QueryTypes } = require('sequelize');
const { i_logs, sequelize, i_board, i_board_comment, i_member, mariaDBSequelize } = require('../models');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const utilMiddleware = require('../middleware/util');

// 전체통계
// 2023.09.12 ash
exports.getStatCnt = async (req, res, next) => {
    try {
        const excludeKeywords = ['admin', 'mailGun', 'test'];
        const notLikeCondition = buildNotLikeCondition(excludeKeywords, 'previousUrl');

        const logsTopUrl = await i_logs.findOne({
            attributes: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('id')), 'CNT'], 'previousUrl'],
            where: notLikeCondition,
            group: ['previousUrl'],
            order: [[mariaDBSequelize.literal('CNT'), 'DESC']],
            limit: 1,
        });

        const logsTopAgent = await i_logs.findOne({
            attributes: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('id')), 'CNT'], 'userAgent'],
            where: notLikeCondition,
            group: ['userAgent'],
            order: [[mariaDBSequelize.literal('CNT'), 'DESC']],
            limit: 1,
        });

        const logsTopAgentBrowserVer = {
            CNT: logsTopAgent.CNT,
            userAgent: utilMiddleware.extractBrowserVersion(logsTopAgent.userAgent),
        };

        const logsTotalCnt = await i_logs.count({ where: notLikeCondition });

        const userTotalCnt = await i_member.count();

        const boardTotalCnt = await i_board.count();

        const commentTotalCnt = await i_board_comment.count();

        const resultObj = {
            logsTopUrl: logsTopUrl,
            logsTopAgent: logsTopAgentBrowserVer,
            logsTotalCnt: logsTotalCnt || 0,
            userTotalCnt: userTotalCnt || 0,
            boardTotalCnt: boardTotalCnt || 0,
            commentTotalCnt: commentTotalCnt || 0,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// 기간별 현황 통계
// 2023.09.13 ash
exports.getPeriodStatCnt = async (req, res, next) => {
    const { start, end } = req.query;

    const currentDate = new Date();

    const startDate =
        moment(start).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).add(-7, 'day').format('YYYY-MM-DD');
    const endDate = moment(end).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).format('YYYY-MM-DD');

    // const startDate = start
    //     ? moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    //     : moment(currentDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');

    // const endDate = end
    //     ? moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    //     : moment(currentDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const replacements = {
        startDate: startDate,
        endDate: endDate,
    };

    try {
        const query1 = `
            SELECT DATE_FORMAT(DateRange.date, '%Y.%m.%d') as date , IFNULL(logsCount, 0) AS logsCnt, IFNULL(userCount, 0) AS userCnt,
            IFNULL(boardCount, 0) AS boardCnt, IFNULL(commentCount, 0) AS commentCnt
            FROM (
                SELECT :startDate AS date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 DAY)
                FROM (
                    SELECT :startDate AS date`;

        let query2 = '';
        for (let date = moment(startDate); date.isBefore(endDate); date.add(1, 'day')) {
            query2 += ` UNION ALL
               SELECT DATE_ADD('${date.format('YYYY.MM.DD')}', INTERVAL 1 DAY) `;
        }

        const query3 = `  ) AS DateRange
            WHERE date < :endDate
            ) AS DateRange
            LEFT JOIN (
            SELECT DATE(reg_date) AS date, COUNT(*) AS logsCount
            FROM i_logs
            WHERE LEFT(previousUrl,3) <> '/v1' AND DATE(reg_date) BETWEEN :startDate AND :endDate
            GROUP BY date
            ) AS LogCounts ON DateRange.date = LogCounts.date
            LEFT JOIN (
                SELECT DATE(reg_date) AS date, COUNT(*) AS userCount
            FROM i_member
            WHERE DATE(reg_date) BETWEEN :startDate AND :endDate
            GROUP BY date
            ) AS userCnt On DateRange.date = userCnt.date
            LEFT JOIN (
                SELECT DATE(b_reg_date) AS date, COUNT(*) AS boardCount
            FROM i_board
            WHERE DATE(b_reg_date) BETWEEN :startDate AND :endDate
            GROUP BY date
            ) AS boardCnt On DateRange.date = boardCnt.date
            LEFT JOIN (
                SELECT DATE(c_reg_date) AS date, COUNT(*) AS commentCount
            FROM i_board_comment
            WHERE DATE(c_reg_date) BETWEEN :startDate AND :endDate
            GROUP BY date
            ) AS commentCnt On DateRange.date = commentCnt.date
            ORDER BY DateRange.date desc; `;

        const result = await mariaDBSequelize.query(query1 + query2 + query3, {
            replacements,
            type: QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        let totalLogCnt = 0;
        let totalUserCnt = 0;
        let totalBoardCnt = 0;
        let totalCommentCnt = 0;
        for (let i = 0; i < result.length; i++) {
            totalLogCnt += result[i].logsCnt;
            totalUserCnt += result[i].userCnt;
            totalBoardCnt += result[i].boardCnt;
            totalCommentCnt += result[i].commentCnt;
        }

        const resultObj = {
            totalLogCnt: totalLogCnt,
            totalUserCnt: totalUserCnt,
            totalBoardCnt: totalBoardCnt,
            totalCommentCnt: totalCommentCnt,
            list: result,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// chart 통계
exports.getPeriodStatChart = async (req, res, next) => {
    try {
        const { start, end, type } = req.query;
        const currentDate = new Date();
        let startDate;
        let endDate;

        if (type === 'daily') {
            startDate =
                moment(start).add(0, 'day').format('YYYY-MM-DD') ||
                moment(currentDate).add(-7, 'day').format('YYYY-MM-DD');
            endDate = moment(end).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).format('YYYY-MM-DD');
            // startDate =
            //     moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss') ||
            //     moment(currentDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
            // endDate =
            //     moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss') ||
            //     moment(currentDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else if (type === 'monthly') {
            startDate =
                moment(start).add(0, 'month').startOf('month').format('YYYY-MM') ||
                moment(currentDate).add(-1, 'month').startOf('month').format('YYYY-MM');
            endDate =
                moment(end).add(0, 'month').endOf('month').format('YYYY-MM') ||
                moment(currentDate).endOf('month').format('YYYY-MM');
        } else {
            // Handle unknown type or default to daily
            startDate =
                moment(start).add(0, 'day').format('YYYY-MM-DD') ||
                moment(currentDate).add(-7, 'day').format('YYYY-MM-DD');
            endDate = moment(end).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).format('YYYY-MM-DD');
            // startDate =
            //     moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss') ||
            //     moment(currentDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
            // endDate =
            //     moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss') ||
            //     moment(currentDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        const dateRange = generateDateRange(startDate, endDate, type);

        const logsCounts = await getCounts(i_logs, 'id', 'reg_date', dateRange);
        const memberCounts = await getCounts(i_member, 'idx', 'reg_date', dateRange);
        const boardCounts = await getCounts(i_board, 'idx', 'b_reg_date', dateRange);
        const commentCounts = await getCounts(i_board_comment, 'idx', 'c_reg_date', dateRange);

        const maxCount = Math.max(
            getMaxCount(logsCounts),
            getMaxCount(memberCounts),
            getMaxCount(boardCounts),
            getMaxCount(commentCounts),
        );

        const resultObj = {
            type: 'line',
            scales: `{y: {max: '${maxCount}'}}`,
            legendPosition: 'top',
            label: 'true',
            labels: dateRange,
            datasets: [
                {
                    label: '방문',
                    data: getChartData(dateRange, logsCounts),
                },
                {
                    label: '가입회원',
                    data: getChartData(dateRange, memberCounts),
                },
                {
                    label: '게시글',
                    data: getChartData(dateRange, boardCounts),
                },
                {
                    label: '댓글',
                    data: getChartData(dateRange, commentCounts),
                },
            ],
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

//chart 통계 날짜 배열
const generateDateRange = (startDate, endDate, type) => {
    const dateRange = [];
    let currentDate = moment(startDate);

    while (currentDate <= moment(endDate)) {
        dateRange.push(type === 'monthly' ? currentDate.format('YYYY-MM') : currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, type === 'monthly' ? 'month' : 'day');
    }

    return dateRange;
};

//chart 통계 갯수 불러오기
const getCounts = async (model, idColumn, dateColumn, dateRange) => {
    return await model.findAll({
        attributes: [
            [mariaDBSequelize.fn('DATE_FORMAT', mariaDBSequelize.col(dateColumn), '%Y-%m-%d'), 'date'],
            [mariaDBSequelize.fn('COUNT', mariaDBSequelize.col(idColumn)), 'count'],
        ],
        where: {
            [dateColumn]: {
                [Op.between]: [dateRange[0], dateRange[dateRange.length - 1]],
            },
        },
        group: [mariaDBSequelize.fn('DATE_FORMAT', mariaDBSequelize.col(dateColumn), '%Y-%m-%d')],
        raw: true,
    });
};

//chart 통계 Max 값
const getMaxCount = counts => {
    return Math.max(...counts.map(entry => entry.count));
};

//chart 통계 갯수 표기
const getChartData = (dateRange, counts) => {
    const countMap = new Map(counts.map(({ date, count }) => [date, count]));
    return dateRange.map(date => countMap.get(date) || 0);
};

exports.getStatHistory = async (req, res, next) => {
    const { start, end, getLimit = 10, getPage = 1 } = req.query;

    try {
        const currentDate = new Date();
        // const startDate =
        //     moment(start).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).add(-7, 'day').format('YYYY-MM-DD');
        // const endDate = moment(end).add(0, 'day').format('YYYY-MM-DD') || moment(currentDate).format('YYYY-MM-DD');

        const startDate = start
            ? moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss')
            : moment(currentDate).subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');

        const endDate = end
            ? moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            : moment(currentDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const page = parseInt(getPage);
        const limit = parseInt(getLimit);
        const offset = (page - 1) * limit;

        const excludeKeywords = ['admin', 'mailGun', 'test'];
        const notLikeCondition = buildNotLikeCondition(excludeKeywords, 'previousUrl');

        // Sequelize where 조건
        let whereCondition = {
            ...notLikeCondition, // 바로 병합
        };

        const searchTxtQuery = req.query.searchtxt ? req.query.searchtxt.trim() : '';
        if (searchTxtQuery) {
            whereCondition.user = {
                [Op.like]: `%${searchTxtQuery}%`,
            };
        }

        if (startDate && endDate) {
            whereCondition.reg_date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const result = await i_logs.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: limit,
            order: [['id', 'DESC']],
            attributes: ['id', 'user', 'clientIp', 'previousUrl', 'userAgent', 'reg_date'],
        });

        const formattedResult = result.rows.map(list => ({
            id: list.id,
            user: list.user,
            b_title: list.b_title,
            clientIp: list.clientIp,
            previousUrl: list.previousUrl,
            userAgent: utilMiddleware.extractBrowserVersion(list.userAgent),
            reg_date: moment(list.reg_date).format('YYYY.MM.DD HH:mm:ss'),
        }));
        console.log(formattedResult);
        const logsTopUrl = await i_logs.findOne({
            where: whereCondition,
            attributes: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('id')), 'CNT'], 'previousUrl'],
            group: ['previousUrl'],
            order: [[mariaDBSequelize.literal('CNT'), 'DESC']],
            limit: 1,
        });

        const logsTopAgent = await i_logs.findOne({
            where: whereCondition,
            attributes: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('id')), 'CNT'], 'userAgent'],
            group: ['userAgent'],
            order: [[mariaDBSequelize.literal('CNT'), 'DESC']],
            limit: 1,
        });

        const count = result.count;
        const pagination = utilMiddleware.paginationCalc(count, page, limit);

        const resultObj = {
            logsTopUrl: logsTopUrl,
            logsTopAgent: logsTopAgent,
            ...pagination,
            data_list: formattedResult,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

exports.getStatUrl = async (req, res, next) => {
    try {
        const result = await i_logs.findAll({
            attributes: [
                [mariaDBSequelize.literal('ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)'), 'row_number'],
                'previousUrl',
                [mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('*')), 'cnt'],
            ],
            group: ['previousUrl'],
            order: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('*')), 'DESC']],
            limit: 20,
        });
        return errorHandler.successThrow(res, '', result);
    } catch (err) {
        next(err);
    }
};

exports.getStatAgent = async (req, res, next) => {
    try {
        const result = await i_logs.findAll({
            attributes: [
                [mariaDBSequelize.literal('ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)'), 'row_number'],
                'userAgent',
                [mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('*')), 'cnt'],
            ],
            group: ['userAgent'],
            order: [[mariaDBSequelize.fn('COUNT', mariaDBSequelize.col('*')), 'DESC']],
            limit: 20,
        });

        return errorHandler.successThrow(res, '', result);
    } catch (err) {
        next(err);
    }
};

function buildNotLikeCondition(keywords = [], column = 'previousUrl') {
    if (!Array.isArray(keywords) || keywords.length === 0) return {};

    const conditions = keywords.map(keyword => ({
        [column]: { [Op.notLike]: `%/${keyword}%` },
    }));

    return { [Op.and]: conditions };
}
