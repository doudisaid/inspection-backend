import express from 'express';
import { login, requestPasswordReset, resetPassword , googleLogin } from '../controllers/auth.controller.js';

const router = express.Router();

// تسجيل الدخول بالبريد وكلمة المرور
router.post('/login', login);

router.post('/google-login', googleLogin);

// طلب رابط إعادة تعيين كلمة المرور
router.post('/request-reset', requestPasswordReset);

// إعادة تعيين كلمة المرور باستخدام التوكن
router.post('/reset-password', resetPassword);



export default router;
