## Pedro Campelo Portfolio

Static portfolio deployed through Cloudflare Workers static assets.

### Deploy

Use:

```bash
npx wrangler deploy
```

The current Worker config is in `wrangler.jsonc`, with assets served directly from the repository root.



### SEO and platform notes

- `robots.txt`, `sitemap.xml`, `_headers`, and `llms.txt` are part of the production setup.
- `_headers` defines the main security headers and asset cache policy for Cloudflare.
- `.assetsignore` excludes local-only helper files from production deploys.
- If the site moves from `workers.dev` to a custom domain, update canonical URLs, Open Graph URLs, RSS links, and sitemap entries accordingly.
