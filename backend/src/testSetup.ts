import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';

execSync('npx prisma db push --schema prisma/schema.prisma', {
  stdio: 'inherit',
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
