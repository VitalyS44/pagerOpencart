const fs = require('fs');
const mkdirp = require('mkdirp');

const controller = function(cb) {
  
  let fileController = `${conf.pathController}${conf.page}.php`;
  if (!fs.existsSync(fileController)) {
    mkdirp.sync(fileController + '/../', false);
    const currentControllerName = conf.page
      .split('/')
      .map(part => {
        return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
      })
      .join('');

    let content = fs
      .readFileSync(`${pathGulp}template/controller.php`, 'utf8')
      .replace(/__Class/, currentControllerName)
      .replace(/__File/g, conf.page);

    fs.writeFileSync(fileController, content);
  }

  cb();
};

module.exports = controller;
