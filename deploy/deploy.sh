#!/usr/bin/env bash
# Simple deployment helper (to run on the SERVER)
# Usage: run as the deploy user on the server
#   ./deploy.sh <repo_dir> <branch>

set -euo pipefail

REPO_DIR=${1:-/var/www/marketplace}
BRANCH=${2:-main}

echo "Deploying branch ${BRANCH} into ${REPO_DIR}"

cd "$REPO_DIR"

echo "Fetching latest..."
git fetch --all
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "Installing server deps..."
cd server
npm ci
npm run build

echo "Restarting backend via pm2..."
pm2 restart eclat-api || pm2 start dist/index.js --name eclat-api

echo "Building frontend..."
cd ../
npm ci
npm run build

echo "Deployed successfully."
