## Pedro Campelo Portfolio

Static portfolio and blog deployed through Cloudflare Workers static assets.

### Deploy

Use:

```bash
npx wrangler deploy
```

The current Worker config is in `wrangler.jsonc`, with assets served directly from the repository root.

### Blog structure

The blog is intentionally organized as separate pages instead of one large HTML file.

- Blog landing page: `/blog/index.html`
- RSS feed: `/blog/feed.xml`
- Post template: `/blog/_template-post.html`
- Published post example: `/blog/posts/estrategia-empirica/index.html`

Each post should live in its own folder under `blog/posts/<slug>/index.html`.

### How to publish a new post

1. Create a new folder inside `blog/posts/` using the slug of the article.
2. Copy `/blog/_template-post.html` into that folder as `index.html`.
3. Replace all `{{TOKENS}}` in the copied file.
4. Create or reuse an Open Graph image under `/assets/`.
5. Add the new post card to `/blog/index.html`.
6. Add a new `<item>` to `/blog/feed.xml`.
7. Add the new URL to `/sitemap.xml`.
8. Commit and push to GitHub so Cloudflare deploys automatically.
9. Or, locally:
  - Process all new posts at once
python post_publisher.py

    - Process a specific folder
python post_publisher.py "CadÚnico"

    - Overwrite post that already exists
python post_publisher.py "CadÚnico" --force

### SEO and platform notes

- `robots.txt`, `sitemap.xml`, `_headers`, and `llms.txt` are part of the production setup.
- `_headers` defines the main security headers and asset cache policy for Cloudflare.
- `.assetsignore` excludes local-only helper files from production deploys.
- If the site moves from `workers.dev` to a custom domain, update canonical URLs, Open Graph URLs, RSS links, and sitemap entries accordingly.
