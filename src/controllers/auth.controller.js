import { User, Willaya } from '../models/relations.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Op } from 'sequelize';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'doudi.said47@gmail.com',
    pass: process.env.SMTP_PASS || 'bwuasajdyxmsolmy',
  },
});

// دالة مساعدة لإنشاء التوكن لتقليل تكرار الكود
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      role_id: user.role_id, 
      willaya_id: user.willaya_id 
    },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1d" }
  );
};

// --------------------
// تسجيل الدخول العادي
// --------------------
export const login = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({ 
      where: {
        [Op.or]: [
          email ? { email } : null,
          phone ? { phone } : null
        ].filter(Boolean)
      },
      include: [{
        model: Willaya,
        as: 'willaya'
      }]
    });

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "كلمة المرور غير صحيحة." });

    // إنشاء التوكن متضمناً البيانات اللازمة للفلترة
    const token = generateToken(user);

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role_id: String(user.role_id || "3"),
        willaya_id: user.willaya_id,
        willaya: user.willaya ? {
          id: user.willaya.id,
          name: user.willaya.willayaname
        } : null
      }
    });

  } catch (err) {
    console.error("[Login Error]", err);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء تسجيل الدخول." });
  }
};

// --------------------
// تسجيل الدخول عبر Google
// --------------------
export const googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) return res.status(400).json({ success: false, message: "توكن Google مفقود" });

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ success: false, message: "البريد الإلكتروني غير موجود من Google" });

    let user = await User.findOne({ 
      where: { email: payload.email },
      include: [{ model: Willaya, as: 'willaya' }]
    });

    if (!user) {
      user = await User.create({
        username: payload.name || "GoogleUser",
        email: payload.email,
        willaya_id: null,
        password: bcrypt.hashSync(Math.random().toString(36), 10),
        role_id: "3",
        provider: "google"
      });
    }

    // تصحيح: إضافة البيانات كاملة لتوكن جوجل أيضاً
    const jwtToken = generateToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: String(user.role_id || "3"),
        willaya_id: user.willaya_id,
        willaya: user.willaya ? {
          id: user.willaya.id,
          name: user.willaya.willayaname
        } : null
      }
    });

  } catch (err) {
    console.error("[Google Login Error]", err);
    res.status(500).json({ success: false, message: "فشل تسجيل الدخول عبر Google." });
  }
};

// --------------------
// طلب إعادة تعيين كلمة المرور
// --------------------
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'البريد الإلكتروني غير موجود.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"NoReply" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `<div dir="rtl">
               <p>لقد طلبت إعادة تعيين كلمة المرور. اضغط على الرابط أدناه:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
             </div>`
    });

    res.json({ message: 'تم إرسال رابط إعادة تعيين كلمة المرور.' });

  } catch (err) {
    console.error('[Forgot Password Error]', err);
    res.status(500).json({ message: 'فشل إرسال رابط إعادة التعيين.' });
  }
};

// --------------------
// إعادة تعيين كلمة المرور
// --------------------
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) return res.status(400).json({ message: 'الرابط غير صالح أو منتهي الصلاحية.' });

    user.password = newPassword; 
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'تم تغيير كلمة المرور بنجاح.' });

  } catch (err) {
    console.error('[Reset Password Error]', err);
    res.status(500).json({ message: 'فشل إعادة تعيين كلمة المرور.' });
  }
};