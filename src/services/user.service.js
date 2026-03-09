import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Willaya from "../models/willaya.model.js";
import jwt from "jsonwebtoken";

class UserService {
    
    // جلب المستخدمين حسب الرتبة مع فلترة اختيارية بالولاية
    async getUsersByRole(roleId, willayaId = null) {
        const whereCondition = { role_id: roleId };

        if (willayaId) {
            whereCondition.willaya_id = willayaId;
        }

        return await User.findAll({
            where: whereCondition,
            attributes: ['id', 'username', 'email', 'phone', 'role_id', 'willaya_id'],
            include: [
                { model: Role },
                { model: Willaya, as: 'willaya', attributes: ['willayaname'] }
            ],
            order: [['username', 'ASC']]
        });
    }

    // جلب كل المستخدمين مع التقسيم لصفحات
    async getAllUsers(page, limit) {
        const offset = (page - 1) * limit;
        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            include: [{ model: Role }, { model: Willaya, as: 'willaya' }],
            order: [['createdAt', 'DESC']]
        });
        return { 
            totalItems: count, 
            users: rows, 
            totalPages: Math.ceil(count / limit), 
            currentPage: page 
        };
    }

    // جلب مستخدم واحد بواسطة المعرف
    async getUserById(id) {
        const user = await User.findByPk(id, { 
            include: [{ model: Role }, { model: Willaya, as: 'willaya' }] 
        });
        if (!user) throw new Error("المستخدم غير موجود");
        return user;
    }

    // إنشاء مستخدم جديد
    async createUser(data) {
        return await User.create({
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role_id: data.role_id,
            willaya_id: data.willaya_id
        });
    }

    // تحديث بيانات المستخدم
    async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) throw new Error("المستخدم غير موجود");
        
        // منع تحديث كلمة المرور إذا كانت فارغة
        if (!data.password || data.password === "") {
            delete data.password;
        }
        
        // تنظيف البيانات من الحقول الزائدة
        if (data.name) delete data.name;

        return await user.update(data);
    }

    // حذف مستخدم
    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) throw new Error("المستخدم غير موجود");
        return await user.destroy();
    }

    // تسجيل الدخول وتوليد التوكن
    async loginUser(email, password) {
        const user = await User.findOne({
            where: { email },
            include: [
                { model: Role, attributes: ['role_name'] },
                { 
                    model: Willaya, 
                    as: 'willaya', 
                    attributes: ['id', 'willayaname'] // جلب الـ id ضروري للمنطق البرمجي
                }
            ]
        });

        // التحقق من كلمة المرور (افترضنا وجود دالة comparePassword في الموديل)
        if (!user || !(await user.comparePassword(password))) return null;

        // ✅ التعديل الجوهري: إضافة willaya_id داخل حمولة التوكن (Payload)
        // هذا هو المفتاح الذي سيعتمد عليه الميدل وير والـ Service لتقييد الصلاحيات الجغرافية
        const token = jwt.sign(
            { 
                id: user.id, 
                role_id: user.role_id,
                willaya_id: user.willaya_id // ضروري جداً لرئيس المصلحة
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );

        return { user, token };
    }
}

export default new UserService();