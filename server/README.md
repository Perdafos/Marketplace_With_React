# Eclat server (Express + MySQL)

This is a minimal backend scaffold for the Eclat marketplace.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install` inside `server/`.
3. Create the database: run `schema.sql` against your MySQL server.
4. Start in dev: `npm run dev` (nodemon + ts-node).

Midtrans

Set `MIDTRANS_SERVER_KEY` and `MIDTRANS_CLIENT_KEY` in `.env`. Set `MIDTRANS_IS_PRODUCTION=false` for sandbox.

Hosting suggestions

- Frontend: Vercel or Netlify
- Backend: Railway, Fly.io, or DigitalOcean App Platform
- Database: PlanetScale (read-replicas) or Railway Postgres/MySQL
