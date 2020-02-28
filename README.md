# TODO List

## Команды

`gulp [--option=value]`

`gulp start` - запустить страницу в режиме разработки

`gulp build` - собрать активную страницу

`gulp del` - удалить билды активной страницы (**опция -src уадаляет исходные файлы**)

**Example:** `gulp --page=common/home --language=en-en --dir=admin`

## Опции

Передаваемые опции соответствуют объекту **active** в конфигурационном файле


## Файл конфигурации (__config/config_default.json)

Для изменения конфигурационных файлов, можно создать файл **config.json** на основе **config_default.json**

```{
      "dir": { \\ Проекты
        "catalog": { \\ Проект
          "pathController": "./public/catalog/controller/", \\ (string)Путь до контроллеров
          "pathLanguage": "./public/catalog/language/", \\ (string) Путь до языковых файлов
          "pathView": "./public/catalog/view/theme/{theme}/", \\ (string) Путь до шаблонов отображения
          "isTheme": true \\ (bool) Использовать папку тем,
          "bsConfig": {} \\ (object) Конфигурация модуля browserSync
        },
      },
      "active": { \\ Активные настройки
        "dir": "catalog", \\ (string) Активный проект
        "page": "common/home", \\ (string) Создаваемая страница
        "language": "ru-ru", \\ (string) Активный язык
        "theme": "default" \\ (string) Папка темы
      },
      "pathSrc": "./src_view/", \\ Путь хранения сходников
      "bsConfig": {} \\ Базовая конфигурация модуля browserSync
    }
```
