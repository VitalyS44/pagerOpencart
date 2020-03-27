const gulp = require('gulp');
const fs = require('fs');
const fsDel = require('del');
const mkdirp = require('mkdirp');
const concat = require('gulp-concat');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const hash = require('gulp-hash-filename');
const minify = require('gulp-babel-minify');
const sourcemaps = require('gulp-sourcemaps');

const script = function() {
  fsDel(`${conf.pathView}${conf.page}/*.js`, conf.delConfig);

  let fileScript = `${conf.pathSrc}${conf.theme}/${conf.page}/main.js`;
  if (!fs.existsSync(fileScript)) {
    mkdirp.sync(fileScript + '/..');
    fs.writeFileSync(fileScript, '\n');
  }
  let bufer = gulp.src(fileScript);
  if (!prod) {
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
  if (!prod) {
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
};

module.exports = script;
