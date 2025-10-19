# Marketplace Backend

Dockerized Express + Sequelize + Postgres backend for the Marketplace project.

Main features:
- Role-based auth (admin, seller, buyer) using JWT
- User and Product models with CRUD
- Docker and docker-compose for local/Postgres setup

Quick start (using Docker Compose):

1. Copy `.env.example` to `.env` and update values.
2. Run:

```powershell
docker compose up --build
```

This will start Postgres and the app on port 4000.

Seed admin user:

```powershell
docker compose exec app node src/seeders/seed.js
```

Deployment notes for your server (103.144.209.109):
- Build and run the container on your server using the same compose file.
- Ensure the server firewall allows incoming port 4000 (or put behind nginx reverse proxy).
- Komodo: if Komodo is connected to your server, you can manage files and run the Docker Compose commands via the Komodo terminal. Ensure `.env` contains correct DB URL when running in production.

Security notes:
- Replace `JWT_SECRET` with a strong secret.
- Use managed Postgres or secure volumes for production.
