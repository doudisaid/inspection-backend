import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize, { ensureDatabaseExists, runMigrations } from "./config/database.js";
import "./models/relations.js"; // استيراد العلاقات قبل المزامنة لبناء المفاتيح الخارجية
import { seedStaticData } from "./config/seedRoles.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("🚀 Starting initialization...");

    // 1. التأكد من وجود قاعدة البيانات أو إنشاؤها (mysql2)
    await ensureDatabaseExists();

    // 2. محاولة الاتصال بـ Sequelize
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // 3. تشغيل التهجيرات (Migrations) إن وجدت
    await runMigrations();

    // 4. مزامنة الموديلات مع الجداول
    // ملاحظة: إذا استمرت مشاكل FK، استخدم { force: true } لمرة واحدة فقط لتصفير الجداول
    await sequelize.sync({ alter: false }); 
    console.log("✅ Database schema synchronized.");

    // 5. ملء البيانات الثابتة (Seeds)
    await seedStaticData();

    // 6. تشغيل السيرفر
    app.listen(PORT, () => {
      console.log(`✨ Server is running on port ${PORT}`);
      console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error("❌ Critical Error during server startup:");
    console.error(error);
    process.exit(1); // إنهاء العملية فوراً عند الفشل الذريع
  }
}

startServer();