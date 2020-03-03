const fs = require('fs');
const mkdirp = require('mkdirp');

const template = function(cb) {
  let fileTemplate = `${conf.pathSrc}${conf.dir}${conf.theme}/${conf.page}/template.twig`;
  if (!fs.existsSync(fileTemplate)) {
    mkdirp.sync(fileTemplate + '/..');
    fs.writeFileSync(fileTemplate, '\n');
  }

  cb();
};

module.exports = template;
