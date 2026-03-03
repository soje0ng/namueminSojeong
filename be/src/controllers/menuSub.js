const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const {
    i_category,
    i_category_html,
    i_category_empty,
    i_category_custom,
    i_category_board,
    sequelize,
} = require('../models');
const errorHandler = require('../middleware/error');
const enumConfig = require('../middleware/enum');
const multerMiddleware = require('../middleware/multer');
const utilMiddleware = require('../middleware/util');
const db = require('../models');
const e = require('express');
const fs = require('fs').promises;

// Get SubMenu Create
// 2023.09.04 ash
exports.postSubCategoryCreate = async (req, res, next) => {
    const {
        c_depth,
        c_depth_parent,
        c_num,
        c_name,
        c_main_banner,
        c_main_banner_file,
        c_menu_ui,
        c_menu_on_img,
        c_menu_off_img,
        c_content_type,
        c_use_yn,

        content,
        page_data,

        c_type,
        file_path,
        admin_file_path,
        sms,
        email,

        b_list_cnt,
        b_column_title,
        b_column_date,
        b_column_view,
        b_column_recom,
        b_column_file,
        b_thumbnail_with,
        b_thumbnail_height,
        b_thumbnail,
        b_read_lv,
        b_write_lv,
        b_group,
        b_secret,
        b_reply,
        b_reply_lv,
        b_comment,
        b_comment_lv,
        b_write_alarm,
        b_write_send,
        b_write_sms,
        b_alarm,
        b_alarm_phone,
        b_alarm_email,
        b_top_html,
        b_template,
        b_template_text,
        c_lang,
        c_link_target,
        c_link_url,
        c_kind_use,
        b_gallery_type,
    } = req.body;

    try {
        await db.mariaDBSequelize.transaction(async transaction => {
            let calculatedCNum = c_num;

            if (!c_num) {
                const categoryCount = await i_category.count({
                    attributes: [[Sequelize.literal('count(*) + 1'), 'count']],
                    where: {
                        c_depth: c_depth,
                        c_depth_parent: c_depth_parent,
                        c_use_yn: c_use_yn || enumConfig.useType.Y[0],
                    },
                    transaction,
                });

                calculatedCNum = categoryCount;
            }

            const mainBannerFile = req.files['c_main_banner_file'];
            const menuOnImg = req.files['c_menu_on_img'];
            const menuOffImg = req.files['c_menu_off_img'];

            const mainBannerFilePath = mainBannerFile && mainBannerFile[0] ? mainBannerFile[0].path : null;
            const menuOnImgPath = menuOnImg && menuOnImg[0] ? menuOnImg[0].path : null;
            const menuOffImgPath = menuOffImg && menuOffImg[0] ? menuOffImg[0].path : null;

            const newCategory = await i_category.create(
                {
                    c_depth: c_depth,
                    c_depth_parent: c_depth_parent,
                    c_num: calculatedCNum || 0,
                    c_name: c_name,
                    c_main_banner: c_main_banner,
                    c_main_banner_file: mainBannerFilePath,
                    c_menu_ui: c_menu_ui,
                    c_menu_on_img: menuOnImgPath,
                    c_menu_off_img: menuOffImgPath,
                    c_content_type: c_content_type,
                    c_use_yn: c_use_yn || enumConfig.useType.Y[0],
                    c_lang: c_lang || enumConfig.langType.KR[0],
                    c_link_target: c_link_target,
                    c_link_url: c_link_url,
                    c_kind_use: c_kind_use,
                },
                { transaction },
            );

            let subCategory;

            switch (parseInt(c_content_type)) {
                case enumConfig.contentType.HTML[0]:
                    const processedHtmlContents = await utilMiddleware.base64ToImagesPath(content);
                    subCategory = await i_category_html.findOrCreate({
                        where: {
                            parent_id: newCategory.id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: newCategory.id,
                            content: processedHtmlContents.temp_contents,
                            page_data: page_data || null,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.EMPTY[0]:
                    subCategory = await i_category_empty.findOrCreate({
                        where: {
                            parent_id: newCategory.id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: newCategory.id,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.CUSTOM[0]:
                    subCategory = await i_category_custom.findOrCreate({
                        where: {
                            parent_id: newCategory.id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: newCategory.id,
                            c_type: c_type,
                            file_path: file_path,
                            admin_file_path: admin_file_path,
                            sms: sms,
                            email: email,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.BOARD[0]:
                case enumConfig.contentType.GALLERY[0]:
                case enumConfig.contentType.FAQ[0]:
                case enumConfig.contentType.QNA[0]:
                    const processedTopHtmlContents = await utilMiddleware.base64ToImagesPath(b_top_html);
                    const processedTemplateContents = await utilMiddleware.base64ToImagesPath(b_template_text);

                    subCategory = await i_category_board.findOrCreate({
                        where: {
                            parent_id: newCategory.id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: newCategory.id,
                            b_list_cnt: b_list_cnt,
                            b_column_title: b_column_title,
                            b_column_date: b_column_date,
                            b_column_view: b_column_view,
                            b_column_recom: b_column_recom,
                            b_column_file: b_column_file,
                            b_thumbnail_with: b_thumbnail_with,
                            b_thumbnail_height: b_thumbnail_height,
                            b_thumbnail: b_thumbnail,
                            b_read_lv: b_read_lv,
                            b_write_lv: b_write_lv,
                            b_group: b_group,
                            b_secret: b_secret,
                            b_reply: b_reply,
                            b_reply_lv: b_reply_lv,
                            b_comment: b_comment,
                            b_comment_lv: b_comment_lv,
                            b_write_alarm: b_write_alarm,
                            b_write_send: b_write_send,
                            b_write_sms: b_write_sms,
                            b_alarm: b_alarm,
                            b_alarm_phone: b_alarm_phone,
                            b_alarm_email: b_alarm_email,
                            b_top_html: processedTopHtmlContents.temp_contents,
                            b_template: b_template,
                            b_template_text: processedTemplateContents.temp_contents,
                            b_gallery_type: b_gallery_type,
                        },
                        transaction,
                    });
                    break;
                default:
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Invalid c_contents_type');
            }

            if (!subCategory) {
                return errorHandler.errorThrow(
                    enumConfig.statusErrorCode._404_ERROR[0],
                    '이미 지정된 메뉴가 있습니다.',
                );
            }
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// Post Sub Menu View
// 2023.09.04 ash
exports.getSubCategoryView = async (req, res, next) => {
    const { id } = req.params;

    try {
        utilMiddleware.validateIdx(id, 'id');

        const result = await i_category.findByPk(id);

        if (!result) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        const resultObj = {
            id: result.id,
            c_depth: result.c_depth,
            c_depth_parent: result.c_depth_parent,
            c_num: result.c_num,
            c_name: result.c_name,
            c_main_banner: result.c_main_banner,
            c_main_banner_file: result.c_main_banner_file,
            c_menu_ui:
                result.c_menu_ui === enumConfig.menuUiType.TXT[0]
                    ? enumConfig.menuUiType.TXT
                    : result.c_menu_ui === enumConfig.menuUiType.IMG[0]
                    ? enumConfig.menuUiType.IMG
                    : null,
            c_menu_on_img: result.c_menu_on_img,
            c_menu_off_img: result.c_menu_off_img,
            c_content_type: utilMiddleware.mapContentType(result.c_content_type),
            c_use_yn: result.c_use_yn,
            c_lang: result.c_lang,
            c_link_target:
                result.c_link_target === enumConfig.bannerLinkType.PARENT[0]
                    ? enumConfig.bannerLinkType.PARENT
                    : result.c_link_target === enumConfig.bannerLinkType.BLANK[0]
                    ? enumConfig.bannerLinkType.BLANK
                    : null,
            c_link_url: result.c_link_url,
            c_kind_use: result.c_kind_use,
        };

        let subView;

        switch (result.c_content_type) {
            case enumConfig.contentType.HTML[0]:
                subView = await i_category_html.findOne({
                    where: {
                        parent_id: id,
                    },
                    attributes: ['parent_id', 'content', 'page_data'],
                });
                break;
            case enumConfig.contentType.EMPTY[0]:
                subView = await i_category_empty.findOne({
                    where: {
                        parent_id: id,
                    },
                    attributes: ['parent_id'],
                });
                break;
            case enumConfig.contentType.CUSTOM[0]:
                subView = await i_category_custom.findOne({
                    where: {
                        parent_id: id,
                    },
                    attributes: ['parent_id', 'c_type', 'file_path', 'admin_file_path', 'sms', 'email'],
                });
                break;
            case enumConfig.contentType.BOARD[0]:
            case enumConfig.contentType.GALLERY[0]:
            case enumConfig.contentType.FAQ[0]:
            case enumConfig.contentType.QNA[0]:
                subView = await i_category_board.findOne({
                    where: {
                        parent_id: id,
                    },
                    attributes: [
                        'parent_id',
                        'b_list_cnt',
                        'b_column_title',
                        'b_column_date',
                        'b_column_view',
                        'b_column_recom',
                        'b_column_file',
                        'b_thumbnail_with',
                        'b_thumbnail_height',
                        'b_thumbnail',
                        'b_read_lv',
                        'b_write_lv',
                        'b_group',
                        'b_secret',
                        'b_reply',
                        'b_reply_lv',
                        'b_comment',
                        'b_comment_lv',
                        'b_write_alarm',
                        'b_write_send',
                        'b_write_sms',
                        'b_alarm',
                        'b_alarm_phone',
                        'b_alarm_email',
                        'b_top_html',
                        'b_template',
                        'b_template_text',
                        'b_gallery_type',
                    ],
                });
                break;
            default:
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Invalid c_contents_type');
        }

        if (!subView) {
            return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
        }

        switch (result.c_content_type) {
            case enumConfig.contentType.HTML[0]:
                resultObj.parent_id = subView.parent_id;
                resultObj.content = subView.content;
                resultObj.page_data = subView.page_data;
                break;
            case enumConfig.contentType.EMPTY[0]:
                resultObj.parent_id = subView.parent_id;
                break;
            case enumConfig.contentType.CUSTOM[0]:
                resultObj.parent_id = subView.parent_id;
                resultObj.c_type = subView.c_type;
                resultObj.file_path = subView.file_path;
                resultObj.admin_file_path = subView.admin_file_path;
                resultObj.sms = subView.sms;
                resultObj.email = subView.email;
                break;
            case enumConfig.contentType.BOARD[0]:
            case enumConfig.contentType.GALLERY[0]:
            case enumConfig.contentType.FAQ[0]:
            case enumConfig.contentType.QNA[0]:
                resultObj.parent_id = subView.parent_id;
                resultObj.b_list_cnt = subView.b_list_cnt;
                resultObj.b_column_title = subView.b_column_title;
                resultObj.b_column_date = subView.b_column_date;
                resultObj.b_column_view = subView.b_column_view;
                resultObj.b_column_recom = subView.b_column_recom;
                resultObj.b_column_file = subView.b_column_file;
                resultObj.b_thumbnail_with = subView.b_thumbnail_with;
                resultObj.b_thumbnail_height = subView.b_thumbnail_height;
                resultObj.b_thumbnail = subView.b_thumbnail;
                resultObj.b_read_lv = subView.b_read_lv;
                resultObj.b_write_lv = subView.b_write_lv;
                resultObj.b_group = subView.b_group;
                resultObj.b_secret = subView.b_secret;
                resultObj.b_reply = subView.b_reply;
                resultObj.b_reply_lv = subView.b_reply_lv;
                resultObj.b_comment = subView.b_comment;
                resultObj.b_comment_lv = subView.b_comment_lv;
                resultObj.b_write_alarm = subView.b_write_alarm;
                resultObj.b_write_send = subView.b_write_send;
                resultObj.b_write_sms = subView.b_write_sms;
                resultObj.b_alarm = subView.b_alarm;
                resultObj.b_alarm_phone = subView.b_alarm_phone;
                resultObj.b_alarm_email = subView.b_alarm_email;
                resultObj.b_top_html = subView.b_top_html;
                resultObj.b_template = subView.b_template;
                resultObj.b_template_text = subView.b_template_text;
                resultObj.b_gallery_type = subView.b_gallery_type;
                break;
            default:
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Invalid c_contents_type');
        }

        return errorHandler.successThrow(res, '', resultObj);
    } catch (err) {
        next(err);
    }
};

// Get SubMenu Update
// 2023.09.04 ash
exports.putSubCategoryUpdate = async (req, res, next) => {
    const {
        id,
        c_depth,
        c_depth_parent,
        c_num,
        c_name,
        c_main_banner,
        c_main_banner_file,
        c_menu_ui,
        c_menu_on_img,
        c_menu_off_img,
        c_content_type,
        c_use_yn,

        content,
        page_data,

        c_type,
        file_path,
        admin_file_path,
        sms,
        email,

        b_list_cnt,
        b_column_title,
        b_column_date,
        b_column_view,
        b_column_recom,
        b_column_file,
        b_thumbnail_with,
        b_thumbnail_height,
        b_thumbnail,
        b_read_lv,
        b_write_lv,
        b_group,
        b_secret,
        b_reply,
        b_reply_lv,
        b_comment,
        b_comment_lv,
        b_write_alarm,
        b_write_send,
        b_write_sms,
        b_alarm,
        b_alarm_phone,
        b_alarm_email,
        b_top_html,
        b_template,
        b_template_text,
        b_gallery_type,

        c_main_banner_file_del,
        c_menu_on_img_del,
        c_menu_off_img_del,
        c_link_target,
        c_link_url,
        c_kind_use,
    } = req.body;

    try {
        utilMiddleware.validateIdx(id, 'id');

        await db.mariaDBSequelize.transaction(async transaction => {
            const menuView = await i_category.findByPk(id, { transaction });

            if (!menuView) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            const getFile = async (fieldName, currentPath) => {
                const file = req.files[fieldName];
                return file && file[0]
                    ? currentPath !== file[0].path && currentPath !== null
                        ? (await multerMiddleware.clearFile(currentPath), file[0].path)
                        : file[0].path
                    : currentPath;
            };

            const mainBannerFilePath = await getFile('c_main_banner_file', menuView.c_main_banner_file);
            const menuOnImgPath = await getFile('c_menu_on_img', menuView.c_menu_on_img);
            const menuOffImgPath = await getFile('c_menu_off_img', menuView.c_menu_off_img);

            if (c_main_banner_file_del === 'Y') {
                try {
                    await fs.access(menuView.c_main_banner_file, fs.constants.F_OK);
                    await multerMiddleware.clearFile(menuView.c_main_banner_file);
                } catch (err) {
                    console.log('파일이 존재하지 않습니다.');
                }
            }

            if (c_menu_on_img_del === 'Y') {
                await multerMiddleware.clearFile(menuView.c_menu_on_img);
            }

            if (c_menu_off_img_del === 'Y') {
                await multerMiddleware.clearFile(menuView.c_menu_off_img);
            }

            await i_category.update(
                {
                    c_depth: c_depth,
                    c_depth_parent: c_depth_parent,
                    c_num: c_num,
                    c_name: c_name,
                    c_main_banner: c_main_banner,
                    c_main_banner_file: c_main_banner_file_del === 'Y' ? '' : mainBannerFilePath,
                    c_menu_ui: c_menu_ui,
                    c_menu_on_img: c_menu_on_img_del === 'Y' ? '' : menuOnImgPath,
                    c_menu_off_img: c_menu_off_img_del === 'Y' ? '' : menuOffImgPath,
                    c_content_type: c_content_type,
                    c_use_yn: c_use_yn || enumConfig.useType.Y[0],
                    c_link_target: c_link_target,
                    c_link_url: c_link_url,
                    c_kind_use: c_kind_use,
                },
                {
                    where: {
                        id: id,
                    },
                    transaction,
                },
            );

            let subCategory;

            switch (parseInt(c_content_type)) {
                case enumConfig.contentType.HTML[0]:
                    const processedHtmlContents = await utilMiddleware.base64ToImagesPath(content);

                    const htmlView = await i_category_html.findOrCreate({
                        where: {
                            parent_id: id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: id,
                            content: processedHtmlContents.temp_contents,
                            page_data: page_data || null,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        transaction,
                    });

                    if (htmlView[1] === false) {
                        subCategory = await i_category_html.update(
                            {
                                content: content,
                                page_data: page_data || null,
                            },
                            {
                                where: {
                                    parent_id: id,
                                },
                                transaction,
                            },
                        );
                    }

                    break;
                case enumConfig.contentType.EMPTY[0]:
                    const emptyView = await i_category_empty.findOrCreate({
                        where: {
                            parent_id: id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        transaction,
                    });

                    if (emptyView[1] === false) {
                        subCategory = await i_category_empty.update(
                            {
                                parent_id: id,
                            },
                            {
                                where: {
                                    parent_id: id,
                                },
                                transaction,
                            },
                        );
                    }

                    break;
                case enumConfig.contentType.CUSTOM[0]:
                    const customView = await i_category_custom.findOrCreate({
                        where: {
                            parent_id: id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: id,
                            c_type: c_type,
                            file_path: file_path,
                            admin_file_path: admin_file_path,
                            sms: sms,
                            email: email,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        transaction,
                    });

                    if (customView[1] === false) {
                        subCategory = await i_category_custom.update(
                            {
                                c_type: c_type,
                                file_path: file_path,
                                admin_file_path: admin_file_path,
                                sms: sms,
                                email: email,
                            },
                            {
                                where: {
                                    parent_id: id,
                                },
                                transaction,
                            },
                        );
                    }

                    break;
                case enumConfig.contentType.BOARD[0]:
                case enumConfig.contentType.GALLERY[0]:
                case enumConfig.contentType.FAQ[0]:
                case enumConfig.contentType.QNA[0]:
                    const processedTopHtmlContents = await utilMiddleware.base64ToImagesPath(b_top_html);
                    const processedTemplateContents = await utilMiddleware.base64ToImagesPath(b_template_text);

                    const boardView = await i_category_board.findOrCreate({
                        where: {
                            parent_id: id,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        defaults: {
                            parent_id: id,
                            b_list_cnt: b_list_cnt,
                            b_column_title: b_column_title,
                            b_column_date: b_column_date,
                            b_column_view: b_column_view,
                            b_column_recom: b_column_recom,
                            b_column_file: b_column_file,
                            b_thumbnail_with: b_thumbnail_with,
                            b_thumbnail_height: b_thumbnail_height,
                            b_thumbnail: b_thumbnail,
                            b_read_lv: b_read_lv,
                            b_write_lv: b_write_lv,
                            b_group: b_group,
                            b_secret: b_secret,
                            b_reply: b_reply,
                            b_reply_lv: b_reply_lv,
                            b_comment: b_comment,
                            b_comment_lv: b_comment_lv,
                            b_write_alarm: b_write_alarm,
                            b_write_send: b_write_send,
                            b_write_sms: b_write_sms,
                            b_alarm: b_alarm,
                            b_alarm_phone: b_alarm_phone,
                            b_alarm_email: b_alarm_email,
                            b_top_html: processedTopHtmlContents.temp_contents,
                            b_template: b_template,
                            b_template_text: b_template_text,
                            b_gallery_type: b_gallery_type,
                            use_yn: enumConfig.useType.Y[0],
                        },
                        transaction,
                    });

                    if (boardView[1] === false) {
                        subCategory = await i_category_board.update(
                            {
                                b_list_cnt: b_list_cnt,
                                b_column_title: b_column_title,
                                b_column_date: b_column_date,
                                b_column_view: b_column_view,
                                b_column_recom: b_column_recom,
                                b_column_file: b_column_file,
                                b_thumbnail_with: b_thumbnail_with,
                                b_thumbnail_height: b_thumbnail_height,
                                b_thumbnail: b_thumbnail,
                                b_read_lv: b_read_lv,
                                b_write_lv: b_write_lv,
                                b_group: b_group,
                                b_secret: b_secret,
                                b_reply: b_reply,
                                b_reply_lv: b_reply_lv,
                                b_comment: b_comment,
                                b_comment_lv: b_comment_lv,
                                b_write_alarm: b_write_alarm,
                                b_write_send: b_write_send,
                                b_write_sms: b_write_sms,
                                b_alarm: b_alarm,
                                b_alarm_phone: b_alarm_phone,
                                b_alarm_email: b_alarm_email,
                                b_top_html: b_top_html,
                                b_template: b_template,
                                b_template_text: processedTemplateContents.temp_contents,
                                b_gallery_type: b_gallery_type,
                            },
                            {
                                where: {
                                    parent_id: id,
                                },
                                transaction,
                            },
                        );
                    }
                    break;
                default:
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Invalid c_contents_type');
            }

            //if (!subCategory) {
            //   return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            //}
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};

// Delete SubMenu
// 2023.09.04 ash
exports.deleteSubCategoryDestroy = async (req, res, next) => {
    const { id } = req.body;

    try {
        utilMiddleware.validateIdx(id, 'id');

        await db.mariaDBSequelize.transaction(async transaction => {
            const result = await i_category.findByPk(id, { transaction });

            if (!result) {
                return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], '');
            }

            await i_category.update(
                {
                    c_use_yn: enumConfig.useType.D[0],
                },
                {
                    where: {
                        id: id,
                    },
                },
            );

            switch (result.dataValues.c_content_type) {
                case enumConfig.contentType.HTML[0]:
                    await i_category_html.destroy({
                        where: {
                            parent_id: id,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.EMPTY[0]:
                    await i_category_empty.destroy({
                        where: {
                            parent_id: id,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.CUSTOM[0]:
                    await i_category_custom.destroy({
                        where: {
                            parent_id: id,
                        },
                        transaction,
                    });
                    break;
                case enumConfig.contentType.BOARD[0]:
                case enumConfig.contentType.GALLERY[0]:
                case enumConfig.contentType.FAQ[0]:
                case enumConfig.contentType.QNA[0]:
                    await i_category_board.destroy({
                        where: {
                            parent_id: id,
                        },
                        transaction,
                    });
                    break;
                default:
                    return errorHandler.errorThrow(enumConfig.statusErrorCode._404_ERROR[0], 'Invalid c_contents_type');
            }

            // 🔹 c_num 재정렬 (동일 parent_id 내에서만)
            const siblings = await i_category.findAll({
                where: {
                    c_depth_parent: result.dataValues.c_depth_parent,
                    c_use_yn: { [Op.ne]: enumConfig.useType.D[0] }, // D 제외
                },
                order: [['c_num', 'ASC']],
                transaction,
            });

            for (let i = 0; i < siblings.length; i++) {
                await siblings[i].update(
                    { c_num: i + 1 }, // 1부터 다시 부여
                    { transaction },
                );
            }
        });

        return errorHandler.successThrow(res, '', '');
    } catch (err) {
        next(err);
    }
};
