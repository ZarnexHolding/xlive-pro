/*
 * Static prerender entry (build-time only; see scripts/prerender.mjs).
 *
 * Two passes per route: `prerender` first, which waits for the lazy route
 * chunks to load (it is discarded), then a synchronous `renderToString`, which
 * now finds every lazy component resolved and emits the page inline with no
 * deferred Suspense segments, so the HTML is complete without JavaScript.
 *
 * React 19 hoists the <title>/<meta>/<link> tags from the Seo component to the
 * very start of the output; the prerender script moves that run into <head>.
 */
import { renderToString } from 'react-dom/server'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { projects } from './data/projects'

export const routes = ['/', '/work', ...projects.map((p) => `/work/${p.slug}`), '/partners', '/about']

const HEAD_RUN = /^(?:<(?:title|meta|link)\b[^>]*>(?:[^<]*<\/title>)?)+/

export async function render(url) {
  const tree = (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  await prerender(tree) // warm lazy chunks
  let html = renderToString(tree)
  let head = ''
  const m = HEAD_RUN.exec(html)
  if (m) {
    head = m[0]
    html = html.slice(head.length)
  }
  return { html, head }
}
