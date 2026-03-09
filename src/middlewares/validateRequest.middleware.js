import { body, param, validationResult } from 'express-validator';

/**
 * تحقق من صحة طلب إعادة تعيين كلمة المرور
 */
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('صيغة البريد الإلكتروني غير صحيحة')
    .normalizeEmail()
    .toLowerCase(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صالحة',
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

/**
 * تحقق من صحة طلب إعادة تعيين كلمة المرور
 */
export const validateResetPassword = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('الرمز مطلوب')
    .isLength({ min: 64, max: 64 })
    .withMessage('الرمز يجب أن يكون 64 حرفاً')
    .matches(/^[a-f0-9]+$/i)
    .withMessage('تنسيق الرمز غير صحيح'),
  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('كلمة المرور الجديدة مطلوبة')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حروف وأرقام ورمز خاص واحد على الأقل'),
  
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('تأكيد كلمة المرور مطلوب')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('كلمتا المرور غير متطابقتين'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صالحة',
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

/**
 * تحقق من صحة رمز التحقق
 */
export const validateTokenParam = [
  param('token')
    .trim()
    .notEmpty()
    .withMessage('الرمز مطلوب')
    .isLength({ min: 64, max: 64 })
    .withMessage('الرمز يجب أن يكون 64 حرفاً')
    .matches(/^[a-f0-9]+$/i)
    .withMessage('تنسيق الرمز غير صحيح'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صالحة',
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

/**
 * Middleware رئيسي للتحقق
 */
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      message: 'بيانات الطلب غير صالحة',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

export default {
  validateForgotPassword,
  validateResetPassword,
  validateTokenParam,
  validateRequest
};