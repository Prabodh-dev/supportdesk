# Helpdesk Application

A modern full-stack helpdesk application built with Next.js, Express, TypeScript, and PostgreSQL.

## Project Structure

```
helpdesk/
├── apps/
│   ├── api/          # Express.js REST API
│   └── web/          # Next.js frontend
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js**: v18+ (Check with `node --version`)
- **pnpm**: v10.0.0+ (Check with `pnpm --version`)
- **Docker & Docker Compose**: For running PostgreSQL and Redis (optional for Redis)
- **PostgreSQL**: v16 (via Docker recommended)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` in the `apps/api/` directory:

```bash
cd apps/api
cp .env.local .env.local
```

Update the `.env.local` with your configuration:

```env
# API Configuration
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://helpdesk:helpdesk@localhost:5432/helpdesk
JWT_ACCESS_SECRET=your-secret-key-min-16-chars-required
JWT_REFRESH_SECRET=your-refresh-secret-min-16-chars
CORS_ORIGIN=http://localhost:3000
WEB_BASE_URL=http://localhost:3000

# Optional - Redis (for background jobs)
REDIS_URL=redis://localhost:6379
```

### 3. Start Database Services

Start PostgreSQL (and optionally Redis) using Docker Compose:

```bash
docker compose up -d
```

This will start:

- **PostgreSQL**: `postgresql://localhost:5432`
- **Redis**: `redis://localhost:6379` (optional, for background jobs)

### 4. Setup Database

Generate Prisma Client and run migrations:

```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
```

### 5. Start Development Servers

From the root directory:

```bash
pnpm dev
```

This will start both the API and web servers in parallel:

- **Web**: http://localhost:3000
- **API**: http://localhost:4000

## Development Commands

### Root Level (Both Apps)

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all apps
pnpm lint         # Lint all apps
```

### API Only

```bash
cd apps/api
pnpm dev          # Start dev server with hot-reload
pnpm build        # Build for production
pnpm start        # Run production build
pnpm prisma:generate    # Generate Prisma Client
pnpm prisma:migrate     # Run database migrations
```

### Web Only

```bash
cd apps/web
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Run production build
```

## Database Management

### View Database (GUI)

```bash
cd apps/api
pnpm prisma:generate
npx prisma studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and manage database records.

### Seed Database

To populate the database with initial data (admin, agent users):

```bash
cd apps/api
pnpm seed
```

Default credentials:

- **Admin**: admin@helpdesk.local / Admin12345
- **Agent**: agent1@helpdesk.local / Agent12345

## Docker Services

### Start Services

```bash
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### View Logs

```bash
docker compose logs -f postgres  # PostgreSQL logs
docker compose logs -f redis     # Redis logs
```

### Remove Volumes (Warning: Deletes Data)

```bash
docker compose down -v
```

## Troubleshooting

### Issue: "Can't connect to PostgreSQL"

- Ensure Docker is running: `docker ps`
- Check if containers are up: `docker compose ps`
- Verify DATABASE_URL in `.env.local` is correct

### Issue: "Can't connect to Redis"

- Redis is optional. If not needed, remove or comment out `REDIS_URL` in `.env.local`
- Background jobs will be disabled without Redis

### Issue: "Port already in use"

- Change `PORT` in `.env.local` for API (default: 4000)
- Change port in `apps/web/package.json` for web (default: 3000)

### Issue: Module not found errors

- Regenerate Prisma Client: `cd apps/api && pnpm prisma:generate`
- Clear cache: `pnpm install` from root

## Architecture

### API (`apps/api`)

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Pino
- **Background Jobs**: BullMQ + Redis (optional)

### Web (`apps/web`)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript + React 19
- **Styling**: (Configure as needed)
- **API Client**: (Configure as needed)

## File Structure

### API

```
apps/api/src/
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── config/                # Configuration files
├── db/                    # Database connection
├── middleware/            # Express middlewares
├── modules/               # Feature modules (auth, tickets, etc)
├── routes/                # Route definitions
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

### Web

```
apps/web/app/
├── page.tsx               # Home page
├── layout.tsx             # Root layout
└── auth/                  # Authentication pages
    ├── login/
    └── register/
```

## Environment Variables Reference

### API Required

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens (min 16 chars)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (min 16 chars)

### API Optional

- `REDIS_URL`: Redis connection (enable background jobs)
- `CORS_ORIGIN`: Allowed CORS origins
- `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, etc: AWS S3 configuration
- `RESEND_API_KEY`: Email service

## Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make your changes
3. Run linting: `pnpm lint`
4. Commit and push
5. Create a pull request

## License

MIT
