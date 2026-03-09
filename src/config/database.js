import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_CONFIG = {
  host: process.env.DB_HOST_ENV || process.env.DB_HOST || "localhost",
  user: process.env.DB_USER_ENV || process.env.DB_USER || "root",
  password: process.env.DB_PASS_ENV || process.env.DB_PASSWORD || "",
  name: process.env.DB_NAME_ENV || process.env.DB_NAME || "data",
  port: Number(process.env.DB_PORT) || 3306,
};

/**
 * 1. إنشاء قاعدة البيانات باستخدام mysql2 (بدون تحديد اسم القاعدة في البداية)
 */
export const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.name}\`;`);
    await connection.end();
    console.log(`✔ Database "${DB_CONFIG.name}" checked/created.`);
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
    throw error;
  }
};

/**
 * 2. إعداد كائن Sequelize
 */
const sequelize = new Sequelize(DB_CONFIG.name, DB_CONFIG.user, DB_CONFIG.password, {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  dialect: "mysql",
  logging: false,
  define: {
    freezeTableName: true, // يمنع تكرار الأسماء (year/years)
    underscored: true,
  },
});

export const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js"), // تأكد من وجود هذا المجلد
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }), // يخزن السجلات في جدول SequelizeMeta
  logger: console,
});

/**
 * 4. وظيفة تشغيل التهجير
 */
export const runMigrations = async () => {
  try {
    await migrator.up();
    console.log("✅ Migrations completed.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

export default sequelize;