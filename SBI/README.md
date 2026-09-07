# National Mobile Apple Store — GitHub + Cloudflare Admin System

This package contains the complete website + Admin Panel + Cloudflare Worker connection.

## Folder structure
- `index.html` — public Apple Store page
- `data/products.json` — products, stock, WhatsApp and social links
- `assets/products.js` — loads products and social data into the website
- `admin/index.html` — separate Admin Panel
- `admin/admin.js` — Add/Edit/Delete/Stock + GitHub save
- `admin/admin.css` — Admin styling
- `worker/worker.js` — secure Cloudflare Worker; GitHub token stays server-side
- `worker/wrangler.toml.example` — Worker configuration example

## Admin login
The Admin Panel uses two credentials stored as Cloudflare Worker Secrets:
- `ADMIN_USERNAME` — you choose the login ID (example: `admin`)
- `ADMIN_PASSWORD` — you choose a strong password (example: use a long unique password, not the example)

The package does NOT hard-code a real password into the website.

## GitHub setup
1. Create a GitHub repository and upload the ENTIRE contents of this package, preserving folders.
2. The repository root must contain `index.html`.
3. Enable GitHub Pages from Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
4. The public site will be the GitHub Pages URL.
5. The Admin Panel is `/admin/` on the same site.

## GitHub token
Create a fine-grained Personal Access Token limited to this repository. Give repository Contents permission `Read and write`. Keep the token only in Cloudflare Worker Secrets; never put it in `index.html`, `admin.js`, or GitHub Pages.

## Cloudflare Worker setup (Dashboard)
1. Cloudflare Dashboard → Workers & Pages → Create application → Worker.
2. Paste `worker/worker.js` into the Worker editor and deploy.
3. Open the Worker → Settings → Variables and Secrets.
4. Add these as Secrets:
   - `GITHUB_TOKEN` = your GitHub fine-grained token
   - `ADMIN_USERNAME` = your chosen admin ID
   - `ADMIN_PASSWORD` = your chosen strong password
5. Add these as plain Variables:
   - `GITHUB_OWNER` = your GitHub username/owner
   - `GITHUB_REPO` = your repository name
   - `GITHUB_BRANCH` = `main`
   - `DATA_PATH` = `data/products.json`
   - `ALLOWED_ORIGIN` = your GitHub Pages origin, for example `https://YOUR_GITHUB_USERNAME.github.io`
6. Deploy the Worker again after saving settings.
7. Copy the Worker URL, for example `https://national-mobile-admin-api.YOUR-SUBDOMAIN.workers.dev`.

## Admin usage
Open:
`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO/admin/`

Enter:
- Worker API URL
- Admin ID
- Admin password

Choose `GitHub save` → `Load Data`.

Then you can:
- Add a new iPhone
- Edit an existing iPhone
- Delete an item
- Toggle In Stock / Stock Out
- Change price, original price, condition, badge and order
- Update Facebook / Instagram / TikTok links
- Update WhatsApp number
- Click `Save all to GitHub`

The Worker commits only `data/products.json` to GitHub. GitHub Pages then serves the updated data.

## Current social settings
- Facebook: https://www.facebook.com/AppleStoreNationalMobile/
- Instagram: https://www.instagram.com/applestorebutwal
- TikTok: https://www.tiktok.com/@applestorenationalmobile
- X/Twitter: removed
- WhatsApp: +977 9847396783

## Security notes
Do not put your GitHub token in the public repository. Cloudflare Secrets are intended for sensitive values such as API tokens and passwords.
