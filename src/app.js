import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // حماية إضافية للإنتاج

// تحميل متغيرات البيئة
dotenv.config();

// استيراد كافة المسارات
import authRoutes from './routes/auth.routes.js';
import resetTokenRoutes from "./routes/resetToken.routes.js";
import userRoutes from "./routes/user.routes.js";
import willayaRoutes from "./routes/willaya.routes.js";
import dairaRoutes from "./routes/daira.routes.js";
import communeRoutes from "./routes/commune.routes.js";
import secteurRoutes from "./routes/secteur.routes.js";
import etablissementRoutes from "./routes/etablissement.routes.js";
import yearRoutes from "./routes/year.routes.js";
import vacanceRoutes from "./routes/vacance.routes.js";
import roleRoutes from "./routes/role.routes.js";
import levelRoutes from "./routes/level.routes.js";
import trimestreRoutes from "./routes/trimestre.routes.js";
import vacanceCalendarRoutes from "./routes/vacance-calendar.routes.js";
import reportRoutes from './routes/reportRoutes.js';

const app = express();

// ----------------------
// 1. إعدادات الحماية والـ Middlewares
// ----------------------

// استخدام Helmet لضبط رؤوس حماية HTTP (ضروري جداً للدومين المدفوع)
// app.use(helmet({
//     crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
//     crossOriginEmbedderPolicy: { policy: "unsafe-none" }
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------------
// 2. إعدادات CORS الديناميكية
// ----------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ["http://localhost:3000", "http://localhost:8080"];

app.use(cors({
  origin: function (origin, callback) {
    // السماح بالطلبات بدون origin (مثل تطبيقات الجوال/Postman) أو العناوين المحددة
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: This origin is not allowed'));
    }
  },
  credentials: true
}));

// ----------------------
// 3. تعريف المسارات (Routes)
// ----------------------

// مسارات المصادقة والأمان
app.use('/api/auth', authRoutes);
app.use('/api/auth', resetTokenRoutes);

// مسارات المستخدمين والجغرافيا
app.use("/api/users", userRoutes);
app.use("/api/willayas", willayaRoutes);
app.use("/api/dairas", dairaRoutes);
app.use("/api/communes", communeRoutes);

// مسارات المؤسسات والقطاعات
app.use("/api/secteurs", secteurRoutes);
app.use("/api/etablissements", etablissementRoutes);

// مسارات الزمن والدراسة (التي استخدمتها في الـ Seed)
app.use("/api/years", yearRoutes);
app.use("/api/vacances", vacanceRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/trimestres", trimestreRoutes);
app.use("/api/vacance-calendar",vacanceCalendarRoutes);
app.use("/api/reports", reportRoutes);
// ----------------------
// 4. معالجة الأخطاء والروابط غير الموجودة
// ----------------------

// معالجة خطأ 404 (Route not found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "المسار المطلوب غير موجود على الخادم"
  });
});

// المعالج المركزي للأخطاء (Global Error Handler)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // في وضع الإنتاج، نرسل رسالة مبسطة ولا نرسل الـ stack trace
  res.status(statusCode).json({
    success: false,
    message: err.message || "حدث خطأ داخلي في الخادم",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;