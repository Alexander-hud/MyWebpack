Инструкция какие файлы откуда берутся и куда складываются!

PUG берем файлы из src/pug/pages и отправляем в ../dist
1. const PATHS = {
    src:path.join(__dirname, './src'), Ищем файлы в данной папке
    dist: path.join(__dirname, './dist'), Обработанные файлы складываем в dist
    assets: 'assets/' А это еще хз для чего нужно уточнить**
}
2. const PAGES_DIR = `${PATHS.src}/pug/pages` указываем точное расположение файлов откуда берем .pug
3. ...PAGES.map(page => new HTMLWebpackPlugin({ Вызываем плагин
            template: `${PAGES_DIR}/${page}`,Вызываем переменную
            filename: `./${page.replace(/\.pug/,'.html')}`Обрабатываем файлы из .pug в html
          }))
4. Прописываем модули
 {
                test: /\.pug$/,
                loader: 'pug-loader'
            }
5. Прописываем переменные 
const fs =require('fs') 
const path = require('path')
6. Разрешаем работать node.js c файлами в вебпаке
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'))
SASS
файлы берутся из дериктории './style/sass.sass' в dist
 1. качаем sass
 2. Импортируем в index.js 
 import './style/sass.sass' откуда берутся файлы
 3. прописываем модуль   {
                test: /\.sass$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll:true
                    },
                    }, 'css-loader',
                       'sass-loader'
                ]
            },
В конфиге