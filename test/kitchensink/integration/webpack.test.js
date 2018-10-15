const puppeteer = require('puppeteer');

jest.setTimeout(999999);

describe('something', () => {
  it('should', async () => {
    const browser = await puppeteer.launch({ devtools: true });

    const page = await browser.newPage();

    page.goto('http://localhost:3000');

    await new Promise(resolve => {});
  });
});
