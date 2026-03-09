import "dotenv/config";                 // 1️⃣ أولًا حمّل .env
import { sendEmail } from "../services/emailService.js"; // 2️⃣ ثم استعمل الإيميل



sendEmail({
  to: "doudi.said47@gmail.com",
  subject: "Test Email",
  text: "إذا وصلتك هذه الرسالة فالإعدادات صحيحة ✅",
})
  .then(() => console.log("تم الإرسال بنجاح"))
  .catch(err => console.error("فشل الإرسال:", err));
