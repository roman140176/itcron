import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path';
import fs from 'fs';
import pug from 'pug';
import { log } from 'console';

// Функция для компиляции Pug в HTML
function compilePugPages() {
  const pagesDir = path.resolve(__dirname, 'src/pug/pages');
  const files = fs.readdirSync(pagesDir);
  
  const input = {};

  files.forEach(file => {
    if (file.endsWith('.pug')) {
      const html = pug.renderFile(path.join(pagesDir, file), {
        pretty: true,
        basedir: path.resolve(__dirname, 'src/pug')
      });
      
      const name = file.replace('.pug', '');
      const htmlPath = path.resolve(__dirname, `src/${name}.html`);
      fs.writeFileSync(htmlPath, html);
      input[name] = htmlPath;
    }
  });

  return input;
}

// Плагин автоматического пересбора при изменении Pug
function pugHotReloadPlugin() {
  return {
    name: 'vite-pug-hot-reload',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.pug')) {
        compilePugPages();
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory()
  } catch (error) {
    console.log(error)
    return false
  }
}
function getCopyTargets() {
  const targets = []
  const assetsPath = path.resolve(__dirname, 'src/assets')

  if (directoryExists(path.join(assetsPath, 'images'))) {
    targets.push({
      src: path.resolve(__dirname, 'src/assets/images/**/*'),
      dest: 'assets/images'
    })
  }

  // Добавляем fonts если директория существует
  if (directoryExists(path.join(assetsPath, 'fonts'))) {
    targets.push({
      src: path.resolve(__dirname, 'src/assets/fonts/**/*'),
      dest: 'assets/fonts'
    })
  }
  return targets
}

function moveScriptsToBody() {
  return {
    name: 'move-scripts-to-body',
    transformIndexHtml(html) {
      const moduleScripts = html.match(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g) || [];

      // Фильтруем скрипты: НЕ перемещать если src содержит 'api-maps.yandex'
      const scriptsToMove = moduleScripts.filter(script => {
        return !script.includes('api-maps.yandex');
      });

      let newHtml = html;

      // Убираем только те скрипты, которые будем переносить
      scriptsToMove.forEach(script => {
        newHtml = newHtml.replace(script, '');
      });

      return newHtml.replace(
        '</body>',
        scriptsToMove.join('\n') + '</body>'
      );
    }
  }
}


export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: compilePugPages(),
    },
  },
  plugins: [
    moveScriptsToBody(),
    pugHotReloadPlugin(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, 'src/assets/svg')],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
      svgoOptions: {
        plugins: [
          {
            name: 'removeDimensions',
            active: false, // 👈 сохраняем width/height
          },
          {
            name: 'removeViewBox',
            active: false, // 👈 если хочешь сохранить viewBox (по желанию)
          }
        ]
      }
    }),
    viteStaticCopy({
      targets: getCopyTargets()
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, 'src/styles')],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
