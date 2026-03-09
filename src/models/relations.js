import Willaya from "./willaya.model.js";
import Daira from "./daira.model.js";
import Commune from "./commune.model.js";
import Secteur from "./secteur.model.js";
import Etablissement from "./etablissement.model.js";
import Year from "./year.model.js";
import Trimestre from "./trimestre.model.js";
import Vacance from "./vacance.model.js";
import VacanceCalendar from "./vacance-calendar.model.js"; 
import User from "./user.model.js";
import Role from "./role.model.js";
import ResetToken from "./resetToken.model.js";
import InspectorMovement from "./inspector-movement.model.js"; // الموديل الجديد

/* ============================================================
    1. الهيكل الجغرافي والإداري (Geography & Admin Hierarchy)
============================================================ */

// علاقة الولاية بالمستخدمين
Willaya.hasMany(User, { foreignKey: "willaya_id", as: "users" });
User.belongsTo(Willaya, { foreignKey: "willaya_id", as: "willaya" });

// التسلسل الجغرافي
Willaya.hasMany(Daira, { foreignKey: "idwillaya" });
Daira.belongsTo(Willaya, { foreignKey: "idwillaya" });

Daira.hasMany(Commune, { foreignKey: "iddaira" });
Commune.belongsTo(Daira, { foreignKey: "iddaira" });

Commune.hasMany(Secteur, { foreignKey: "idcommune" });
Secteur.belongsTo(Commune, { foreignKey: "idcommune" });

// علاقة المقاطعة بالمؤسسات
Secteur.hasMany(Etablissement, { foreignKey: "idsecteur", as: "etablissements" });
Etablissement.belongsTo(Secteur, { foreignKey: "idsecteur", as: "secteur" });

/* ============================================================
    2. حركة المفتشين والأرشفة (Inspector Movements & History)
============================================================ */

// المفتش لديه العديد من الحركات (تاريخ مهني)
User.hasMany(InspectorMovement, { foreignKey: "user_id", as: "movements" });
InspectorMovement.belongsTo(User, { foreignKey: "user_id", as: "inspector" });

// المقاطعة سجلت بها عدة حركات لمفتشين مختلفين عبر السنوات
Secteur.hasMany(InspectorMovement, { foreignKey: "idsecteur", as: "assignments" });
InspectorMovement.belongsTo(Secteur, { foreignKey: "idsecteur", as: "secteur" });

// ربط الحركة بالسنة الدراسية
Year.hasMany(InspectorMovement, { foreignKey: "year_id", as: "movements" });
InspectorMovement.belongsTo(Year, { foreignKey: "year_id", as: "year" });

// علاقة Many-to-Many غير مباشرة (للتبسيط عند الاستعلام)
User.belongsToMany(Secteur, { 
  through: InspectorMovement, 
  foreignKey: "user_id", 
  otherKey: "idsecteur",
  as: "assigned_secteurs" 
});
Secteur.belongsToMany(User, { 
  through: InspectorMovement, 
  foreignKey: "idsecteur", 
  otherKey: "user_id",
  as: "current_inspectors" 
});

/* ===============================
    3. الرزنامة الأكاديمية (Academic Calendar)
================================*/

Year.hasMany(VacanceCalendar, {
  foreignKey: "year_id",
  as: "year_holidays",
  onDelete: "CASCADE",
});
VacanceCalendar.belongsTo(Year, { foreignKey: "year_id", as: "year" });

Trimestre.hasMany(VacanceCalendar, {
  foreignKey: "trimestre_id", 
  as: "trimestre_holidays",
  onDelete: "RESTRICT",
});
VacanceCalendar.belongsTo(Trimestre, { foreignKey: "trimestre_id", as: "trimestre" });

Vacance.hasMany(VacanceCalendar, {
  foreignKey: "vacance_id",
  as: "vacance_occurrences",
  onDelete: "RESTRICT",
});
VacanceCalendar.belongsTo(Vacance, { foreignKey: "vacance_id", as: "vacance_type" });

/* ===============================
    4. الحماية والأدوار (Auth & Roles)
================================*/

Role.hasMany(User, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
User.belongsTo(Role, { foreignKey: "role_id" });

User.hasMany(ResetToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ResetToken.belongsTo(User, { foreignKey: "user_id" });

/* ===============================
    5. التصدير (Exports)
================================*/
export {
  Willaya,
  Daira,
  Commune,
  Secteur,
  Etablissement,
  Year,
  Trimestre,
  Vacance,
  VacanceCalendar,
  User,
  Role,
  ResetToken,
  InspectorMovement,
};