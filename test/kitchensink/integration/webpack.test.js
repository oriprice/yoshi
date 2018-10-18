const http = require('http');

const request = url => {
  return new Promise(resolve => {
    http.get(url, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => resolve(rawData.replace(/\s/g, '')));
    });
  });
};

const matchCSS = async (page, regexes) => {
  const url = await page.$$eval('link', links => {
    let href = '';

    for (const link of links) {
      if (link.rel === 'stylesheet') {
        href = link.href;
      }
    }

    return href;
    // return fetch(href)
    //   .then(response => response.text())
    //   .then(text => text.replace(/\s/g, ''));
  });

  const style = await request(url);

  for (const regex of regexes) {
    expect(style).toMatch(regex);
  }
};

const initTest = async feature => {
  await page.goto(`http://localhost:3000#${feature}`);
  await page.reload();
};

describe('Integration', () => {
  describe('Webpack plugins', () => {
    it('css inclusion', async () => {
      await initTest('css-inclusion');

      const className = await page.$eval('#feature-css-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS(page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('global css inclusion', async () => {
      await initTest('global-css-inclusion');

      await matchCSS(page, [
        /\.globalCssModulesInclusion\{background:.+;color:.+}/,
      ]);
    });

    it('json inclusion', async () => {
      await initTest('json-inclusion');

      const result = await page.$eval(
        '#feature-json-inclusion',
        elm => elm.textContent,
      );

      expect(result).toBe('This is an abstract.');
    });
  });
});
