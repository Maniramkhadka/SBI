# National Mobile Apple Store — Final Admin Setup

This package contains the public site, Admin Panel, GitHub data file and a Cloudflare Worker API.

## IMPORTANT: use a NEW Cloudflare Worker

The old `sbi.arghakhanchikhadka.workers.dev` endpoint was serving the website HTML, so it was not the API Worker. Do not use that old endpoint. Create a separate normal Worker named, for example, `national-mobile-admin-api`.

### 1. Deploy the Worker

Cloudflare Dashboard → **Workers & Pages** → **Create application** → create a normal Worker. After it is created, open **Edit code**, replace the sample code with `worker/worker.js`, and click **Deploy**. Do NOT use the static-assets uploader.

After deployment, Cloudflare gives you a new `workers.dev` URL. Example:
`https://national-mobile-admin-api.YOUR-SUBDOMAIN.workers.dev`

Open that URL in a browser. It must show JSON similar to:
`{"ok":true,"service":"National Mobile Admin API","endpoint":"/products"}`

If it shows the Apple Store website, you are using the wrong Worker URL.

### 2. Cloudflare Variables

Worker → **Settings → Variables and Secrets** → add these plain Variables:

- `GITHUB_OWNER` = `Maniramkhadka`
- `GITHUB_REPO` = `SBI`
- `GITHUB_BRANCH` = `main`
- `DATA_PATH` = `data/products.json`
- `ALLOWED_ORIGIN` = `https://www.sbi.com.np`

### 3. Cloudflare Secrets

Add these as **Secret** values, not plain variables:

- `GITHUB_TOKEN` = your GitHub fine-grained token with **Contents: Read and write** for `Maniramkhadka/SBI`
- `ADMIN_USERNAME` = `nationalmobile`
- `ADMIN_PASSWORD` = a strong password you choose

Never put the GitHub token in the public GitHub repository or in `admin.js`.

### 4. Admin Panel

Open:
`https://www.sbi.com.np/admin/`

Enter:

- **Admin ID / Username:** `nationalmobile`
- **Admin password:** exactly the same value used for Cloudflare Secret `ADMIN_PASSWORD`
- **Worker API URL:** the NEW Worker URL Cloudflare gave you, for example `https://national-mobile-admin-api.YOUR-SUBDOMAIN.workers.dev`
- **Mode:** `GitHub save`

Then click **Load Data**.

### 5. Saving changes

After data loads you can add/edit/delete products, change stock, prices and social settings. Click **Save all to GitHub**. The Worker updates only `data/products.json` in the GitHub repository. GitHub Pages then serves the updated data.

## If “Failed to fetch” appears

1. Open the Worker URL directly in a browser.
2. It MUST return the JSON health response described above.
3. If it returns the Apple Store page, do not use that URL; create/use the new API Worker.
4. Check that `ALLOWED_ORIGIN` is exactly `https://www.sbi.com.np`.
5. Check the three Secrets and five Variables, then click **Deploy** again.

## Local/demo mode

The Admin Panel also has Demo mode. Demo mode is only for browser testing and does not write to GitHub.
