import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// --- المسارات العامة (Public Routes) ---
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// --- المسارات المحمية (Protected Routes) ---

// 1. جلب حسب الرتبة 
// (تأكد أن الدالة في الكنترولر اسمها getUsersByRole)
router.get("/role/:roleId", authenticate, userController.getUsersByRole);

// 2. جلب كل المستخدمين 
// (تأكد أن الدالة في الكنترولر اسمها getUsers وليس getAllUsers)
router.get("/", authenticate, userController.getUsers);

// 3. إنشاء مستخدم جديد 
// (تأكد أن الدالة في الكنترولر اسمها addUser وليس createUser)
router.post("/", authenticate, userController.addUser);

// 4. جلب مستخدم معين بالـ ID 
// (تأكد أن الدالة في الكنترولر اسمها getUser وليس getUserById)
router.get("/:id", authenticate, userController.getUser);

// 5. تحديث بيانات مستخدم
router.put("/:id", authenticate, userController.updateUser);

// 6. حذف مستخدم
router.delete("/:id", authenticate, userController.deleteUser);

export default router;