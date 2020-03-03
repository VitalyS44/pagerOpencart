const fs = require("fs");
const mkdirp = require("mkdirp");

const config = function() {
  // Получаем базовый конфиг
  let config_file = `${pathGulp}config.json`;
  if (!fs.existsSync(config_file)) {
    if (fs.existsSync(`${pathGulp}config_default.json`)) {
      config_file = `${pathGulp}config_default.json`;
    } else {
      throw "Не найден базовый файл конфигурации.";
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
    fs.readFileSync(`${pathGulp}config_active.json`, "utf-8")
  );
  // Читаем переданные опции на изменение активной конфигурации
  let args = {};

  for (const arg of process.argv) {
    if (arg.slice(0, 2) == "--") {
      let argArr = arg.replace("--", "").split("=");

      args[argArr[0]] = argArr[1] || "";
    }
  }

  for (const arg in args) {
    if (arg == "theme") {
      if (args[arg].length > 0 && args[arg][0] != "/") {
        args[arg] = `/${args[arg]}`;
      }
    }

    conf.active[arg] = args[arg];
  }
  // Записываем активную тему для pathView
  if (conf.dir[conf.active.dir].isTheme) {
    conf.dir[conf.active.dir].pathView = conf.dir[
      conf.active.dir
    ].pathView.replace("{theme}", conf.active.theme.slice(1));
  } else {
    conf.active.theme = "/";
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
  mkdirp.sync(`${conf.pathSrc}_lib`);
  mkdirp.sync(`${conf.pathSrc}${conf.active.dir}${conf.active.theme}/_global`);

  return {
    ...conf.active,
    ...conf.dir[conf.active.dir],
    pathSrc: conf.pathSrc,
    bsConfig: Object.assign(
      conf.bsConfig,
      conf.dir[conf.active.dir].bsConfig || {}
    ),
    delConfig: conf.delConfig
  };
};

module.exports = config;
