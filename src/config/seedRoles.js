import bcrypt from "bcryptjs";
import Role from "../models/role.model.js";
import Level from "../models/level.model.js";
import Trimestre from "../models/trimestre.model.js";
import Vacance from "../models/vacance.model.js";
import Willaya from "../models/willaya.model.js";
import User from "../models/user.model.js"; 

export async function seedStaticData() {
  try {
    // 1. زرع الأدوار (Roles)
    await Role.bulkCreate([
      { id: "0", role_name: "SuperAdmin" },
      { id: "1", role_name: "chief" },
      { id: "2", role_name: "inspector" },
      { id: "3", role_name: "manager" }
    ], { 
      updateOnDuplicate: ["role_name"] 
    });

    // 2. زرع الثلاثيات (Trimestres)
    await Trimestre.bulkCreate([
      { id: 1, trimestre_name: "الثلاثي الأول" },
      { id: 2, trimestre_name: "الثلاثي الثاني" },
      { id: 3, trimestre_name: "الثلاثي الثالث" }
    ], { 
      updateOnDuplicate: ["trimestre_name"] 
    });

    // 3. زرع أنواع العطل (Vacances)
    await Vacance.bulkCreate([
      { id: 1, vacance_name: "عطلة الخريف" },
      { id: 2, vacance_name: "عطلة الشتاء" },
      { id: 3, vacance_name: "عطلة الربيع" },
      { id: 4, vacance_name: "عطلة الصيف" }
    ], { 
      updateOnDuplicate: ["vacance_name"] 
    });

    // 4. زرع الأطوار التعليمية (Levels)
    await Level.bulkCreate([
      { id: 1, level_name: "ابتدائي" },
      { id: 2, level_name: "متوسط" },
      { id: 3, level_name: "ثانوي" }
    ], { 
      updateOnDuplicate: ["level_name"] 
    });

    // 5. زرع قائمة الولايات الـ 58
    await Willaya.bulkCreate([
      { id: "01", willayaname: "أدرار" }, { id: "02", willayaname: "الشلف" }, { id: "03", willayaname: "الأغواط" },
      { id: "04", willayaname: "أم البواقي" }, { id: "05", willayaname: "باتنة" }, { id: "06", willayaname: "بجاية" },
      { id: "07", willayaname: "بسكرة" }, { id: "08", willayaname: "بشار" }, { id: "09", willayaname: "البليدة" },
      { id: "10", willayaname: "البويرة" }, { id: "11", willayaname: "تمنراست" }, { id: "12", willayaname: "تبسة" },
      { id: "13", willayaname: "تلمسان" }, { id: "14", willayaname: "تيارت" }, { id: "15", willayaname: "تيزي وزو" },
      { id: "16", willayaname: "الجزائر" }, { id: "17", willayaname: "الجلفة" }, { id: "18", willayaname: "جيجل" },
      { id: "19", willayaname: "سطيف" }, { id: "20", willayaname: "سعيدة" }, { id: "21", willayaname: "سكيكدة" },
      { id: "22", willayaname: "سيدي بلعباس" }, { id: "23", willayaname: "عنابة" }, { id: "24", willayaname: "قالمة" },
      { id: "25", willayaname: "قسنطينة" }, { id: "26", willayaname: "المدية" }, { id: "27", willayaname: "مستغانم" },
      { id: "28", willayaname: "المسيلة" }, { id: "29", willayaname: "معسكر" }, { id: "30", willayaname: "ورقلة" },
      { id: "31", willayaname: "وهران" }, { id: "32", willayaname: "البيض" }, { id: "33", willayaname: "إليزي" },
      { id: "34", willayaname: "برج بوعريريج" }, { id: "35", willayaname: "بومرداس" }, { id: "36", willayaname: "الطارف" },
      { id: "37", willayaname: "تندوف" }, { id: "38", willayaname: "تيسمسيلت" }, { id: "39", willayaname: "الوادي" },
      { id: "40", willayaname: "خنشلة" }, { id: "41", willayaname: "سوق أهراس" }, { id: "42", willayaname: "تيبازة" },
      { id: "43", willayaname: "ميلة" }, { id: "44", willayaname: "عين الدفلى" }, { id: "45", willayaname: "النعامة" },
      { id: "46", willayaname: "عين تموشنت" }, { id: "47", willayaname: "غرداية" }, { id: "48", willayaname: "غليزان" },
      { id: "49", willayaname: "تيميمون" }, { id: "50", willayaname: "برج باجي مختار" }, { id: "51", willayaname: "أولاد جلال" },
      { id: "52", willayaname: "بني عباس" }, { id: "53", willayaname: "عين صالح" }, { id: "54", willayaname: "عين قزام" },
      { id: "55", willayaname: "تقرت" }, { id: "56", willayaname: "جانت" }, { id: "57", willayaname: "المغير" },
      { id: "58", willayaname: "المنيعة" }
    ], { 
      updateOnDuplicate: ["willayaname"] 
    });

    console.log("✅ Static tables seeded/updated successfully.");

    // --- زرع بيانات الـ SuperAdmin ---
    
    const superAdminEmail = "doudi.said47@gmail.com";
    const adminExists = await User.findOne({ where: { role_id: "0" } });

    if (!adminExists) {
      // هام جداً: نرسل الباسورد نص عادي لأن الموديل يحتوي على Hook يقوم بالتشفير
      await User.create({
        username: "Super Admin",
        email: superAdminEmail,
        phone: "0667078106",
        password: "saiddoudi@12345", // نص عادي
        role_id: "0",
        willaya_id: null, 
        provider: "local"
      });
      console.log("✅ SuperAdmin account created and hashed by Hooks.");
    } else {
      // اختياري: تحديث كلمة المرور في حال كنت قد أخطأت في الهاش سابقاً
      // سنستخدم update مع تمرير النص العادي ليفعّل الـ Hook الخاص بالـ beforeUpdate
      adminExists.password = "saiddoudi@12345";
      await adminExists.save(); 
      console.log("ℹ️ SuperAdmin already exists. Password refreshed to ensure correct hashing.");
    }

  } catch (err) {
    console.error("❌ Seeding error details:", err);
  }
}