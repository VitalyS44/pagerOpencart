'use strict';
const fs = require('fs');
const fsDel = require('del');
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const hash = require('gulp-hash-filename');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-babel-minify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// загружаем конфиги
const pathGulp = './_config/';
let pathSrc = './src_view/';
const conf = config(pathGulp, pathSrc);

// Работаем со страницами
gulp.task('build', () => {
  // Чистим билдовую директорию
  fsDel(`${conf.pathView}${conf.page}/*`);
  // Ищем\создаем image
  image();
  // Ищем\создаем style
  style(false);
  // Ищем создаем js
  return script(false);
});

gulp.task('default', () => {
  // Ищем\создаем controller.php
  controller();
  // Ищем\создаем language
  language();
  // Чистим билдовую директорию
  fsDel(`${conf.pathView}${conf.page}/*`);
  // Ищем\создаем image
  image();
  // Ищем\создаем template
  template();
  // Ищем\создаем style
  style();
  // Ищем создаем js
  return script();
});

//Таск для режима разработки
gulp.task('start', () => {
  let config = conf.bsConfig;

  for (const key in config) {
    switch (key) {
      case 'proxy':
        config[key] += `/route=${config.page}`;
        break;
    }
  }

  browserSync.init(config);
  const watcher = gulp.watch(
    `${pathSrc}${conf.dir}${conf.theme}/${conf.page}/**/*`
  );
  for (const operation of ['change', 'add', 'unlink']) {
    watcher.on(operation, (path, status) => {
      crsWatch(operation, path, status);
    });
  }
});

function crsWatch(operation, path, status) {
  let extension = path.replace(/^[\w\\]*/, '');

  switch (extension) {
    case '.js':
      fsDel(`${conf.pathView}${conf.page}/*${extension}`).then(() => {
        script();
      });
      break;
    case '.scss':
      fsDel(`${conf.pathView}${conf.page}/*.css`).then(() => {
        style();
      });
      break;
    case '.twig':
      browserSync.reload();
      break;
    default:
      if (['gif', 'jpg', 'png', 'svg'].indexOf(extension) !== -1) {
        image();
      }
  }
}

function controller() {
  let fileController = `${conf.pathController}${conf.page}.php`;
  createDir(fileController, false);
  if (!fs.existsSync(fileController)) {
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
}

function language() {
  let fileLanguage = `${conf.pathLanguage}${conf.language}/${conf.page}.php`;
  createDir(fileLanguage, false);
  if (!fs.existsSync(fileLanguage)) {
    fs.copyFileSync(`${pathGulp}template/Language.php`, fileLanguage);
  }
}

function template() {
  let fileTemplate = `${pathSrc}${conf.dir}${conf.theme}/${conf.page}/template.twig`;
  createDir(fileTemplate, false);
  if (!fs.existsSync(fileTemplate)) {
    fs.writeFileSync(fileTemplate, '\n');
  }
}

function image() {
  let imagePath = `${pathSrc}${conf.dir}${conf.theme}/${conf.page}/image/`;
  createDir(imagePath);
  gulp
    .src(`${imagePath}*.{gif,jpg,png,svg}`)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest(`${conf.pathView}${conf.page}/image/`))
    .pipe(browserSync.stream());
}

function style(dev = true) {
  let fileStyle = `${pathSrc}${conf.dir}${conf.theme}/${conf.page}/main.scss`;
  createDir(fileStyle, false);
  if (!fs.existsSync(fileStyle)) {
    fs.writeFileSync(fileStyle, '\n');
  }

  const plugins = [autoprefixer(), cssnano()];

  let bufer = gulp.src(fileStyle).pipe(browserSync.stream());
  if (dev) {
    bufer = bufer.pipe(sourcemaps.init());
  }
  bufer = bufer
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(plugins));
  if (dev) {
    bufer = bufer.pipe(sourcemaps.write());
  }
  return bufer
    .pipe(concat('main.css'))
    .pipe(hash())
    .pipe(gulp.dest(`${conf.pathView}${conf.page}`));
}

function script(dev = true) {
  let fileScript = `${pathSrc}${conf.dir}${conf.theme}/${conf.page}/main.js`;
  createDir(fileScript, false);
  if (!fs.existsSync(fileScript)) {
    fs.writeFileSync(fileScript, '\n');
  }
  let bufer = gulp.src(fileScript);
  if (dev) {
    bufer = bufer.pipe(sourcemaps.init());
  }
  bufer = bufer
    .pipe(
      rollup(
        {
          plugins: [babel()],
        },
        {
          format: 'iife',
        }
      )
    )
    .pipe(concat('main.js'));
  if (dev) {
    bufer = bufer
      .pipe(
        minify({
          mangle: {
            keepClassName: true,
          },
        })
      )
      .pipe(sourcemaps.write());
  }
  return bufer
    .pipe(hash())
    .pipe(gulp.dest(`${conf.pathView}${conf.page}`))
    .pipe(browserSync.stream());
}

function createDir(path, lastPath = true) {
  let newDir = '';
  const dirs = path.split('/');
  const dirsLength = dirs.length - 1;
  for (let i in dirs) {
    //  Пропустить последнюю директорию
    if (!lastPath && i == dirsLength) {
      continue;
    }

    if (dirs[i] == '.') {
      newDir += '.';
      continue;
    }

    newDir += '/' + dirs[i];
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
  }
}

function config(pathGulp, pathSrc) {
  // Получаем базовый конфиг
  let config_file = `${pathGulp}config.json`;
  if (!fs.existsSync(config_file)) {
    if (fs.existsSync(`${pathGulp}config_default.json`)) {
      config_file = `${pathGulp}config_default.json`;
    }
  }

  const conf = JSON.parse(fs.readFileSync(config_file));
  // Получаем активный(рабочий) конфиг
  if (!fs.existsSync(`${pathGulp}config_active.json`)) {
    fs.writeFileSync(
      `${pathGulp}config_active.json`,
      JSON.stringify(conf.active)
    );
  }
  conf.active = JSON.parse(
    fs.readFileSync(`${pathGulp}config_active.json`, 'utf-8')
  );
  // Читаем переданные опции на изменение активной конфигурации
  let args = {};
  for (const arg of process.argv) {
    if (arg.slice(0, 2) == '--') {
      let argArr = arg.replace('--', '').split('=');

      // Проверяем правильность написания темы
      if (argArr[0] == 'theme' && argArr[1][0] != '/') {
        argArr[1] = `/${argArr[1]}`;
      }

      args[argArr[0]] = argArr[1];
    }
  }

  for (const arg in args) {
    conf.active[arg] = args[arg];
  }
  // Записываем активную тему для pathView
  if (conf.dir[conf.active.dir].isTheme) {
    conf.dir[conf.active.dir].pathView = conf.dir[
      conf.active.dir
    ].pathView.replace('{theme}', conf.active.theme.slice(1));
  } else {
    conf.active.theme = '/';
  }
  // Записываем новую активную конфигурацию
  console.log(conf.active);
  if (Object.keys(args).length > 0) {
    fs.writeFileSync(
      `${pathGulp}config_active.json`,
      JSON.stringify(conf.active)
    );
  }
  // Создаем базовые директории
  createDir(`${pathSrc}_lib`);
  createDir(`${pathSrc}${conf.active.dir}${conf.active.theme}/_global`);
  return { ...conf.dir[conf.active.dir], ...conf.active };
}
