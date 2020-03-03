const fs = require('fs');
const fsDel = require('del');
const path = require('path');

const delPager = function(cb) {
  if (process.argv.indexOf('-src') !== -1) {
    fsDel.sync(`${conf.pathController}${conf.page}.php`, conf.delConfig);
    fsDel.sync(
      `${conf.pathLanguage}${conf.language}/${conf.page}.php`,
      conf.delConfig
    );
    fsDel.sync(
      `${conf.pathSrc}${conf.dir}${conf.theme}/${conf.page}/template.twig`,
      conf.delConfig
    );
    fsDel.sync(
      `${conf.pathSrc}${conf.dir}${conf.theme}/${conf.page}`,
      conf.delConfig
    );
  }

  fsDel.sync(`${conf.pathView}${conf.page}`, conf.delConfig);

  // Очистка пустых папок
  let dirs = [
    `${conf.pathController}${conf.page}`,
    `${conf.pathLanguage}${conf.language}/${conf.page}`,
    `${conf.pathView}${conf.page}`,
    `${conf.pathSrc}${conf.dir}${conf.theme}/${conf.page}`,
    `${conf.pathSrc}${conf.dir}${conf.theme}/_global`,
    `${conf.pathSrc}_lib`,
  ];

  return new Promise(function(resolve, reject) {
    dirEmptyDel(dirs);
    resolve();
  });
};

async function dirEmptyDel(dirs, recursive = true) {
  for (let dir of dirs) {
    dir = path.resolve(__dirname, dir);

    if (fs.existsSync(dir)) {
      let files = fs.readdirSync(dir);

      if (files.length == 0) {
        fsDel.sync(dir, conf.delConfig);

        if (recursive) {
          dirEmptyDel([path.resolve(dir + '/..')], recursive);
        }
      }
    } else {
      if (recursive) {
        dirEmptyDel([path.resolve(dir + '/..')], recursive);
      }
    }
  }
}

module.exports = delPager;
