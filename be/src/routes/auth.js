const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const isAuthMiddleware = require('../middleware/is-auth');

const validatorMiddleware = require('../middleware/validator');

router.post('/signup', validatorMiddleware.singUpValidator, authController.postSignup); // 회원가입

router.post('/login', validatorMiddleware.loginValidator, authController.postLogin); //로그인

router.post('/admin/login', validatorMiddleware.loginValidator, authController.adminPostLogin); //관리자 로그인

router.post('/email', validatorMiddleware.mailValidatorRequired, authController.postEmailDoubleCheck); //이메일 중복확인

router.post('/email-password', validatorMiddleware.mailValidatorRequired, authController.postPasswordResetEmailSend); // 비밀번호 재설정 이메일 전송
router.put('/email-password', validatorMiddleware.newPasswordValidatorRequired, authController.putPasswordResetEmail); // 이메일 비밀번호 재설정

router.post(
    '/reset-password',
    validatorMiddleware.newPasswordValidatorRequired,
    isAuthMiddleware.isAuth,
    authController.postResetPassword,
); // 비밀번호 재설정

router.get('/view', isAuthMiddleware.isAuth, authController.getUserView); // 회원정보 조회
router.put('/user', validatorMiddleware.mobileValidatorRequired, isAuthMiddleware.isAuth, authController.putUserUpdate); // 회원정보 수정
router.delete('/user', isAuthMiddleware.isAuth, authController.deleteUserDestroy); // 회원탈퇴하기

router.get('/popup', authController.getPopupList); //팝업 리스트
router.get('/popupDetail/:idx', authController.getPopupDetail); //팝업 상세

router.post('/refresh', authController.postTokenRefresh); // 토큰 리프레시

module.exports = router;
