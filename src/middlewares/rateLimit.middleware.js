import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';

/**
 * Rate limiter لطلبات إعادة تعيين كلمة المرور
 * 5 محاولات كل 15 دقيقة
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5,
  message: {
    success: false,
    message: "لقد تجاوزت عدد المحاولات المسموح بها لإعادة تعيين كلمة المرور. يرجى الانتظار 15 دقيقة"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    // استخدام ipKeyGenerator لمعالجة IPv6 بشكل صحيح
    const ipKey = ipKeyGenerator(req);
    const email = req.body?.email || 'unknown';
    return `${ipKey}-${email}`;
  },
  handler: (req, res) => {
    console.warn(`[Rate Limit Exceeded] Password reset attempts from IP: ${req.ip}, Email: ${req.body?.email}`);
    res.status(429).json({
      success: false,
      message: "لقد تجاوزت عدد المحاولات المسموح بها. يرجى الانتظار 15 دقيقة"
    });
  }
});

/**
 * Rate limiter لمحاولات إعادة تعيين كلمة المرور
 * 10 محاولات كل 15 دقيقة
 */
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10,
  message: {
    success: false,
    message: "لقد تجاوزت عدد المحاولات المسموح بها. يرجى الانتظار 15 دقيقة"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    // استخدام ipKeyGenerator لمعالجة IPv6 بشكل صحيح
    const ipKey = ipKeyGenerator(req);
    const token = req.params?.token || req.body?.token || 'unknown';
    return `${ipKey}-${token}`;
  },
  handler: (req, res) => {
    console.warn(`[Rate Limit Exceeded] Reset password attempts from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "لقد تجاوزت عدد المحاولات المسموح بها. يرجى الانتظار 15 دقيقة"
    });
  }
});

/**
 * Rate limiter للتحقق من الرموز
 * 20 محاولة كل 15 دقيقة
 */
export const verifyTokenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "لقد تجاوزت عدد المحاولات المسموح بها للتحقق من الرموز"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // استخدام ipKeyGenerator لمعالجة IPv6 بشكل صحيح
    return ipKeyGenerator(req);
  }
});

export default {
  passwordResetLimiter,
  resetPasswordLimiter,
  verifyTokenLimiter
};