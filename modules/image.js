const gulp = require('gulp');
const mkdirp = require('mkdirp');
const imagemin = require('gulp-imagemin');

const image = function() {
  let imagePath = `${conf.pathSrc}${conf.dir}${conf.theme}/${conf.page}/image/`;
  mkdirp.sync(imagePath);
  return gulp
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
};

module.exports = image;
