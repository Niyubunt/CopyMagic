const puppeteer = require('puppeteer');

exports.handler = async (event) => {
    const { url } = JSON.parse(event.body);
    
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Remove scripts e trackers
        await page.evaluate(() => {
            document.querySelectorAll('script, iframe, noscript').forEach(el => el.remove());
        });
        
        const html = await page.content();
        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true,
                html: html,
                newUrl: `https://${process.env.URL}/cloned-${Math.random().toString(36).substring(7)}`
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false,
                error: "Erro ao clonar. A página pode ter proteção contra cópia."
            }),
        };
    }
};
