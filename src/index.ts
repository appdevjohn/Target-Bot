import path from 'path';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import sendEmail from './mail';

const productURL: string = process.env.PRODUCT_URL!;

const initBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(productURL);
    return page;
}

const checkInStock = async (page: puppeteer.Page) => {
    await page.reload();
    await page.waitForTimeout(8000);
    const soldOut = await page.$('div[data-test="soldOutBlock"]');

    return soldOut === null;
}

const addToCart = async (page: puppeteer.Page) => {
    const addToCartButton = await Promise.race([
        page.waitForSelector('button[data-test="shipItButton"]'),
        page.waitForSelector('button[data-test="orderPickupButton"]')
    ])
    await page.click(addToCartButton?._remoteObject.description!);
    await page.waitForTimeout(2000);
    
    await page.goto('https://www.target.com/cart');

    const checkOutButton = await page.waitForSelector('button[data-test="checkout-button"]')
    await page.click(checkOutButton?._remoteObject.description!);
    await page.waitForTimeout(2000);

    await page.type('#username', process.env.TARGET_USERNAME!);
    await page.type('#password', process.env.TARGET_PASSWORD!);
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'example.png' });
}

const execute = async () => {
    const page = await initBrowser();

    const interval = setInterval(async () => {
        const inStock = await checkInStock(page);
        console.log(inStock ? 'In Stock' : 'Sold Out');

        if (inStock) {
            clearInterval(interval);
            sendEmail(process.env.RECIPIENT_EMAIL, process.env.RECIPIENT_NAME, 'Nintendo Switch OLED is in stock!', 'The OLED Switch is in Stock!  ' + productURL);
            await addToCart(page);
        }

    }, 1000 * 10);
}

execute();