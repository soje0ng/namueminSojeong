const express = require('express');
const router = express.Router();

const builderController = require('../controllers/builder');
const isAuthMiddleware = require('../middleware/is-auth');

// 빌더 페이지 CRUD
router.post('/', isAuthMiddleware.isAuthAdmin, builderController.postBuilderPageCreate); // 페이지 생성
router.get('/', isAuthMiddleware.isAuthAdmin, builderController.getBuilderPageList); // 페이지 리스트
router.get('/:idx', isAuthMiddleware.isAuthAdmin, builderController.getBuilderPageView); // 페이지 상세
router.put('/', isAuthMiddleware.isAuthAdmin, builderController.putBuilderPageUpdate); // 페이지 수정
router.delete('/', isAuthMiddleware.isAuthAdmin, builderController.deleteBuilderPageDestroy); // 페이지 삭제

// 발행 관리
router.post('/publish', isAuthMiddleware.isAuthAdmin, builderController.postBuilderPagePublish); // 발행/발행취소

// 버전 히스토리
router.get('/version/:idx', isAuthMiddleware.isAuthAdmin, builderController.getBuilderPageVersionList); // 버전 목록
router.get('/version/detail/:idx', isAuthMiddleware.isAuthAdmin, builderController.getBuilderPageVersionView); // 버전 상세
router.post('/version/restore', isAuthMiddleware.isAuthAdmin, builderController.postBuilderPageVersionRestore); // 버전 복원

// AI 코드 생성
router.post('/ai/generate', isAuthMiddleware.isAuthAdmin, builderController.postBuilderAiGenerate); // AI 생성

module.exports = router;
