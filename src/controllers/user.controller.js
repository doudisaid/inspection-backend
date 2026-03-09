import userService from "../services/user.service.js";

class UserController {
// 1. جلب المستخدمين حسب الرتبة مع الفلترة بالولاية
    async getUsersByRole(req, res) {
        try {
            // استخراج roleId من الرابط و willaya_id من الـ Query String
            const { roleId } = req.params;
            const { willaya_id } = req.query; //axios.get('/users/role/2?willaya_id=30')

            // تمرير المعاملين إلى الخدمة
            const users = await userService.getUsersByRole(roleId, willaya_id);
            
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // 2. جلب كل المستخدمين (الدالة التي كانت ناقصة)
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await userService.getAllUsers(page, limit);
            res.status(200).json({ 
                success: true, 
                data: result.users, 
                pagination: result 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "خطأ في جلب المستخدمين" });
        }
    }

    // 3. جلب مستخدم واحد بالـ ID (الدالة التي كانت ناقصة)
async getUser(req, res) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
        }
        // توحيد المفتاح ليكون data بدلاً من user
        res.json({ success: true, data: user }); 
    } catch (error) {
        console.error("Error in getUser:", error.message);
        res.status(500).json({ success: false, message: "خطأ في الخادم" });
    }
}

    // 4. إضافة مستخدم جديد
    async addUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({ success: true, message: "تم الإنشاء بنجاح", user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // 5. تحديث بيانات مستخدم
    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.json({ success: true, message: "تم التحديث بنجاح", user });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // 6. حذف مستخدم
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            res.json({ success: true, message: "تم الحذف بنجاح" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // 7. تسجيل الدخول
    async login(req, res) {
        try {
            const result = await userService.loginUser(req.body.email, req.body.password);
            if (!result) return res.status(401).json({ success: false, message: "البريد أو كلمة المرور غير صحيحة" });
            
            res.cookie("token", result.token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000 
            });

            res.json({ success: true, token: result.token, user: result.user });
        } catch (error) {
            res.status(500).json({ success: false, message: "فشل تسجيل الدخول" });
        }
    }

    // 8. تسجيل الخروج
    async logout(req, res) {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "تم تسجيل الخروج" });
    }
}

export default new UserController();