# TODO List

## Команды

`gulp start` - Запуск активной страницы в режиме разработки

`gulp build` - Сборка активной страницы

`gulp del` - Удаление активной страницы (** опция -src удаляет исходники**)

`gulp pages` - Сборка всех страниц текущего проекта, темы и языка

`gulp [--option=value]`

**Example:** `gulp --page=common/home --language=en-en --dir=admin`

## Опции

Передаваемые --опции соответствуют объекту **active** в конфигурационном файле

## Файл конфигурации (\_\_config/config_default.json)

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
