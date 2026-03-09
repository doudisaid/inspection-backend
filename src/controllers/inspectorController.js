import { generateInspectorPDF } from '../services/reportService.js';
import User from '../models/user.model.js';

/**
 * Controller لتوليد وطباعة تقرير المفتشين
 */
export const printInspectors = async (req, res) => {
    try {
        // 1. جلب البيانات من قاعدة البيانات
        // قمنا باختيار role_id: "2" بناءً على نظام الرتب لديك
        const inspectors = await User.findAll({
            where: {
                role_id: "2" 
            },
            attributes: ['username', 'phone', 'email'], 
            raw: true 
        });

        // 2. التحقق من وجود بيانات
        if (!inspectors || inspectors.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "لم يتم العثور على أي مفتشين في قاعدة البيانات (Role ID: 2)" 
            });
        }

        // 3. تحويل البيانات لتطابق مسميات المتغيرات في قالب الـ EJS
        const formattedData = inspectors.map(ins => ({
            name: ins.username,
            specialty: ins.email, 
            rank: ins.phone || "مفتش"
        }));

        // 4. استدعاء الخدمة لتوليد الـ PDF (Puppeteer)
        const pdfBuffer = await generateInspectorPDF(formattedData);

        // 5. التأكد من أن البيانات هي Buffer وليست مصفوفة أرقام (JSON)
        const finalBuffer = Buffer.from(pdfBuffer);

        // 6. إعداد رؤوس الاستجابة لإجبار المتصفح على عرض PDF
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=inspectors_report.pdf',
            'Content-Length': finalBuffer.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        // 7. إرسال الملف النهائي وإغلاق الاستجابة
        return res.end(finalBuffer);

    } catch (error) {
        // طباعة الخطأ في الـ Terminal للمطور
        console.error("Critical PDF Generation Error:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        // إرسال رد JSON في حال الفشل لكي لا يظهر "فشل تحميل المستند"
        // نغير الـ Content-Type هنا إلى JSON يدوياً
        if (!res.headersSent) {
            res.status(500).setHeader('Content-Type', 'application/json');
            return res.json({ 
                success: false, 
                message: "حدث خطأ أثناء معالجة طلب التقرير",
                error: error.message 
            });
        }
    }
};