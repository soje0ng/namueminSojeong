const express = require('express');
const router = express.Router();

const configController = require('../controllers/config');
const menuController = require('../controllers/menu');
const menuSubController = require('../controllers/menuSub');
const bannerController = require('../controllers/banner');
const menuBoardGroupController = require('../controllers/menuBoardGroup');
const builderController = require('../controllers/builder');

router.get('/config/site/:site_id/:c_lang', configController.getConfigSite); // 사이트 정보
router.get('/config/policy', configController.getConfigPolicy); //운영정책 설정
router.get('/config/policy/:idx', configController.getConfigPolicyView); //운영정책 내용

router.get('/menu', menuController.getCategoryList); // 메뉴 리스트
router.get('/menu/sub/:id', menuSubController.getSubCategoryView); // 서브메뉴 내용
router.get('/menu/boardGroup/:parent_id', menuBoardGroupController.getBoardGroupList); // 서브메뉴 게시판 구분 리스트

router.get('/banner', bannerController.getBannerList); //배너 리스트

router.get('/page/:slug/:lang?', builderController.getPublicBuilderPage); // 빌더 페이지 조회 (Public)

module.exports = router;
