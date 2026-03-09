// routes/resetToken.routes.js
import express from 'express';
import { 
  requestPasswordReset, 
  verifyResetToken, 
  resetPassword 
} from '../controllers/resetToken.controller.js';
import { 
  passwordResetLimiter, 
  resetPasswordLimiter,
  verifyTokenLimiter 
} from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

/**
 * @route POST /api/auth/forgot-password
 * @desc طلب إعادة تعيين كلمة المرور
 * @access Public
 */
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
  console.log(`[Forgot Password] Request received for email: ${req.body.email} at ${new Date().toISOString()}`);
  try {
    await requestPasswordReset(req, res);
  } catch (error) {
    console.error("[Forgot Password Error]:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء معالجة طلب إعادة التعيين"
    });
  }
});

/**
 * @route GET /api/auth/verify-reset-token/:token
 * @desc التحقق من صلاحية رمز إعادة التعيين
 * @access Public
 */
router.get('/verify-reset-token/:token', verifyTokenLimiter, async (req, res) => {
  const token = req.params.token;
  console.log(`[Verify Reset Token] Checking token: ${token} at ${new Date().toISOString()}`);
  try {
    await verifyResetToken(req, res);
  } catch (error) {
    console.error("[Verify Reset Token Error]:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء التحقق من الرمز، يرجى المحاولة لاحقًا"
    });
  }
});

/**
 * @route POST /api/auth/reset-password/:token
 * @desc إعادة تعيين كلمة المرور باستخدام الرمز
 * @access Public
 */
router.post('/reset-password/:token', resetPasswordLimiter, async (req, res) => {
  const token = req.params.token;
  console.log(`[Reset Password] Attempt for token: ${token} at ${new Date().toISOString()}`);
  try {
    await resetPassword(req, res);
  } catch (error) {
    console.error("[Reset Password Error]:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إعادة تعيين كلمة المرور"
    });
  }
});

export default router;
