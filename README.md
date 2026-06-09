# Tchoutchou Transport

## Backend (`tchoutchou-api/`)

Backend is using NestJS.

**Run in production mode (default):**

```bash
cd tchoutchou-api
docker compose up --build
```

API will be on http://localhost:3000.  
Postgres runs on port `5432`.

**Run in dev mode (hot reload):**

```bash
cd tchoutchou-api
docker compose --profile dev up --build
```

Pretty much the same thing, but you can modify the code and the API will reload for you :)

**Stop everything:**

```bash
docker compose down
```

---

## Frontend (`frontend/`)

Since the frontend is an angular application, you don't need docker to use it.

```bash
cd frontend
npm install
npm start
```

Then open http://localhost:4200.

Build for production:

```bash
npm run build
```

---

**Quick reference**

| What | Command | URL |
|------|---------|-----|
| Backend (prod) | `docker compose up --build` | http://localhost:3000 |
| Backend (dev) | `docker compose --profile dev up --build` | http://localhost:3000 |
| Frontend | `npm start` | http://localhost:4200 |
