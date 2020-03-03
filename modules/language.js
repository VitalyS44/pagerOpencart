const fs = require('fs');
const mkdirp = require('mkdirp');

const language = function(cb) {
  let fileLanguage = `${conf.pathLanguage}${conf.language}/${conf.page}.php`;
  if (!fs.existsSync(fileLanguage)) {
    mkdirp.sync(fileLanguage + '/../');
    fs.copyFileSync(`${pathGulp}template/language.php`, fileLanguage);
  }
  
  cb();
};

module.exports = language;
