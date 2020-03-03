'use strict';
const { series, parallel } = require('gulp');
global.browserSync = require('browser-sync').create();

// Модуль подгрузки файлов конфигурации
const configPager = require('./modules/config');
const contrPager = require('./modules/controller');
const langPager = require('./modules/language');
const templatePager = require('./modules/template');
const image = require('./modules/image');
const style = require('./modules/style');
const script = require('./modules/script');
const watch = require('./modules/watch');
const delPager = require('./modules/delete');
const pages = require('./modules/pages');

// Путь до конфигурационных файлов
global.pathGulp = './_config/';
// Запуск в продуктовом режиме
global.prod = process.argv.indexOf('-prod') === '-1' ? false : true;
// Загружаем конфиги
global.conf = configPager();

// Удаление актовной страницы
exports.del = delPager;
// Сборка страницы
exports.build = parallel(image, style, script);
// Режим разработки
exports.start = watch;
// Сборка всех страниц текущей директории, темы и языка
exports.pages = pages;
// Создание страницы
exports.default = series(
  parallel(contrPager, langPager, templatePager),
  parallel(image, style, script)
);
