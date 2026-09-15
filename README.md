# TravelForge

TravelForge is an AI-assisted trip planning app. Give it a destination, a date range, and your interests, and it builds out a day-by-day itinerary using Groq's LLM API, then layers it with real routing, weather, and map data so the plan is actually usable and not just a wall of AI-generated text.

---

## Features

- **Auth** — email/password and Google OAuth login via Better Auth
- **AI-generated itineraries** — Groq LLM generates a structured, day-by-day trip plan based on destination and selected interests
- **AI chat assistant** — a chat widget lets you refine or ask questions about your generated plan
- **Real routing** — OSRM calculates precise travel routes between stops, rendered on an interactive Leaflet map
- **Live weather** — Open-Meteo pulls forecast data (temperature, precipitation) for the destination
- **Destination search** — country/state/city picker backed by a local country + city dataset
- **Transactional email** — password reset emails sent via Brevo
- **Schedule history** — past trips are saved to Postgres and browsable with infinite scroll or can be searched via their name
- **n8n workflows** — automation pipelines that run alongside the app to handle daily temperature updates, send email reminders, and clear outdated sessions.
- **Dockerized dev environment** — frontend, backend, database, and n8n each run in their own dev container

---

## Tech Stack

| Layer                 | Technology                                      |
| --------------------- | ----------------------------------------------- |
| Frontend              | React 19, Vite, Tailwind CSS 4, React Router    |
| Maps                  | Leaflet / react-leaflet, `@mapbox/polyline`     |
| Backend               | Node.js, Express 5                              |
| Database              | PostgreSQL + Prisma ORM                         |
| Auth                  | Better Auth (email/password + Google OAuth 2.0) |
| AI                    | Groq SDK (LLM-generated itineraries and chat)   |
| Routing               | OSRM (Open Source Routing Machine)              |
| Weather               | Open-Meteo API                                  |
| Transactional Email   | Brevo (`@getbrevo/brevo`)                       |
| Validation            | Zod                                             |
| Security / Middleware | Helmet, express-rate-limit, CORS, Morgan        |
| Automation            | n8n                                             |
| Containerization      | Docker, Docker Compose                          |

---

## External APIs

| API                                                          | Used for                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Groq](https://groq.com/)                                    | Generating trip itineraries and powering the in-app AI chat       |
| [OSRM](http://project-osrm.org/) (`router.project-osrm.org`) | Calculating precise routes between itinerary stops                |
| [Open-Meteo](https://open-meteo.com/)                        | Daily temperature and precipitation forecasts for the destination |
| [Brevo](https://www.brevo.com/)                              | Sending password reset emails                                     |
| Google OAuth 2.0                                             | Social login                                                      |

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- A [Google Cloud project](https://console.cloud.google.com/) with OAuth 2.0 credentials (Web application)
- A [Groq API key](https://console.groq.com/)
- A [Brevo API key](https://www.brevo.com/) (for transactional email)

---

### 1. Clone the repo

```bash
git clone https://github.com/KennyK-N/TravelForge.git
cd TravelForge
```

### 2. Install dependencies (optional)

Not required if you're only running things through Docker. Both `Dockerfile.dev` files run `npm ci` inside the container automatically. This is only needed if you want editor tooling (IntelliSense, linting) to work on your host, or to run `client:dev`/`server:dev` outside Docker.

```bash
npm run client:install
npm run server:install
```

### 3. Set up your environment

Both `src/frontend` and `src/backend` ship with sample env files. Copy them and fill in your own values:

- `.env.dev` — for local development
- `.env.prod` — for production

The backend needs (among others): `DATABASE_URL`, `AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONT_END_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GROQ_API_KEY`, `BREVO_API_KEY`, and `BREVO_SENDER_EMAIL`.

---

### 4. Configure Google OAuth

In your [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services → Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. For local development, add:
   - **Authorized JavaScript origins:** `http://localhost:8080`
   - **Authorized redirect URIs:** `http://localhost:8080/api/auth/callback/google`
4. Drop the resulting client ID and secret into your backend `.env.dev` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

---

### 5. Set up the database

Create and run the initial migration (this also generates the Prisma client):

```bash
npm run db:migrate:dev
```

---

### 6. Create the Docker network

TravelForge's services talk to each other over a shared Docker network, so create it once before bringing anything up:

```bash
npm run docker:create:network
```

### 7. Run everything locally with Docker

With the network in place, bring up each piece of the stack (each runs in its own terminal):

```bash
npm run client:docker:up:dev
npm run server:docker:up:dev
npm run database:docker:up:dev
npm run n8n:docker:up:dev
```

- Frontend → **http://localhost:5173**
- Backend → **http://localhost:8080**
- n8n → **http://localhost:5678**

### 8. Import the n8n workflow

Once n8n is up at `http://localhost:5678`, import the workflow file included in the `n8n/` folder of this repo:

1. Open n8n and go to **Workflows**
2. Click **Import from File** (or drag the file into the canvas)
3. Select the workflow JSON file from `n8n/`
4. Activate the workflow so it's live and ready to receive requests from the backend

---

## How It Works

```
1. Log in (email/password or Google)
        ↓
2. Pick a destination, dates, and interests
        ↓
3. Groq generates a structured day-by-day itinerary and saves it
        ↓
4. Open-Meteo pulls the forecast
        ↓
5. Review the plan with the interactive map
        ↓
6. OSRM calculates real routes between stops
        ↓
7. Revisit and browse past trips anytime
```

---

## Project Structure

```
TravelForge/
├── .github/workflows/     # CI/CD (lint, docker build, deploy)
├── database/               # Postgres (app DB) docker setup
├── n8n/                     # n8n workflow service
│   └── workflow.json        # exported workflow to import into n8n
├── src/
│   ├── frontend/            # React + Vite client
│   │   └── src/
│   │       ├── components/  # map, chat, schedule, forms, UI
│   │       ├── pages/       # routed pages (search, create/view plan, auth, settings)
│   │       └── data/        # country/city datasets
│   └── backend/             # Express API
│       └── src/
│           ├── auth/        # Better Auth config
│           ├── groq/        # Groq client, prompts, schemas
│           ├── routes/      # auth, osrm, groq, task, user-setting routes
│           ├── services/    # osrm, weather, groq, brevo, task services
│           ├── prisma/      # Prisma client + schema/migrations
│           └── middleware/  # auth, validation, rate limiting, logging
└── package.json              # root-level scripts that orchestrate everything above
```

---

## Useful Scripts

| Command                  | What it does                                       |
| ------------------------ | -------------------------------------------------- |
| `client:install`         | Installs frontend dependencies                     |
| `server:install`         | Installs backend dependencies                      |
| `client:dev`             | Runs the frontend dev server (non-Docker)          |
| `server:dev`             | Runs the backend dev server (non-Docker)           |
| `studio:dev`             | Opens Prisma Studio to browse your local database  |
| `db:generate`            | Generates the Prisma client                        |
| `db:migrate:dev`         | Creates and applies a new migration locally        |
| `client:docker:up:dev`   | Runs the frontend in its dev Docker container      |
| `server:docker:up:dev`   | Runs the backend in its dev Docker container       |
| `database:docker:up:dev` | Runs the database in its dev Docker container      |
| `n8n:docker:up:dev`      | Runs n8n in its dev Docker container               |
| `docker:create:network`  | Creates the shared Docker network the services use |

---

## Data Sources

- Country list: [fannarsh/country-list](https://github.com/fannarsh/country-list)
- Countries, States, Cities database: [dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)
