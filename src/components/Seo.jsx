import { Helmet } from 'react-helmet-async'

const BASE = 'https://xlive-pro.com'

/*
 * Per-route SEO: title, description, canonical + Open Graph / Twitter.
 * Site-wide Organization/LocalBusiness JSON-LD lives in index.html.
 */
export default function Seo({ title, description, path = '/', image = '/images/hero-poster.jpg' }) {
  const url = BASE + path
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={BASE + image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={BASE + image} />
    </Helmet>
  )
}
