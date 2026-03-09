// services/resetToken.service.js
import { ResetToken, User } from "../models/relations.js";
import crypto from "crypto";
import { Op } from "sequelize";

const TOKEN_EXPIRATION_MINUTES = 60;

class ResetTokenService {

  // طلب إعادة تعيين كلمة المرور
  async requestPasswordReset(email) {
    // البحث عن المستخدم أولاً
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // إذا لم يُوجد المستخدم، لا نرمي خطأ
      return { success: false, message: "إذا كان البريد الإلكتروني مسجلاً في نظامنا، ستتلقى رابط إعادة التعيين قريباً" };
    }

    // تحقق من آخر طلب لتجنب spam
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentToken = await ResetToken.findOne({
      where: {
        userId: user.id,
        createdAt: { [Op.gt]: oneMinuteAgo }
      }
    });

    if (recentToken) {
      throw new Error("الرجاء الانتظار دقيقة قبل طلب رابط إعادة التعيين مرة أخرى");
    }

    // إنشاء token جديد
    const rawToken = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    const resetToken = await ResetToken.create({
      userId: user.id,
      token: rawToken,
      expiresAt
    });

    return { success: true, resetToken, user };
  }

  // التحقق من صلاحية token
  async verifyResetToken(token) {
    const resetToken = await ResetToken.findOne({ where: { token } });
    if (!resetToken) return { success: false, message: "الرمز غير صالح" };
    if (resetToken.expiresAt < new Date()) return { success: false, message: "انتهت صلاحية الرمز" };
    const user = await User.findByPk(resetToken.userId);
    if (!user) return { success: false, message: "المستخدم المرتبط بالرمز غير موجود" };
    return { success: true, email: user.email, expiresAt: resetToken.expiresAt };
  }

  // إعادة تعيين كلمة المرور
  async resetPassword(token, newPassword) {
    const resetToken = await ResetToken.findOne({ where: { token } });
    if (!resetToken) return { success: false, message: "الرمز غير صالح" };
    if (resetToken.expiresAt < new Date()) return { success: false, message: "انتهت صلاحية الرمز" };

    const user = await User.findByPk(resetToken.userId);
    if (!user) return { success: false, message: "المستخدم المرتبط بالرمز غير موجود" };

    // تحديث كلمة المرور
    user.password = newPassword;
    await user.save();

    // حذف التوكن بعد الاستخدام
    await resetToken.destroy();

    return { success: true };
  }
}

export default new ResetTokenService();
