import puppeteer from 'puppeteer-core';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInspectorPDF = async (inspectorsData) => {
    // تأكد من أن مسار الكروم صحيح على جهازك
    const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    let browser; 

    try {
        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: "shell",
            args: [
                '--no-sandbox', 
                '--disable-gpu', 
                '--single-process',
                '--font-render-hinting=none' // لضمان ظهور الخط العربي بوضوح أصلي
            ]
        });

        const page = await browser.newPage();

        // 1. معالجة اللوغو فقط (تحويله لـ Base64 لضمان ظهوره)
        const logoPath = path.resolve(__dirname, '../public/images/logo.png');
        let logoBase64 = "";
        if (fs.existsSync(logoPath)) {
            logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
        }

        const templatePath = path.resolve(__dirname, '../views/inspectors-pdf.ejs');
        
        // 2. رندر القالب وتمرير البيانات واللوغو
        const html = await ejs.renderFile(templatePath, { 
            inspectors: inspectorsData, 
            date: new Date().toLocaleDateString('ar-DZ'),
            logo: logoBase64
        });

        // 3. تعيين المحتوى والانتظار حتى يستقر المتصفح
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // 4. أهم خطوة: إخبار المتصفح بالانتظار حتى يتم تحميل خطوط النظام بالكامل
        await page.evaluateHandle('document.fonts.ready');

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '25mm', left: '15mm', right: '15mm' },
            displayHeaderFooter: true,
            headerTemplate: '<span></span>',
            footerTemplate: `
                <div style="font-size: 10px; width: 100%; border-top: 1px solid #ccc; padding: 5px 15mm 0; font-family: 'Arial', sans-serif; display: flex; justify-content: space-between; align-items: center; color: #555;" dir="rtl">
                    <div style="font-weight: bold;">وزارة التربية الوطنية - مديرية التربية</div>
                    <div>صفحة <span class="pageNumber"></span> من <span class="totalPages"></span></div>
                </div>`
        });

        return pdf;

    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};