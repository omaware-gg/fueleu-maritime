# AI Agent Workflow Log

## Agents Used
- Cursor Agent
- Claude Opus 4.6

## Prompts & Outputs
### PROMPT 1

```Create a monorepo for a FuelEU Maritime compliance platform with two packages: /frontend and /backend.

───────────────────────────
ROOT LEVEL
───────────────────────────

Create root package.json:
{
  "name": "fueleu-maritime",
  "private": true,
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "test": "concurrently \"npm run test --prefix backend\" \"npm run test --prefix frontend\"",
    "db:setup": "npm run db:migrate --prefix backend && npm run db:seed --prefix backend"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}

Create root .gitignore covering:
  node_modules/, dist/, build/, .env, *.js.map, coverage/, .DS_Store

Create root README.md with a single line: "# FuelEU Maritime Compliance Platform"

───────────────────────────
BACKEND — /backend
───────────────────────────

Initialize a Node.js + TypeScript project. Create:

1. /backend/package.json with:
   - name: "fueleu-backend"
   - scripts:
       "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/infrastructure/server/index.ts"
       "build": "tsc"
       "test": "jest --runInBand"
       "test:unit": "jest --runInBand --testPathPattern=__tests__/(domain|application)"
       "test:integration": "jest --runInBand --testPathPattern=__tests__/integration"
       "db:migrate": "node -r ts-node/register -r tsconfig-paths/register src/infrastructure/db/migrate.ts"
       "db:seed": "node -r ts-node/register -r tsconfig-paths/register src/infrastructure/db/seed.ts"
   - dependencies: express, pg, dotenv, cors, uuid
   - devDependencies: typescript, ts-node, ts-node-dev, tsconfig-paths, @types/express, @types/pg, @types/node, @types/cors, @types/uuid, jest, ts-jest, supertest, @types/supertest, @types/jest, eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, prettier, eslint-config-prettier

2. /backend/tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@adapters/*": ["src/adapters/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@shared/*": ["src/shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}

3. /backend/jest.config.ts:
import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
export default config;

4. /backend/.eslintrc.json:
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn"
  }
}

5. /backend/.prettierrc:
{ "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }

6. /backend/.env.example:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fueleu
PORT=3001

Create this EXACT folder + file structure under /backend/src.
Create an index.ts placeholder in every leaf folder (just export {}):

src/
  core/
    domain/
      Route.ts          ← placeholder
      Compliance.ts     ← placeholder
      Comparison.ts     ← placeholder
      Banking.ts        ← placeholder
      Pool.ts           ← placeholder
    application/
      use-cases/
        RouteUseCases.ts      ← placeholder
        ComplianceUseCases.ts ← placeholder
        BankingUseCases.ts    ← placeholder
        PoolUseCases.ts       ← placeholder
    ports/
      inbound/
        IRouteService.ts      ← placeholder
        IComplianceService.ts ← placeholder
        IBankingService.ts    ← placeholder
        IPoolService.ts       ← placeholder
      outbound/
        IRouteRepository.ts      ← placeholder
        IComplianceRepository.ts ← placeholder
        IBankingRepository.ts    ← placeholder
        IPoolRepository.ts       ← placeholder
  adapters/
    inbound/
      http/
        routes/
          routesRouter.ts    ← placeholder
          complianceRouter.ts ← placeholder
          bankingRouter.ts   ← placeholder
          poolsRouter.ts     ← placeholder
    outbound/
      postgres/
        RouteRepository.ts      ← placeholder
        ComplianceRepository.ts ← placeholder
        BankingRepository.ts    ← placeholder
        PoolRepository.ts       ← placeholder
  infrastructure/
    db/
      client.ts    ← placeholder
      migrate.ts   ← placeholder
      seed.ts      ← placeholder
  shared/
    errors.ts      ← placeholder

───────────────────────────
FRONTEND — /frontend
───────────────────────────

Initialize a React + TypeScript + Vite project. Create:

1. /frontend/package.json:
   - name: "fueleu-frontend"
   - scripts:
       "dev": "vite"
       "build": "tsc && vite build"
       "test": "vitest run"
       "test:watch": "vitest"
       "preview": "vite preview"
   - dependencies: react, react-dom, axios, recharts
   - devDependencies: typescript, vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer,
     vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event,
     jsdom, @types/react, @types/react-dom, eslint, @typescript-eslint/parser,
     @typescript-eslint/eslint-plugin, prettier, eslint-config-prettier, eslint-plugin-react-hooks

2. /frontend/tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@adapters/*": ["src/adapters/*"],
      "@shared/*": ["src/shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

3. /frontend/tsconfig.node.json:
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

4. /frontend/vite.config.ts:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});

5. /frontend/tailwind.config.ts:
import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
export default config;

6. /frontend/postcss.config.js:
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };

7. /frontend/index.html — standard Vite React template with title "FuelEU Dashboard"

8. /frontend/src/test/setup.ts:
import '@testing-library/jest-dom';

9. /frontend/.env.example:
VITE_API_URL=/api

Create this EXACT folder + file structure under /frontend/src.
Create a placeholder export in every leaf file:

src/
  core/
    domain/
      Route.ts
      Compliance.ts
      Comparison.ts
    ports/
      IRoutePort.ts
      ICompliancePort.ts
      IBankingPort.ts
      IPoolPort.ts
    application/
      routeApplication.ts
      bankingApplication.ts
      poolApplication.ts
  adapters/
    ui/
      components/
        RoutesTab.tsx
        CompareTab.tsx
        BankingTab.tsx
        PoolingTab.tsx
        shared/
          TabNav.tsx
          LoadingSpinner.tsx
          ErrorBanner.tsx
          KPICard.tsx
          Badge.tsx
      hooks/
        useRoutesHook.ts
        useComparisonHook.ts
        useBankingHook.ts
        usePoolHook.ts
    infrastructure/
      api/
        apiClient.ts
        ApiContext.tsx
  shared/
    constants.ts
  App.tsx
  main.tsx
```

### PROMPT 2

```
```