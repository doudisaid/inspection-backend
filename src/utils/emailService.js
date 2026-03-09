import "dotenv/config";
import nodemailer from "nodemailer";

/**
 * إنشاء transporter لإرسال البريد الإلكتروني
 */
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS   // ✅ موحّد
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};


/**
 * إرسال بريد إلكتروني
 * @param {Object} options - خيارات البريد الإلكتروني
 * @param {string|string[]} options.to - المستلم/المستلمين
 * @param {string} options.subject - موضوع البريد
 * @param {string} options.text - نص البريد (بدون تنسيق)
 * @param {string} options.html - نص البريد (بتنسيق HTML)
 * @param {string} options.from - المرسل (اختياري)
 * @returns {Promise<Object>} نتيجة الإرسال
 */
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || `"${process.env.APP_NAME || 'التطبيق'}" <noreply@example.com>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text || options.html?.replace(/<[^>]*>/g, '') || '',
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);

    // في وضع التطوير، اعرض رابط المعاينة
    if (process.env.NODE_ENV === 'development') {
      console.log('=========================================');
      console.log('📧 Email sent successfully!');
      console.log(`📤 From: ${mailOptions.from}`);
      console.log(`📥 To: ${mailOptions.to}`);
      console.log(`📝 Subject: ${mailOptions.subject}`);
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log('=========================================');
    } else {
      console.log(`📧 Email sent to ${mailOptions.to}: ${info.messageId}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      info: info
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`فشل إرسال البريد الإلكتروني: ${error.message}`);
  }
};

/**
 * إرسال بريد اختبار للتأكد من عمل الخدمة
 */
export const testEmailService = async () => {
  try {
    console.log('🔄 Testing email service...');

    const testEmail = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from Node.js',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working.</p>'
    });

    console.log('✅ Email service is working correctly!');
    return testEmail;

  } catch (error) {
    console.error('❌ Email service test failed:', error);
    throw error;
  }
};

/**
 * قالب بريد إعادة تعيين كلمة المرور
 */
export const sendPasswordResetEmail = async (email, resetToken, userName = '') => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const emailContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إعادة تعيين كلمة المرور</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: white;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 30px;
              }
              .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-decoration: none;
                  padding: 12px 30px;
                  border-radius: 25px;
                  font-weight: bold;
                  margin: 20px 0;
                  text-align: center;
              }
              .footer {
                  background: #f8f9fa;
                  padding: 20px;
                  text-align: center;
                  color: #666;
                  font-size: 12px;
                  border-top: 1px solid #eee;
              }
              .warning {
                  background: #fff3cd;
                  border: 1px solid #ffeaa7;
                  border-radius: 5px;
                  padding: 10px;
                  margin: 20px 0;
                  color: #856404;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${process.env.APP_NAME || 'تطبيقنا'}</h1>
                  <p>إعادة تعيين كلمة المرور</p>
              </div>
              
              <div class="content">
                  <h2>مرحباً ${userName || 'عزيزي المستخدم'}</h2>
                  
                  <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك المرتبط بالبريد الإلكتروني: <strong>${email}</strong></p>
                  
                  <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
                  
                  <div style="text-align: center;">
                      <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
                  </div>
                  
                  <p>إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
                  
                  <div class="warning">
                      <strong>⚠️ ملاحظة مهمة:</strong>
                      <p>ينتهي صلاحية هذا الرابط خلال ساعة واحدة.</p>
                      <p>إذا انتهت صلاحية الرابط، يمكنك طلب رابط جديد من صفحة تسجيل الدخول.</p>
                  </div>
                  
                  <p>إذا واجهت أي مشكلة، يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
                  <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;">
                      ${resetLink}
                  </p>
              </div>
              
              <div class="footer">
                  <p>هذا البريد الإلكتروني تم إنشاؤه تلقائياً، الرجاء عدم الرد عليه.</p>
                  <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'تطبيقنا'}. جميع الحقوق محفوظة.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to: email,
      subject: `${process.env.APP_NAME || 'تطبيقنا'} - إعادة تعيين كلمة المرور`,
      html: emailContent
    });

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

/**
 * قالب بريد تأكيد تغيير كلمة المرور
 */
export const sendPasswordChangedEmail = async (email, userName = '') => {
  try {
    const emailContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تم تغيير كلمة المرور</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="margin: 0;">${process.env.APP_NAME || 'تطبيقنا'}</h1>
                  <p>تأكيد تغيير كلمة المرور</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                  <h2>مرحباً ${userName || 'عزيزي المستخدم'}</h2>
                  
                  <p>نود إعلامك بأن كلمة مرور حسابك المرتبط بالبريد الإلكتروني <strong>${email}</strong> قد تم تغييرها بنجاح.</p>
                  
                  <div style="background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 5px; padding: 15px; margin: 20px 0;">
                      <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                          ✅ تم تغيير كلمة المرور بنجاح في ${new Date().toLocaleString('ar-SA')}
                      </p>
                  </div>
                  
                  <p><strong>إذا كنت أنت من قمت بتغيير كلمة المرور:</strong></p>
                  <p>يمكنك تجاهل هذا البريد. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
                  
                  <p><strong>إذا لم تقم بتغيير كلمة المرور:</strong></p>
                  <p>يجب عليك الاتصال بفريق الدعم الفني فوراً على:</p>
                  <p style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 10px; color: #856404;">
                      ${process.env.SUPPORT_EMAIL || 'support@example.com'}
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                      <p>هذا البريد الإلكتروني تم إنشاؤه تلقائياً لأغراض أمنية.</p>
                      <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'تطبيقنا'}</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    return await sendEmail({
      to: email,
      subject: `${process.env.APP_NAME || 'تطبيقنا'} - تم تغيير كلمة المرور`,
      html: emailContent
    });

  } catch (error) {
    console.error('❌ Error sending password changed email:', error);
    throw error;
  }
};

/**
 * قالب بريد ترحيبي
 */
export const sendWelcomeEmail = async (email, userName = '') => {
  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">مرحباً ${userName || 'عزيزي المستخدم'}</h2>
        <p>أهلاً بك في ${process.env.APP_NAME || 'تطبيقنا'}!</p>
        <p>نشكرك على تسجيلك معنا. نحن سعداء بانضمامك إلى مجتمعنا.</p>
      </div>
    `;

    return await sendEmail({
      to: email,
      subject: `مرحباً بك في ${process.env.APP_NAME || 'تطبيقنا'}`,
      html: emailContent
    });

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

export default {
  sendEmail,
  testEmailService,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail
};