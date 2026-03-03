const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const { i_category, i_category_board_group, sequelize, i_category_board } = require('../models');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const multerMiddleware = require('../middleware/multer');
const utilMiddleware = require('../middleware/util');
const db = require('../models');

// Get Category Group List
// 2023.09.06 ash
exports.getBoardGroupList = async (req, res, next) => {
    const { parent_id } = req.params;
    try {
        utilMiddleware.validateIdx(parent_id, 'parent_id');

        let categoryUseYN = null;
        // `getBoardGroupList`에서 `전체` 항목 추가는 `/v1/main`에서 호출될 때만 수행합니다.
        // Express의 mount 경로는 `req.baseUrl`로 확인합니다.
        if (req && req.baseUrl === '/v1/main') {
            categoryUseYN = await i_category.findOne({
                attributes: ['c_kind_use'],
                where: { id: parent_id },
                raw: true,
            });
        }

        const categoryGroupList = await i_category_board_group.findAll({
            where: {
                parent_id: parent_id,
                use_yn: { [Op.in]: [enumConfig.useType.Y[0], enumConfig.useType.N[0]] },
            },
            attributes: [
                'id',
                'parent_id',
                'g_num',
                'all_board',
                'g_name',
                'g_menu_ui',
                'g_img_on',
                'g_img_off',
                'use_yn',
            ],
            order: [['g_num', 'ASC']],
        });

        if (!categoryGroupList) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const categoryGroupListResult = categoryGroupList.map(list => {
            const listObj = {
                id: list.id,
                parent_id: list.parent_id,
                g_num: list.g_num,
                all_board: list.all_board,
                g_name: list.g_name,
                g_menu_ui: list.g_menu_ui,
                g_img_on: list.g_img_on,
                g_img_off: list.g_img_off,
                use_yn: list.use_yn === enumConfig.useType.Y[0] ? enumConfig.useType.Y : enumConfig.useType.N,
            };
            return listObj;
        });

        if (req && req.baseUrl === '/v1/main') {
            if (categoryUseYN && categoryUseYN.c_kind_use === enumConfig.useType.Y[0]) {
                categoryGroupListResult.unshift({
                    id: null,
                    g_name: '전체',
                });
            }
        }

        return errorHandler.successThrow(res, '', categoryGroupListResult);

        // const categoryGroupListResult = categoryGroupList.map(list => {
        //     const listObj = {
        //         id: list.id,
        //         parent_id: list.parent_id,
        //         g_num: list.g_num,
        //         all_board: list.all_board,
        //         g_name: list.g_name,
        //         g_menu_ui: list.g_menu_ui,
        //         g_img_on: list.g_img_on,
        //         g_img_off: list.g_img_off,
        //         use_yn: list.use_yn === enumConfig.useType.Y[0] ? enumConfig.useType.Y : enumConfig.useType.N,
        //     };
        //     return listObj;
        // });

        // const categorGroupListN = await i_category_board_group.findAll({
        //     where: {
        //         parent_id: parent_id,
        //         use_yn: enumConfig.useType.N[0],
        //     },
        //     attributes: [
        //         'id',
        //         'parent_id',
        //         'g_num',
        //         'g_name',
        //         'all_board',
        //         'g_menu_ui',
        //         'g_img_on',
        //         'g_img_off',
        //         'use_yn',
        //     ],
        //     order: [['g_num', 'ASC']],
        // });

        // const categoryGroupListNResult = categorGroupListN.map(list => {
        //     const listObj = {
        //         id: list.id,
        //         parent_id: list.parent_id,
        //         g_num: list.g_num,
        //         all_board: list.all_board,
        //         g_name: list.g_name,
        //         g_menu_ui: list.g_menu_ui,
        //         g_img_on: list.g_img_on,
        //         g_img_off: list.g_img_off,
        //         use_yn: list.use_yn,
        //     };
        //     return listObj;
        // });

        // const resultObj = categoryGroupListYResult;

        // resultObj.push({
        //     id: '',
        //     parent_id: parent_id,
        //     g_num: '0',
        //     all_board: '',
        //     g_name: '숨긴분류',
        //     g_menu_ui: '',
        //     g_img_on: '',
        //     g_img_off: '',
        //     use_yn: enumConfig.useType.N[0],
        //     submenu: categoryGroupListNResult,
        // });

        //return errorHandler.successThrow(res, '', categoryGroupListResult);
    } catch (err) {
        next(err);
    }
};

