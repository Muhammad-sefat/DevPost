# fullstack-app

One folder, three independent apps. Each folder has its own `package.json` and
runs on its own with **pnpm**.

```
fullstack-app/
  backend/    Express + TypeScript, module-based folders (Prisma + PostgreSQL)
  frontend/   Next.js + TypeScript + Tailwind, feature-based folders, role-aware
  admin/      Next.js, super admin only, separate app
```

## Run each one

```bash
cd backend  && pnpm install && pnpm dev   # :5000
cd frontend && pnpm install && pnpm dev   # :3000
cd admin    && pnpm install && pnpm dev   # :3001
```

That's it — no root install, no shared workspace config. Copy this whole
folder for your next project and rename it.
