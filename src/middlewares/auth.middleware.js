import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// تحميل إعدادات البيئة
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ميدل وير المصادقة (Authentication)
 * لفحص الهوية والتأكد من وجود توكن صالح
 */
export const authenticate = (req, res, next) => {
    try {
        let token = null;

        // 1. جلب التوكن من الهيدر (المفضل في Axios)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } 
        
        // 2. جلب التوكن من الكوكيز (خيار احتياطي للمتصفح)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً" 
            });
        }

        // 3. التحقق من التوكن
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. تخزين البيانات في req.user لاستخدامها في الخدمات والتحكم
        // نضمن وجود المعرف، الرتبة، والولاية
        req.user = {
            id: decoded.id,
            role_id: decoded.role_id,
            willaya_id: decoded.willaya_id 
        };

        next();

    } catch (error) {
        console.error("❌ [AUTH ERROR]:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً" 
            });
        }

        return res.status(401).json({ 
            success: false, 
            message: "التوكن غير صالح أو انتهت صلاحيته" 
        });
    }
};

/**
 * ميدل وير الصلاحيات (Authorization)
 * يتحقق من رتبة المستخدم (مثلاً: رئيس مصلحة فقط)
 */
export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        // التحقق من وجود المستخدم وبيانات الرتبة
        if (!req.user || !req.user.role_id) {
            return res.status(403).json({ 
                success: false, 
                message: "فشل في التحقق من الصلاحيات" 
            });
        }

        // تحويل الأدوار المسموحة والموجودة لنصوص لضمان مطابقة دقيقة
        const userRoleId = String(req.user.role_id);
        const roles = allowedRoles.map(role => String(role));

        if (!roles.includes(userRoleId)) {
            return res.status(403).json({ 
                success: false, 
                message: "ليس لديك الصلاحيات الكافية للقيام بهذا الإجراء الإداري" 
            });
        }

        next();
    };
};

/**
 * ميدل وير مخصص لرئيس المصلحة فقط
 * كاختصار لعملية الـ Authorize
 */
export const isChefService = (req, res, next) => {
    // افترضنا أن ID رتبة رئيس المصلحة هو 2
    if (req.user && String(req.user.role_id) === "2") {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "هذا الإجراء مخصص لرئيس المصلحة فقط" 
        });
    }
};