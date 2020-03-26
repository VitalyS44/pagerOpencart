const nodeWatch = require('node-watch');
const path = require('path');

const image = require('./image');
const style = require('./style');
const script = require('./script');

const watch = function() {
  let config = conf.bsConfig;

  for (const key in config) {
    switch (key) {
      case 'proxy':
        config[key] += `/index.php?route=${conf.page}`;
        break;
    }
  }

  browserSync.init(config);
  const watcher = nodeWatch(
    `${conf.pathSrc}${conf.theme}/${conf.page}`,
    { delay: 500, recursive: true },
    (evt, name) => {
      let ext = path.extname(name);

      switch (ext) {
        case '.js':
          script();
          break;
        case '.scss':
          style();
          break;
        case '.twig':
          browserSync.reload();
          break;
        default:
          if (['gif', 'jpg', 'png', 'svg'].indexOf(ext) !== -1) {
            image();
          }
      }
    }
  );
};

module.exports = watch;
