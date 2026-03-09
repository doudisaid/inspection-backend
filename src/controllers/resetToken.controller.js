import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import User from '../models/user.model.js';

// -----------------------------
// إعداد Nodemailer
console.log("HOST:", process.env.EMAIL_HOST);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true للبورت 465 مع SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // لتجنب مشاكل الشهادة
  },
});

// -----------------------------
// 1️⃣ طلب إعادة تعيين كلمة المرور
export async function requestPasswordReset(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    // إنشاء توكن عشوائي
    const token = crypto.randomBytes(32).toString('hex');

    // حفظ التوكن ووقت الانتهاء (1 ساعة)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // رابط إعادة التعيين للـ frontend
    const frontendUrl = process.env.VUE_APP_FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    // إعداد البريد
    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <p>مرحبًا ${user.username || ''},</p>
        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
        <p>اضغط على الرابط التالي لتعيين كلمة مرور جديدة:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>إذا لم تطلب إعادة التعيين، تجاهل هذا البريد.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' });

  } catch (err) {
    console.error("Request reset password error:", err);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء معالجة الطلب' });
  }
}

// -----------------------------
// 2️⃣ التحقق من صلاحية التوكن
export async function verifyResetToken(req, res) {
  const { token } = req.params;
  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token, 
        resetPasswordExpires: { [Op.gt]: Date.now() } // توكن صالح
      } 
    });

    if (!user) return res.status(400).json({ success: false, message: 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته' });

    return res.json({ success: true, message: 'التوكن صالح' });

  } catch (err) {
    console.error("Verify reset token error:", err);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من التوكن' });
  }
}

// -----------------------------
// 3️⃣ إعادة تعيين كلمة المرور
export async function resetPassword(req, res) {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token, 
        resetPasswordExpires: { [Op.gt]: Date.now() } // توكن صالح
      } 
    });

    if (!user) return res.status(400).json({ success: false, message: 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته' });

    // تحديث كلمة المرور (تأكد من وجود hook لتشفير كلمة المرور)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' });

  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' });
  }
}
