#!/bin/bash
set -e

echo "🚧 1. Cleaning local and remote environments..."
rm -rf dist
# Wipe the bucket clean
gcloud storage rm -r 'gs://nyc-study-spots-frontend/**' || true

echo "🔨 2. Building Project..."
npm run build

echo "📦 3. Uploading Assets (Long Term Cache)..."
# Upload the assets folder first (hashed files get 1 year cache)
gcloud storage cp -r dist/assets gs://nyc-study-spots-frontend/assets \
    --cache-control="public, max-age=31536000, immutable"

echo "📄 4. Uploading Root Files (No Cache)..."
# Loop through files in dist/ and upload only the files (skipping the assets directory)
# This ensures index.html, vite.svg, favicon.ico, etc. get uploaded with NO cache.
for file in dist/*; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        gcloud storage cp "$file" gs://nyc-study-spots-frontend/ \
            --cache-control="no-cache, no-store, max-age=0, must-revalidate"
    fi
done

echo "✅ Fresh deployment complete!"
