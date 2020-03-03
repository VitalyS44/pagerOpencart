const fs = require('fs');
const path = require('path');
const { series, parallel } = require('gulp');

const contrPager = require('./controller');
const langPager = require('./language');
const templatePager = require('./template');
const image = require('./image');
const style = require('./style');
const script = require('./script');

const pages = function(cb) {
  const baseDir = `${conf.pathSrc}${conf.dir}${conf.theme}`;
  const pages = getPages(baseDir, []);

  for (page of pages) {
    conf.page = page;
    console.log(page);

    (() => {
      contrPager(() => {});
      langPager(() => {});
      templatePager(() => {});

      image(() => {});
      style(() => {});
      script(() => {});
    })();
  }

  return new Promise((resolve, reject) => {
    resolve();
  });
};

function getPages(dir, result) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file[0] === '_') {
      continue;
    }

    if (path.extname(file) == '.twig') {
      result.push(
        dir
          .replace(`${conf.pathSrc}${conf.dir}/`, '')
          .replace(`${conf.theme}`.replace('/', ''), '')
      );
      break;
    }

    if (fs.lstatSync(`${dir}/${file}`).isDirectory()) {
      getPages(`${dir}/${file}`, result);
    }
  }

  return result;
}

module.exports = pages;