// Post Board Group Create
// 2023.09.06 ash
exports.postBoardGroupCreate = async (req, res, next) => {
    const { parent_id, g_num, all_board, g_name, g_menu_ui, g_img_on, g_img_off, use_yn } = req.body;

    try {
        utilMiddleware.validateIdx(parent_id, 'parent_id');

        const groupParent = await i_category.findOne({
            where: {
                id: parent_id,
                // [Op.or]: [
                //     { c_content_type: enumConfig.contentType.BOARD[0] },
                //     { c_content_type: enumConfig.contentType.GALLERY[0] },
                //     { c_content_type: enumConfig.contentType.FAQ[0] },
                //     { c_content_type: enumConfig.contentType.QNA[0] },
                // ],
            },
        });

        if (!groupParent) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Parent Not Content.');
        }

        let calculatedCNum = g_num;

        if (!g_num) {
            const categoryCount = await i_category_board_group.count({
                attributes: [[Sequelize.literal('count(*) + 1'), 'count']],
                where: {
                    parent_id: parent_id,
                    use_yn: use_yn || enumConfig.useType.Y[0],
                },
            });

            calculatedCNum = categoryCount;
        }

        const groupOnImg = req.files['g_img_on'];
        const groupOffImg = req.files['g_img_off'];

        const groupOnImgPath = groupOnImg && groupOnImg[0] ? groupOnImg[0].path : null;
        const groupOffImgPath = groupOffImg && groupOffImg[0] ? groupOffImg[0].path : null;

        const groupCreate = await i_category_board_group.create({
            parent_id: parent_id,
            g_num: calculatedCNum || 0,
            all_board: all_board,
            g_name: g_name,
            g_menu_ui: g_menu_ui,
            g_img_on: groupOnImgPath,
            g_img_off: groupOffImgPath,
            use_yn: use_yn || enumConfig.useType.Y[0],
        });

        if (!groupCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// Post Board Group View
// 2023.09.07 ash
exports.getBoardGroupView = async (req, res, next) => {
    const { id } = req.params;

    try {
        utilMiddleware.validateIdx(id, 'id');

        const result = await i_category_board_group.findOne({
            where: {
                id: id,
                use_yn: enumConfig.useType.Y[0],
            },
            attributes: [
                'id',
                'parent_id',
                'g_num',
                'all_board',
                'g_name',
                'g_menu_ui',
                'g_img_on',
                'g_img_off',
                'use_yn',
            ],
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = {
            id: result.id,
            parent_id: result.parent_id,
            g_num: result.g_num,
            all_board: result.all_board,
            g_name: result.g_name,
            g_menu_ui: result.g_menu_ui,
            g_img_on: result.g_img_on,
            g_img_off: result.g_img_off,
            use_yn: result.use_yn,
        };

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// Post Board Group Update
// 2023.09.07 ash
exports.putBoardGroupUpdate = async (req, res, next) => {
    const { id, all_board, g_name, g_menu_ui, g_img_on, g_img_off, use_yn, g_img_on_del, g_img_off_del } = req.body;

    try {
        utilMiddleware.validateIdx(id, 'id');

        const result = await i_category_board_group.findByPk(id);

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const groupOnImg = req.files['g_img_on'];
        const groupOffImg = req.files['g_img_off'];

        const groupOnImgPath = groupOnImg && groupOnImg[0] ? groupOnImg[0].path : null;
        const groupOffImgPath = groupOffImg && groupOffImg[0] ? groupOffImg[0].path : null;

        if (g_img_on_del === 'Y') {
            await multerMiddleware.clearFile(result.g_img_on);
        }

        if (g_img_off_del === 'Y') {
            await multerMiddleware.clearFile(result.g_img_off);
        }

        const groupCreate = await i_category_board_group.update(
            {
                all_board: all_board,
                g_name: g_name,
                g_menu_ui: g_menu_ui,
                g_img_on: g_img_on_del === 'Y' ? '' : groupOnImgPath,
                g_img_off: g_img_off_del === 'Y' ? '' : groupOffImgPath,
                use_yn: use_yn,
            },
            {
                where: {
                    id: id,
                    use_yn: enumConfig.useType.Y[0],
                },
            },
        );

        if (!groupCreate) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// Delete Board Group
// 2023.09.07 ash
exports.deleteBoardGroupDestroy = async (req, res, next) => {
    const { id } = req.body;

    try {
        utilMiddleware.validateIdx(id, 'id');

        const result = await i_category_board_group.findByPk(id);

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        //   if (result.g_img_on) {
        //      await multerMiddleware.clearFile(result.g_img_on);
        //   }

        //   if (result.g_img_off) {
        //      await multerMiddleware.clearFile(result.g_img_off);
        //   }

        //   const groupDelete = await i_category_board_group.destroy({
        //      where: {
        //         id: id,
        //      },
        //   });

        const groupDelete = await i_category_board_group.update(
            {
                use_yn: enumConfig.useType.D[0],
            },
            {
                where: {
                    id: id,
                },
            },
        );

        if (!groupDelete) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        return errorHandler.successThrow(res, '', groupDelete);
    } catch (err) {
        next(err);
    }
};

// Put Board Group Move
// 2023.09.07 ash
exports.putBoardGroupMove = async (req, res, next) => {
    const { id, parent_id, g_num } = req.body;
    let transaction;

    try {
        utilMiddleware.validateIdx(id, 'id');
        utilMiddleware.validateIdx(parent_id, 'parent_id');

        transaction = await db.mariaDBSequelize.transaction();

        const result = await i_category_board_group.findOne({
            where: {
                id: id,
                use_yn: enumConfig.useType.Y[0],
            },
            attributes: ['g_num'],
            transaction,
        });

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        let moveDirection;
        if (g_num < result.g_num) {
            moveDirection = 'UP';
        }

        if (g_num > result.g_num) {
            moveDirection = 'DOWN';
        }

        if (moveDirection === 'UP') {
            await i_category_board_group.update(
                {
                    g_num: Sequelize.literal('g_num + 1'),
                },
                {
                    where: {
                        g_num: { [Op.gte]: g_num, [Op.lt]: result.g_num },
                        parent_id: parent_id,
                        use_yn: enumConfig.useType.Y[0],
                    },
                    transaction,
                },
            );
        }

        if (moveDirection === 'DOWN') {
            await i_category_board_group.update(
                {
                    g_num: Sequelize.literal('g_num - 1'),
                },
                {
                    where: {
                        g_num: { [Op.gt]: result.g_num, [Op.lte]: g_num },
                        parent_id: parent_id,
                        use_yn: enumConfig.useType.Y[0],
                    },
                    transaction,
                },
            );
        }

        await i_category_board_group.update(
            {
                g_num: g_num,
            },
            {
                where: {
                    id: id,
                },
                transaction,
            },
        );

        await transaction.commit();

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        if (transaction) {
            try {
                if (transaction.finished !== 'rollback' && transaction.finished !== 'commit') {
                    await transaction.rollback();
                }
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
        }
        next(err);
    }
};

// Put Board Group Grade
// 2025.08.06 ohsjwe
exports.putBoardGroupGrade = async (req, res, next) => {
    const { parent_id, id, g_grade } = req.body;
    let transaction;

    try {
        // 부모 ID 검증
        utilMiddleware.validateIdx(parent_id, 'parent_id');

        // ID 배열 검증
        if (!Array.isArray(id) || id.length === 0) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._400_ERROR[0], 'ID 배열이 필요합니다.');
        }

        // g_grade 값 검증 (Y, N, D 중 하나여야 함)
        if (!g_grade || !['Y', 'N', 'D'].includes(g_grade)) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._400_ERROR[0], '유효하지 않은 상태값입니다.');
        }

        // 각 ID 검증
        for (const itemId of id) {
            utilMiddleware.validateIdx(itemId, 'id');
        }

        // 트랜잭션 시작
        transaction = await db.mariaDBSequelize.transaction();

        // 선택된 ID들의 상태 일괄 변경
        const updateResult = await i_category_board_group.update(
            {
                use_yn: g_grade,
            },
            {
                where: {
                    id: {
                        [Op.in]: id,
                    },
                },
                transaction,
            },
        );

        // 업데이트된 행이 없는 경우
        if (updateResult[0] === 0) {
            await transaction.rollback();
            return errorHandler.errorThrow(
                enumConfig.statusErrorCode._404_ERROR[0],
                '업데이트할 데이터를 찾을 수 없습니다.',
            );
        }

        // 트랜잭션 커밋
        await transaction.commit();

        // 상태값에 따른 메시지 설정
        let statusMessage = '';
        switch (g_grade) {
            case 'Y':
                statusMessage = '사용';
                break;
            case 'N':
                statusMessage = '미사용';
                break;
            case 'D':
                statusMessage = '삭제';
                break;
        }

        return errorHandler.successThrow(
            res,
            '',
            `${updateResult[0]}개 항목이 ${statusMessage} 상태로 변경되었습니다.`,
        );
    } catch (err) {
        // 트랜잭션 롤백
        if (transaction) {
            await transaction.rollback();
        }
        next(err);
    }
};
