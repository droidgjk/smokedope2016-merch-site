#!/usr/bin/env bash
# Run this INSIDE your cloned repo (the folder that contains the flat files).
# It moves every file into the folder it belongs in, using git mv so history is kept.
set -euo pipefail

[ -f main.jsx ] || { echo "Run this from the repo root (main.jsx not found). Already fixed?"; exit 1; }

mkdir -p api scripts public src/components src/pages src/lib src/data

mv_() { [ -e "$1" ] && git mv -f "$1" "$2" || echo "skip (missing): $1"; }

# root config files
mv_ download .gitignore
mv_ env.example .env.example

# server + scripts
mv_ create-checkout-session.js api/create-checkout-session.js
mv_ sitemap.mjs scripts/sitemap.mjs

# public assets
for f in favicon.svg og.png robots.txt sitemap.xml; do mv_ "$f" "public/$f"; done

# src
for f in App.jsx main.jsx index.css; do mv_ "$f" "src/$f"; done
for f in CartDrawer Countdown Layout Marquee ProductArt ProductCard ProductImage SignupForm; do mv_ "$f.jsx" "src/components/$f.jsx"; done
for f in About CheckoutResult Home Lookbook NotFound Policy Product Shop; do mv_ "$f.jsx" "src/pages/$f.jsx"; done
for f in cart.jsx checkout.js format.js seo.js useCountdown.js; do mv_ "$f" "src/lib/$f"; done
for f in commerce.json products.json site.config.js; do mv_ "$f" "src/data/$f"; done

# stray file: a copy-paste of all configs, not needed
[ -e smokedope2016 ] && git rm -q -f smokedope2016

git add -A
git commit -m "Restore folder structure (src/, api/, public/, scripts/)"
echo
echo "Done. Now run:  git push"
