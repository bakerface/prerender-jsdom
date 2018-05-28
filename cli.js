#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const Prerenderer = require('@prerenderer/prerenderer');
const Renderer = require('@prerenderer/renderer-jsdom');

const createDir = util.promisify(mkdirp);
const writeFile = util.promisify(fs.writeFile);
const staticDir = path.resolve(process.argv[2]);
const routes = process.argv.slice(3);

const prerenderer = new Prerenderer({
  staticDir,
  renderer: new Renderer({
    renderAfterElementExists: '#app',
  }),
});

async function save(rendered) {
  const dir = path.join(staticDir, rendered.route);
  const file = path.join(dir, 'index.html');

  await createDir(dir);
  await writeFile(file, rendered.html.trim());
}

async function prerender() {
  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(routes);
  await Promise.all(rendered.map(save));
}

prerender().then(() => process.exit());
