const gulp = require('gulp');
const fs = require('fs');
const fsDel = require('del');
const mkdirp = require('mkdirp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const hash = require('gulp-hash-filename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

const style = function () {
  fsDel(`${conf.pathView}${conf.page}/*.css`, conf.delConfig);

  let fileStyle = `${conf.pathSrc}${conf.theme}/${conf.page}/main.scss`;
  if (!fs.existsSync(fileStyle)) {
    mkdirp.sync(fileStyle + '/..');
    fs.writeFileSync(fileStyle, '\n');
  }

  let plugins = [autoprefixer()];
  if (prod) {
    plugins.push(cssnano());
  }

  let bufer = gulp.src(fileStyle).pipe(browserSync.stream());
  if (!prod) {
    bufer = bufer.pipe(sourcemaps.init());
  }
  bufer = bufer
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(plugins));
  if (!prod) {
    bufer = bufer.pipe(sourcemaps.write());
  }
  return bufer
    .pipe(concat('main.css'))
    .pipe(hash())
    .pipe(gulp.dest(`${conf.pathView}${conf.page}`));
};

module.exports = style;
