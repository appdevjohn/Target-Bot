# Target Product Bot

Testing out Puppeteer in the context of watching when a product goes back in stock on Target's website. The product page is reloaded every ten seconds, and when the 'Add to Cart' button appears, a Chromium window will open, it will add the product to the cart, it will navigate to the cart page, and then it will fill login credentials to start the checkout process.

#### Usage
This is a typescript app; you must have typescript installed on your computer for it to compile. Simply run `npm i` then `npm start` in the terminal.

#### Known Issues
The function determining whether or not the product is in stock does not work. This script is subject to break whenever Target changes their website.

#### Environment Variables
These variables are required to be set for this to work.
```
SENDGRID_API_KEY=qwertyasdfjkl
SENDGRID_FROM_URL=noreply@yourdomain.com

PRODUCT_URL=https://www.target.com/p/hot-product/

RECIPIENT_EMAIL=you@email.com
RECIPIENT_NAME=Your_Name

TARGET_USERNAME=target.account.email@yourdomain.com
TARGET_PASSWORD=your-target-password
```