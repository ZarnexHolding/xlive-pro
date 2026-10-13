/*
 * Prerender every public route to static HTML after `vite build`.
 *
 *   dist/index.html, and for every other route both <route>.html (served at
 *   the clean URL by Vercel's cleanUrls) and <route>/index.html (directory
 *   index, so the trailing-slash form and plain static hosts work too).
 *
 * Why: the site is a React SPA. Without this, crawlers and first paint both
 * wait for ~150 KB of JavaScript before any content exists. With it, every
 * route ships as complete HTML (title, description, canonical, Open Graph,
 * headings, copy, images) and React hydrates on top. Vercel serves the static
 * file when one matches the path and falls back to the SPA rewrite otherwise.
 *
 * Runs `vite build --ssr` into a temporary dist/server, uses it, removes it.
 */
import { build } from 'vite'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(dist, 'server')

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.jsx', outDir: serverDir, emptyOutDir: true, copyPublicDir: false },
})

const { render, routes } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')

for (const route of routes) {
  const { html, head } = await render(route)
  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (head) {
    page = page.replace(/\s*<title>[\s\S]*?<\/title>/, '')
    page = page.replace('</head>', `    ${head}\n  </head>`)
  }
  const files =
    route === '/' ? [join(dist, 'index.html')] : [join(dist, `${route.slice(1)}.html`), join(dist, route.slice(1), 'index.html')]
  for (const file of files) {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, page)
  }
  console.log(`prerendered ${route} (${(page.length / 1024).toFixed(1)} kB)`)
}

await rm(serverDir, { recursive: true, force: true })
