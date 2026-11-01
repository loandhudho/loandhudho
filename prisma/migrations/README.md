# Prisma migrations

Create the first migration locally after configuring PostgreSQL:

```bash
npm run db:migrate
```

Commit generated migration SQL to version control. For production use:

```bash
npm run db:deploy
```

Never edit an already-applied production migration. Add a new migration for subsequent changes.
