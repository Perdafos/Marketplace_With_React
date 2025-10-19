# Deploy guide (Option B) — Develop locally in Komodo, deploy to server

This document shows a simple, repeatable git-based deployment workflow. It assumes:

- You have a remote Git repo (GitHub/GitLab) and push access from your local machine.
- Your server is a Linux VM (Ubuntu/Debian) with SSH access.
- You have Node.js, npm, pm2 and nginx installed on the server. If not, see server bootstrap steps below.

Steps (quick version)
1. On your local machine (Komodo): develop, commit and push to remote.
2. On your server: clone the repo under `/var/www/marketplace` (or any path you prefer).
3. Configure `server/.env` on the server with production DB credentials, JWT secret and Midtrans keys.
4. Import DB schema: `mysql -u root -p < server/schema.sql` or use your managed DB tool.
5. Run deployment helper on server:
   ```bash
   cd /var/www/marketplace
   sudo bash deploy/deploy.sh /var/www/marketplace main
   ```
6. Configure nginx: copy `deploy/nginx_eclat.conf` to `/etc/nginx/sites-available/eclat` and enable it.
7. Obtain SSL with certbot:
   ```bash
   sudo certbot --nginx -d example.com -d www.example.com
   ```

Bootstrap steps (server) — if needed
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation
```

PM2 ecosystem
- We included `deploy/ecosystem.config.js` which defines the `eclat-api` process. Use `pm2 start deploy/ecosystem.config.js` to start (or `pm2 restart eclat-api`).

Notes and tips
- Keep `JWT_SECRET` and Midtrans keys secret — use environment variables or secret manager.
- If you use a managed DB (PlanetScale, RDS), use connection string in `.env` and skip local MySQL install.
- Adjust `nginx_eclat.conf` `server_name` and paths to match your server.

If you want, I can generate a `deploy/seed-admin.js` script to create an initial admin and seller, and add instructions to run it on the server.

Docker deployment
-----------------
We included a `deploy/docker-compose.yml` and Dockerfiles for backend and frontend. To run everything with Docker compose:

1. Create a `.env` file in `server/` with DB credentials and JWT secret. For local Docker you can set:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=eclat_db
# server/.env for backend will be mounted into the backend container via env_file
```

2. From `deploy/` folder run:

```bash
cd deploy
docker compose up -d
```

3. The stack:
- MySQL on host port 3306
- Backend on host port 4000
- Frontend served on port 80
- Adminer on 8080 for DB GUI

4. Seed admin/seller inside backend container:

```bash
docker exec -it eclat_api node scripts/seed-admin.js
```

Notes:
- In production, prefer not to expose DB to host or use managed DB provider. Use proper env management for secrets.

