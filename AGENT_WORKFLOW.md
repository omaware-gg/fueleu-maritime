# AI Agent Workflow Log

## Agents Used
- Claude Sonnet 4.6 Extended (to generate the entire workflow)
- Cursor Agent
- Claude Opus 4.6

## Prompts & Outputs
### PROMPT 1 - Monorepo Scaffold

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

### PROMPT 2 - Backend: Database Schema, Migrations & Seeds

```Implement the complete PostgreSQL database layer in /backend/src/infrastructure/db/.

───────────────────────────
1. /backend/src/infrastructure/db/client.ts
───────────────────────────

import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fueleu',
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export default pool;

───────────────────────────
2. /backend/src/infrastructure/db/migrate.ts
───────────────────────────

Write a TypeScript script that runs the following SQL DDL using the pool client.
Execute each CREATE TABLE in order. Use IF NOT EXISTS on all tables.
Run the script and exit with process.exit(0) on success, process.exit(1) on error.

SQL to execute:

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id VARCHAR(10) UNIQUE NOT NULL,
  vessel_type VARCHAR(50) NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity NUMERIC(10,4) NOT NULL,
  fuel_consumption NUMERIC(10,2) NOT NULL,
  distance_km NUMERIC(10,2) NOT NULL,
  total_emissions NUMERIC(10,2) NOT NULL,
  is_baseline BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ship_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq NUMERIC(15,4) NOT NULL,
  energy_mj NUMERIC(20,4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq NUMERIC(15,4) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('banked', 'applied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pool_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(50) NOT NULL,
  cb_before NUMERIC(15,4) NOT NULL,
  cb_after NUMERIC(15,4) NOT NULL
);

───────────────────────────
3. /backend/src/infrastructure/db/seed.ts
───────────────────────────

Write a TypeScript script that:
1. Deletes all rows from routes (DELETE FROM routes)
2. Inserts exactly these 5 routes using parameterized queries:

  ('R001', 'Container',   'HFO', 2024, 91.0,  5000, 12000, 4500, FALSE)
  ('R002', 'BulkCarrier', 'LNG', 2024, 88.0,  4800, 11500, 4200, FALSE)
  ('R003', 'Tanker',      'MGO', 2024, 93.5,  5100, 12500, 4700, FALSE)
  ('R004', 'RoRo',        'HFO', 2025, 89.2,  4900, 11800, 4300, TRUE)
  ('R005', 'Container',   'LNG', 2025, 90.5,  4950, 11900, 4400, FALSE)

  INSERT columns: route_id, vessel_type, fuel_type, year, ghg_intensity,
                  fuel_consumption, distance_km, total_emissions, is_baseline

3. Exits with process.exit(0) on success, process.exit(1) on error.
   Print a success message to console.log for each inserted row.

Use the query() helper from client.ts. Use ON CONFLICT (route_id) DO UPDATE
SET is_baseline = EXCLUDED.is_baseline to make the seed idempotent.
```

### PROMPT 3.1 - Backend: Domain entities (pure functions only)

```Implement all domain entities and pure business logic functions in /backend/src/core/domain/.
CRITICAL RULE: Zero imports from express, pg, axios, or any framework in this folder.
Every function must be a pure function with no side effects.

───────────────────────────
/core/domain/Route.ts
───────────────────────────

export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;       // gCO₂e/MJ
  fuelConsumption: number;    // tonnes
  distanceKm: number;
  totalEmissions: number;     // tonnes
  isBaseline: boolean;
}

───────────────────────────
/core/domain/Compliance.ts
───────────────────────────

// FuelEU Annex IV — 2% reduction target below 91.16 gCO₂e/MJ
export const TARGET_GHG_INTENSITY = 89.3368; // gCO₂e/MJ
export const LCV_MJ_PER_TONNE = 41_000;      // MJ per tonne of fuel

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;   // positive = surplus, negative = deficit
  energyMj: number;
}

/**
 * Compliance Balance = (Target − Actual) × (fuelConsumption × LCV)
 * Positive → surplus (compliant), Negative → deficit (non-compliant)
 */
export function computeCB(ghgIntensity: number, fuelConsumptionTonnes: number): number {
  const energyMj = fuelConsumptionTonnes * LCV_MJ_PER_TONNE;
  return (TARGET_GHG_INTENSITY - ghgIntensity) * energyMj;
}

export function computeEnergyMj(fuelConsumptionTonnes: number): number {
  return fuelConsumptionTonnes * LCV_MJ_PER_TONNE;
}

───────────────────────────
/core/domain/Comparison.ts
───────────────────────────

import { TARGET_GHG_INTENSITY } from './Compliance';

export interface RouteComparison {
  baselineRouteId: string;
  comparisonRouteId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;   // ((comparison / baseline) - 1) * 100
  compliant: boolean;    // comparisonGhg <= TARGET_GHG_INTENSITY
}

/**
 * percentDiff = ((comparison / baseline) - 1) * 100
 * compliant = comparisonGhg <= TARGET (89.3368 gCO₂e/MJ)
 */
export function computeComparison(
  baselineGhg: number,
  comparisonGhg: number
): { percentDiff: number; compliant: boolean } {
  if (baselineGhg === 0) throw new Error('Baseline GHG intensity cannot be zero');
  const percentDiff = ((comparisonGhg / baselineGhg) - 1) * 100;
  const compliant = comparisonGhg <= TARGET_GHG_INTENSITY;
  return { percentDiff, compliant };
}

───────────────────────────
/core/domain/Banking.ts
───────────────────────────

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  type: 'banked' | 'applied';
  createdAt: Date;
}

/**
 * FuelEU Article 20 — Banking.
 * Validates that the CB is positive before banking.
 */
export function bankSurplus(cb: number): number {
  if (cb <= 0) throw new Error('Cannot bank: compliance balance is not positive (no surplus)');
  return cb;
}

/**
 * Apply banked surplus to offset a deficit.
 * applied = min(bankedAmount, |deficit|)
 * cbAfter = deficit + applied  (deficit is negative, so this moves toward 0)
 */
export function applyBanked(
  bankedAmount: number,
  deficit: number
): { applied: number; cbAfter: number } {
  if (bankedAmount <= 0) throw new Error('No banked surplus available to apply');
  if (deficit >= 0) throw new Error('Cannot apply banked surplus: CB is not in deficit');
  const applied = Math.min(bankedAmount, Math.abs(deficit));
  const cbAfter = deficit + applied;
  return { applied, cbAfter };
}

───────────────────────────
/core/domain/Pool.ts
───────────────────────────

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  createdAt: Date;
}

/**
 * FuelEU Article 21 — Pooling validation.
 * Rule: sum of all CBs in the pool must be >= 0
 */
export function validatePool(
  members: { shipId: string; cb: number }[]
): { valid: boolean; reason?: string } {
  if (members.length < 2) {
    return { valid: false, reason: 'Pool must have at least 2 members' };
  }
  const sum = members.reduce((acc, m) => acc + m.cb, 0);
  if (sum < 0) {
    return { valid: false, reason: `Pool sum CB is ${sum.toFixed(2)} — must be >= 0` };
  }
  return { valid: true };
}

/**
 * Greedy allocation per FuelEU Article 21:
 * 1. Sort members descending by CB (surplus first)
 * 2. Transfer surplus to deficits one by one
 * 
 * Enforcement rules (both checked explicitly):
 * - Surplus ship (cbBefore >= 0) CANNOT exit with cbAfter < 0
 * - Deficit ship (cbBefore < 0) CANNOT exit worse than it entered (cbAfter < cbBefore)
 */
export function allocatePool(
  members: { shipId: string; cb: number }[]
): PoolMember[] {
  // Validate first
  const validation = validatePool(members);
  if (!validation.valid) throw new Error(validation.reason);

  // Sort descending by cb (surplus ships first)
  const sorted = [...members].sort((a, b) => b.cb - a.cb);
  const result: PoolMember[] = sorted.map((m) => ({
    shipId: m.shipId,
    cbBefore: m.cb,
    cbAfter: m.cb,
  }));

  // Greedy: for each surplus ship, fill deficits left to right
  for (let i = 0; i < result.length; i++) {
    for (let j = result.length - 1; j > i; j--) {
      if (result[i].cbAfter > 0 && result[j].cbAfter < 0) {
        const transfer = Math.min(result[i].cbAfter, Math.abs(result[j].cbAfter));
        result[i].cbAfter -= transfer;
        result[j].cbAfter += transfer;
      }
    }
  }

  // Enforce Rule 1: surplus ship cannot exit negative
  for (const m of result) {
    if (m.cbBefore >= 0 && m.cbAfter < 0) {
      throw new Error(
        `Invalid pool: ship ${m.shipId} had surplus (${m.cbBefore}) but exits negative (${m.cbAfter})`
      );
    }
  }

  // Enforce Rule 2: deficit ship cannot exit worse than it entered
  for (const m of result) {
    if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
      throw new Error(
        `Invalid pool: ship ${m.shipId} deficit worsened from ${m.cbBefore} to ${m.cbAfter}`
      );
    }
  }

  return result;
}
```

### PROMPT 3.2 - Backend: Port interfaces

```Implement all port interfaces in /backend/src/core/ports/.
These are TypeScript interfaces only — no implementation, no imports from pg or express.

───────────────────────────
OUTBOUND PORTS (what the core needs from infrastructure)
───────────────────────────

/core/ports/outbound/IRouteRepository.ts:

import { Route } from '../../domain/Route';

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export interface IRouteRepository {
  findAll(filters?: RouteFilters): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
}

/core/ports/outbound/IComplianceRepository.ts:

import { ComplianceBalance } from '../../domain/Compliance';

export interface IComplianceRepository {
  save(cb: ComplianceBalance): Promise<void>;
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
}

/core/ports/outbound/IBankingRepository.ts:

import { BankEntry } from '../../domain/Banking';

export interface IBankingRepository {
  save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  getTotalByType(shipId: string, year: number, type: 'banked' | 'applied'): Promise<number>;
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
}

/core/ports/outbound/IPoolRepository.ts:

import { Pool, PoolMember } from '../../domain/Pool';

export interface IPoolRepository {
  create(year: number, members: PoolMember[]): Promise<Pool>;
}

───────────────────────────
INBOUND PORTS (what the HTTP layer calls into the core)
───────────────────────────

/core/ports/inbound/IRouteService.ts:

import { Route } from '../../domain/Route';
import { RouteComparison } from '../../domain/Comparison';
import { RouteFilters } from '../outbound/IRouteRepository';

export interface IRouteService {
  getAllRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<{ baseline: Route; comparisons: RouteComparison[] }>;
}

/core/ports/inbound/IComplianceService.ts:

export interface IComplianceService {
  getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }>;
  getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number; rawCb: number }>;
}

/core/ports/inbound/IBankingService.ts:

import { BankEntry } from '../../domain/Banking';

export interface IBankingService {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(
    shipId: string, year: number, amount: number
  ): Promise<{ cbBefore: number; banked: number; cbAfter: number }>;
  applyBanked(
    shipId: string, year: number, amount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }>;
}

/core/ports/inbound/IPoolService.ts:

import { Pool } from '../../domain/Pool';

export interface IPoolService {
  createPool(
    year: number,
    members: { shipId: string; cb: number }[]
  ): Promise<Pool>;
}
```

### PROMPT 3.3 - Backend - Use-cases

```Implement the four use-case classes in /backend/src/core/application/use-cases/.
Each class accepts ONLY port interfaces via constructor. No express, no pg, no axios imports.

───────────────────────────
/core/application/use-cases/RouteUseCases.ts
───────────────────────────

import { IRouteRepository, RouteFilters } from '../../ports/outbound/IRouteRepository';
import { IRouteService } from '../../ports/inbound/IRouteService';
import { Route } from '../../domain/Route';
import { RouteComparison, computeComparison } from '../../domain/Comparison';

export class RouteUseCases implements IRouteService {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async getAllRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.routeRepo.findAll(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    const route = await this.routeRepo.findByRouteId(routeId);
    if (!route) throw new Error(`Route ${routeId} not found`);
    await this.routeRepo.setBaseline(routeId);
  }

  async getComparison(): Promise<{ baseline: Route; comparisons: RouteComparison[] }> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) throw new Error('No baseline route set. Use POST /routes/:id/baseline first.');

    const allRoutes = await this.routeRepo.findAll();
    const others = allRoutes.filter((r) => r.routeId !== baseline.routeId);

    const comparisons: RouteComparison[] = others.map((route) => {
      const { percentDiff, compliant } = computeComparison(
        baseline.ghgIntensity,
        route.ghgIntensity
      );
      return {
        baselineRouteId: baseline.routeId,
        comparisonRouteId: route.routeId,
        baselineGhg: baseline.ghgIntensity,
        comparisonGhg: route.ghgIntensity,
        percentDiff,
        compliant,
      };
    });

    return { baseline, comparisons };
  }
}

───────────────────────────
/core/application/use-cases/ComplianceUseCases.ts
───────────────────────────

import { IComplianceService } from '../../ports/inbound/IComplianceService';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { computeCB, computeEnergyMj } from '../../domain/Compliance';

export class ComplianceUseCases implements IComplianceService {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo: IBankingRepository,
  ) {}

  async getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }> {
    // shipId corresponds to routeId in this implementation
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cb = computeCB(route.ghgIntensity, route.fuelConsumption);
    const energyMj = computeEnergyMj(route.fuelConsumption);

    // Persist snapshot
    await this.complianceRepo.save({ shipId, year, cbGco2eq: cb, energyMj });

    return { cb, energyMj };
  }

  async getAdjustedCB(
    shipId: string, year: number
  ): Promise<{ adjustedCb: number; rawCb: number }> {
    const { cb: rawCb } = await this.getCB(shipId, year);

    // Adjusted CB = rawCB + totalApplied - totalBanked
    // (banked surplus is set aside; applied entries restore purchasing power)
    const totalBanked = await this.bankingRepo.getTotalByType(shipId, year, 'banked');
    const totalApplied = await this.bankingRepo.getTotalByType(shipId, year, 'applied');
    const adjustedCb = rawCb + totalApplied - totalBanked;

    return { adjustedCb, rawCb };
  }
}

───────────────────────────
/core/application/use-cases/BankingUseCases.ts
───────────────────────────

import { IBankingService } from '../../ports/inbound/IBankingService';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { BankEntry, bankSurplus, applyBanked } from '../../domain/Banking';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { computeCB } from '../../domain/Compliance';

export class BankingUseCases implements IBankingService {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo: IBankingRepository,
  ) {}

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepo.getRecords(shipId, year);
  }

  async bankSurplus(
    shipId: string, year: number, amount: number
  ): Promise<{ cbBefore: number; banked: number; cbAfter: number }> {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cbBefore = computeCB(route.ghgIntensity, route.fuelConsumption);

    // Domain validation — throws if cb <= 0
    bankSurplus(cbBefore);

    if (amount > cbBefore) {
      throw new Error(`Cannot bank ${amount}: exceeds available surplus of ${cbBefore.toFixed(4)}`);
    }

    await this.bankingRepo.save({ shipId, year, amountGco2eq: amount, type: 'banked' });

    return { cbBefore, banked: amount, cbAfter: cbBefore - amount };
  }

  async applyBanked(
    shipId: string, year: number, amount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cbBefore = computeCB(route.ghgIntensity, route.fuelConsumption);
    const totalBanked = await this.bankingRepo.getTotalByType(shipId, year, 'banked');
    const totalApplied = await this.bankingRepo.getTotalByType(shipId, year, 'applied');
    const availableBanked = totalBanked - totalApplied;

    if (amount > availableBanked) {
      throw new Error(
        `Cannot apply ${amount}: only ${availableBanked.toFixed(4)} available in bank`
      );
    }

    // Domain validation — throws if banked <= 0 or cb >= 0
    const { applied, cbAfter } = applyBanked(availableBanked, cbBefore);
    const actualApplied = Math.min(amount, applied);

    await this.bankingRepo.save({ shipId, year, amountGco2eq: actualApplied, type: 'applied' });

    return { cbBefore, applied: actualApplied, cbAfter: cbBefore + actualApplied };
  }
}

───────────────────────────
/core/application/use-cases/PoolUseCases.ts
───────────────────────────

import { IPoolService } from '../../ports/inbound/IPoolService';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';
import { Pool, validatePool, allocatePool } from '../../domain/Pool';

export class PoolUseCases implements IPoolService {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async createPool(
    year: number,
    members: { shipId: string; cb: number }[]
  ): Promise<Pool> {
    // Domain validation — throws with reason if invalid
    const validation = validatePool(members);
    if (!validation.valid) throw new Error(validation.reason);

    // Greedy allocation — throws if enforcement rules are violated
    const allocatedMembers = allocatePool(members);

    // Persist to DB
    return this.poolRepo.create(year, allocatedMembers);
  }
}
```

### PROMPT 4.1 - Backend: Postgres repository implementations

```Implement all four repository adapters in /backend/src/adapters/outbound/postgres/.
Each class implements its corresponding port interface from core/ports/outbound/.
Import ONLY the query() helper from @infrastructure/db/client. No direct pg imports.
Use parameterized queries ($1, $2, ...) everywhere — never string interpolation in SQL.

───────────────────────────
/adapters/outbound/postgres/RouteRepository.ts
───────────────────────────

Implements IRouteRepository. 

Private mapRow() helper converts snake_case DB row to Route domain object:
  id → id, route_id → routeId, vessel_type → vesselType, fuel_type → fuelType,
  year → year, ghg_intensity → ghgIntensity (Number()),
  fuel_consumption → fuelConsumption (Number()),
  distance_km → distanceKm (Number()),
  total_emissions → totalEmissions (Number()),
  is_baseline → isBaseline

findAll(filters?): 
  Build WHERE clause dynamically. Start with "WHERE 1=1", 
  push params and "AND vessel_type = $N", "AND fuel_type = $N", "AND year = $N" 
  only for defined filters. ORDER BY route_id ASC.

findByRouteId(routeId): SELECT WHERE route_id = $1

findBaseline(): SELECT WHERE is_baseline = TRUE LIMIT 1, return null if not found

setBaseline(routeId): 
  Run in a transaction:
    BEGIN
    UPDATE routes SET is_baseline = FALSE
    UPDATE routes SET is_baseline = TRUE WHERE route_id = $1
    COMMIT
  Use pool directly for transaction (import pool default from client.ts)

───────────────────────────
/adapters/outbound/postgres/ComplianceRepository.ts
───────────────────────────

Implements IComplianceRepository.

save(cb): 
  INSERT INTO ship_compliance (ship_id, year, cb_gco2eq, energy_mj) VALUES ($1,$2,$3,$4)
  ON CONFLICT DO NOTHING

findByShipAndYear(shipId, year):
  SELECT WHERE ship_id=$1 AND year=$2 ORDER BY created_at DESC LIMIT 1

───────────────────────────
/adapters/outbound/postgres/BankingRepository.ts
───────────────────────────

Implements IBankingRepository.

save(entry): INSERT INTO bank_entries (ship_id, year, amount_gco2eq, type) VALUES ($1,$2,$3,$4)
  RETURNING id, ship_id, year, amount_gco2eq, type, created_at
  Map result to BankEntry domain object.

getTotalByType(shipId, year, type):
  SELECT COALESCE(SUM(amount_gco2eq), 0) FROM bank_entries 
  WHERE ship_id=$1 AND year=$2 AND type=$3
  Return as Number.

getRecords(shipId, year):
  SELECT * FROM bank_entries WHERE ship_id=$1 AND year=$2 ORDER BY created_at DESC
  Map each row to BankEntry.

───────────────────────────
/adapters/outbound/postgres/PoolRepository.ts
───────────────────────────

Implements IPoolRepository.

create(year, members):
  Run in a transaction:
    INSERT INTO pools (year) VALUES ($1) RETURNING id, year, created_at
    For each member: INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
  Return Pool domain object with members array.
```

### PROMPT 4.2 - Backend: Express HTTP routers

```Implement all four Express routers in /backend/src/adapters/inbound/http/routes/.
Each router file accepts a pre-built use-case instance via a factory function.
No business logic in routers — only HTTP parsing and delegation.
Wrap every handler in try/catch. Return:
  - 200/201 with JSON data on success
  - 400 with { error: message } for domain/validation errors  
  - 500 with { error: 'Internal server error' } for unexpected errors

───────────────────────────
/adapters/inbound/http/routes/routesRouter.ts
───────────────────────────

import { Router } from 'express';
import { IRouteService } from '@core/ports/inbound/IRouteService';

export function createRoutesRouter(routeService: IRouteService): Router {
  const router = Router();

  // GET /routes?vesselType=&fuelType=&year=
  router.get('/', async (req, res) => { ... })

  // POST /routes/:id/baseline
  router.post('/:id/baseline', async (req, res) => { ... })

  // GET /routes/comparison
  // IMPORTANT: Define this BEFORE '/:id' to avoid route conflict
  router.get('/comparison', async (req, res) => { ... })

  return router;
}

NOTE: Register /comparison BEFORE /:id/baseline in the router definition order.

───────────────────────────
/adapters/inbound/http/routes/complianceRouter.ts
───────────────────────────

export function createComplianceRouter(complianceService: IComplianceService): Router

  // GET /compliance/cb?shipId=R001&year=2025
  router.get('/cb', async (req, res) => {
    // Validate shipId and year query params are present
    // Return { shipId, year, cb, energyMj }
  })

  // GET /compliance/adjusted-cb?shipId=R001&year=2025  
  router.get('/adjusted-cb', async (req, res) => {
    // Return { shipId, year, adjustedCb, rawCb }
  })

───────────────────────────
/adapters/inbound/http/routes/bankingRouter.ts
───────────────────────────

export function createBankingRouter(bankingService: IBankingService): Router

  // GET /banking/records?shipId=R001&year=2025
  router.get('/records', async (req, res) => { ... })

  // POST /banking/bank  body: { shipId, year, amount }
  router.post('/bank', async (req, res) => {
    // Validate body fields present and amount > 0
    // Return { cbBefore, banked, cbAfter }
  })

  // POST /banking/apply  body: { shipId, year, amount }
  router.post('/apply', async (req, res) => {
    // Validate body fields present and amount > 0
    // Return { cbBefore, applied, cbAfter }
  })

───────────────────────────
/adapters/inbound/http/routes/poolsRouter.ts
───────────────────────────

export function createPoolsRouter(poolService: IPoolService): Router

  // POST /pools  body: { year, members: [{ shipId, cb }] }
  router.post('/', async (req, res) => {
    // Validate year present, members is array with >= 2 items
    // Return pool with cb_after per member
    // 201 on success
  })

───────────────────────────
/infrastructure/server/index.ts
───────────────────────────

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import all Postgres adapters
// Import all use-case classes
// Import all router factories

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Wire up dependency injection:
const routeRepo = new RouteRepository();
const complianceRepo = new ComplianceRepository();
const bankingRepo = new BankingRepository();
const poolRepo = new PoolRepository();

const routeService = new RouteUseCases(routeRepo);
const complianceService = new ComplianceUseCases(routeRepo, complianceRepo, bankingRepo);
const bankingService = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);
const poolService = new PoolUseCases(poolRepo);

// Mount routers
app.use('/routes', createRoutesRouter(routeService));
app.use('/compliance', createComplianceRouter(complianceService));
app.use('/banking', createBankingRouter(bankingService));
app.use('/pools', createPoolsRouter(poolService));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`FuelEU backend running on port ${PORT}`));

export default app;
```

### PROMPT 5 - Backend: Tests

```Write all backend tests in /backend/src/__tests__/.
Use Jest. Domain unit tests need zero mocks. Use-case tests mock repositories with jest.fn().
Integration tests use supertest against the actual Express app (requires DB running).

───────────────────────────
__tests__/domain/Compliance.test.ts
───────────────────────────

import { computeCB, computeEnergyMj, TARGET_GHG_INTENSITY, LCV_MJ_PER_TONNE } from '@core/domain/Compliance';

describe('computeEnergyMj', () => {
  it('5000 tonnes * 41000 MJ/t = 205,000,000 MJ', () => {
    expect(computeEnergyMj(5000)).toBe(205_000_000);
  });
});

describe('computeCB', () => {
  it('returns 0 when ghgIntensity equals target', () => {
    expect(computeCB(TARGET_GHG_INTENSITY, 5000)).toBeCloseTo(0, 2);
  });
  it('returns negative (deficit) when ghgIntensity > target — R001 scenario', () => {
    const cb = computeCB(91.0, 5000);
    expect(cb).toBeLessThan(0);
    // (89.3368 - 91.0) * 205_000_000 = -340,240,000
    expect(cb).toBeCloseTo(-340_240_000, 0);
  });
  it('returns positive (surplus) when ghgIntensity < target — R002 scenario', () => {
    const cb = computeCB(88.0, 4800);
    expect(cb).toBeGreaterThan(0);
  });
});

───────────────────────────
__tests__/domain/Comparison.test.ts
───────────────────────────

import { computeComparison } from '@core/domain/Comparison';

describe('computeComparison', () => {
  it('returns negative percentDiff and compliant=true when comparison < baseline', () => {
    const result = computeComparison(91.0, 88.0);
    expect(result.percentDiff).toBeCloseTo(-3.296, 2);
    expect(result.compliant).toBe(true);
  });
  it('returns positive percentDiff and compliant=false when comparison > target', () => {
    const result = computeComparison(91.0, 93.5);
    expect(result.percentDiff).toBeCloseTo(2.747, 2);
    expect(result.compliant).toBe(false);
  });
  it('throws when baseline is 0', () => {
    expect(() => computeComparison(0, 88.0)).toThrow();
  });
  it('marks R004 (89.2) as compliant since 89.2 <= 89.3368', () => {
    const result = computeComparison(91.0, 89.2);
    expect(result.compliant).toBe(true);
  });
});

───────────────────────────
__tests__/domain/Banking.test.ts
───────────────────────────

import { bankSurplus, applyBanked } from '@core/domain/Banking';

describe('bankSurplus', () => {
  it('returns amount when CB is positive', () => expect(bankSurplus(500)).toBe(500));
  it('throws when CB is 0', () => expect(() => bankSurplus(0)).toThrow());
  it('throws when CB is negative', () => expect(() => bankSurplus(-100)).toThrow());
});

describe('applyBanked', () => {
  it('applies full deficit when banked > |deficit|', () => {
    const { applied, cbAfter } = applyBanked(200, -150);
    expect(applied).toBe(150);
    expect(cbAfter).toBe(0);
  });
  it('applies partial when banked < |deficit|', () => {
    const { applied, cbAfter } = applyBanked(100, -150);
    expect(applied).toBe(100);
    expect(cbAfter).toBe(-50);
  });
  it('throws when no banked surplus', () => {
    expect(() => applyBanked(0, -100)).toThrow();
  });
  it('throws when CB is not in deficit', () => {
    expect(() => applyBanked(200, 50)).toThrow();
  });
});

───────────────────────────
__tests__/domain/Pool.test.ts
───────────────────────────

import { validatePool, allocatePool } from '@core/domain/Pool';

describe('validatePool', () => {
  it('valid when sum >= 0', () => {
    expect(validatePool([{ shipId: 'A', cb: 100 }, { shipId: 'B', cb: -50 }]).valid).toBe(true);
  });
  it('invalid when sum < 0', () => {
    const r = validatePool([{ shipId: 'A', cb: 50 }, { shipId: 'B', cb: -200 }]);
    expect(r.valid).toBe(false);
    expect(r.reason).toContain('must be >= 0');
  });
  it('invalid with fewer than 2 members', () => {
    expect(validatePool([{ shipId: 'A', cb: 100 }]).valid).toBe(false);
  });
});

describe('allocatePool', () => {
  it('transfers surplus to deficit correctly', () => {
    const result = allocatePool([
      { shipId: 'S', cb: 200 },
      { shipId: 'D', cb: -100 },
    ]);
    const surplus = result.find(m => m.shipId === 'S')!;
    const deficit = result.find(m => m.shipId === 'D')!;
    expect(deficit.cbAfter).toBe(0);
    expect(surplus.cbAfter).toBe(100);
  });
  it('surplus ship does not exit negative', () => {
    const result = allocatePool([
      { shipId: 'S', cb: 100 },
      { shipId: 'D', cb: -50 },
    ]);
    const s = result.find(m => m.shipId === 'S')!;
    expect(s.cbAfter).toBeGreaterThanOrEqual(0);
  });
  it('throws when pool sum < 0', () => {
    expect(() => allocatePool([
      { shipId: 'A', cb: 50 },
      { shipId: 'B', cb: -200 },
    ])).toThrow();
  });
});

───────────────────────────
__tests__/application/RouteUseCases.test.ts
───────────────────────────

Mock IRouteRepository with jest.fn(). 

Test:
- getAllRoutes() with vesselType filter calls findAll with correct filters
- setBaseline() calls findByRouteId then setBaseline on repo
- setBaseline() throws 'not found' if repo returns null
- getComparison() throws if no baseline set
- getComparison() returns correct RouteComparison[] with percentDiff and compliant fields

───────────────────────────
__tests__/application/BankingUseCases.test.ts
───────────────────────────

Mock all three repos with jest.fn().

Test:
- bankSurplus() calls bankingRepo.save with type='banked'
- bankSurplus() throws if amount > cb
- applyBanked() calls bankingRepo.save with type='applied'
- applyBanked() throws if amount > availableBanked (totalBanked - totalApplied)

───────────────────────────
__tests__/integration/routes.integration.test.ts
───────────────────────────

Use supertest. Import app from infrastructure/server/index.ts.
Mark this file with @group integration.

Test (requires DB to be running):
- GET /routes returns status 200 and array of 5 routes
- GET /routes?vesselType=Container returns only Container routes
- GET /routes/comparison returns { baseline, comparisons } structure with R004 as baseline
- POST /routes/R001/baseline returns 200 and sets R001 as baseline
- GET /compliance/cb?shipId=R001&year=2024 returns { cb, energyMj }
- POST /banking/bank with { shipId: 'R002', year: 2024, amount: 100 } returns { cbBefore, banked, cbAfter }
- POST /banking/bank with deficit ship returns 400
- POST /pools with valid members returns 201 with cb_after per member
- POST /pools with invalid sum (< 0) returns 400
```

### PROMPT 6.1 - Frontend: Core domain types and ports

```Implement the frontend core layer in /frontend/src/core/.
CRITICAL RULE: Zero React imports in this folder. Pure TypeScript interfaces and functions only.

───────────────────────────
/core/domain/Route.ts
───────────────────────────

export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distanceKm: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

───────────────────────────
/core/domain/Compliance.ts
───────────────────────────

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cb: number;
  energyMj: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  type: 'banked' | 'applied';
  createdAt: string;
}

export interface BankingResult {
  cbBefore: number;
  banked?: number;
  applied?: number;
  cbAfter: number;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  createdAt: string;
}

───────────────────────────
/core/domain/Comparison.ts
───────────────────────────

import { Route } from './Route';

export interface RouteComparison {
  baselineRouteId: string;
  comparisonRouteId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonResult {
  baseline: Route;
  comparisons: RouteComparison[];
}

───────────────────────────
/core/ports/IRoutePort.ts
───────────────────────────

import { Route, RouteFilters } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export interface IRoutePort {
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}

───────────────────────────
/core/ports/ICompliancePort.ts
───────────────────────────

import { BankEntry, BankingResult, Pool } from '../domain/Compliance';

export interface ICompliancePort {
  getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }>;
  getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number; rawCb: number }>;
}

export interface IBankingPort {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
}

export interface IPoolPort {
  createPool(year: number, members: { shipId: string; cb: number }[]): Promise<Pool>;
}

───────────────────────────
/core/application/routeApplication.ts
───────────────────────────

// Pure application functions — no React, no hooks

import { IRoutePort } from '../ports/IRoutePort';
import { Route, RouteFilters } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export async function getAllRoutes(port: IRoutePort, filters?: RouteFilters): Promise<Route[]> {
  return port.getRoutes(filters);
}

export async function setBaseline(port: IRoutePort, routeId: string): Promise<void> {
  return port.setBaseline(routeId);
}

export async function getComparison(port: IRoutePort): Promise<ComparisonResult> {
  return port.getComparison();
}

───────────────────────────
/core/application/bankingApplication.ts
───────────────────────────

import { IBankingPort } from '../ports/ICompliancePort';
import { BankEntry, BankingResult } from '../domain/Compliance';

export async function getRecords(port: IBankingPort, shipId: string, year: number): Promise<BankEntry[]> {
  return port.getRecords(shipId, year);
}

export async function bankSurplus(port: IBankingPort, shipId: string, year: number, amount: number): Promise<BankingResult> {
  return port.bankSurplus(shipId, year, amount);
}

export async function applyBanked(port: IBankingPort, shipId: string, year: number, amount: number): Promise<BankingResult> {
  return port.applyBanked(shipId, year, amount);
}

───────────────────────────
/core/application/poolApplication.ts
───────────────────────────

import { IPoolPort } from '../ports/ICompliancePort';
import { Pool } from '../domain/Compliance';

export async function createPool(
  port: IPoolPort,
  year: number,
  members: { shipId: string; cb: number }[]
): Promise<Pool> {
  return port.createPool(year, members);
}

───────────────────────────
/shared/constants.ts
───────────────────────────

export const TARGET_GHG_INTENSITY = 89.3368; // gCO₂e/MJ
export const VESSEL_TYPES = ['All', 'Container', 'BulkCarrier', 'Tanker', 'RoRo'] as const;
export const FUEL_TYPES = ['All', 'HFO', 'LNG', 'MGO'] as const;
export const YEARS = ['All', 2024, 2025] as const;
```

### PROMPT 6.2 - Frontend: API client and React context

```Implement the infrastructure adapter and React context in /frontend/src/adapters/.

───────────────────────────
/adapters/infrastructure/api/apiClient.ts
───────────────────────────

import axios from 'axios';
import { IRoutePort } from '@core/ports/IRoutePort';
import { ICompliancePort, IBankingPort, IPoolPort } from '@core/ports/ICompliancePort';
import { Route, RouteFilters } from '@core/domain/Route';
import { ComparisonResult } from '@core/domain/Comparison';
import { BankEntry, BankingResult, Pool } from '@core/domain/Compliance';

// Use /api prefix — proxied to backend by Vite
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor for error handling
http.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

export class RouteApiAdapter implements IRoutePort {
  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, v]) => v !== undefined && v !== 'All')
    );
    const { data } = await http.get('/routes', { params });
    return data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await http.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult> {
    const { data } = await http.get('/routes/comparison');
    return data;
  }
}

export class ComplianceApiAdapter implements ICompliancePort {
  async getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }> {
    const { data } = await http.get('/compliance/cb', { params: { shipId, year } });
    return data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number; rawCb: number }> {
    const { data } = await http.get('/compliance/adjusted-cb', { params: { shipId, year } });
    return data;
  }
}

export class BankingApiAdapter implements IBankingPort {
  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const { data } = await http.get('/banking/records', { params: { shipId, year } });
    return data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const { data } = await http.post('/banking/bank', { shipId, year, amount });
    return data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const { data } = await http.post('/banking/apply', { shipId, year, amount });
    return data;
  }
}

export class PoolApiAdapter implements IPoolPort {
  async createPool(year: number, members: { shipId: string; cb: number }[]): Promise<Pool> {
    const { data } = await http.post('/pools', { year, members });
    return data;
  }
}

───────────────────────────
/adapters/infrastructure/api/ApiContext.tsx
───────────────────────────

import React, { createContext, useContext } from 'react';
import { IRoutePort } from '@core/ports/IRoutePort';
import { ICompliancePort, IBankingPort, IPoolPort } from '@core/ports/ICompliancePort';
import {
  RouteApiAdapter,
  ComplianceApiAdapter,
  BankingApiAdapter,
  PoolApiAdapter,
} from './apiClient';

interface ApiContextValue {
  routePort: IRoutePort;
  compliancePort: ICompliancePort;
  bankingPort: IBankingPort;
  poolPort: IPoolPort;
}

const ApiContext = createContext<ApiContextValue | null>(null);

const adapters: ApiContextValue = {
  routePort: new RouteApiAdapter(),
  compliancePort: new ComplianceApiAdapter(),
  bankingPort: new BankingApiAdapter(),
  poolPort: new PoolApiAdapter(),
};

export function ApiProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <ApiContext.Provider value={adapters}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside <ApiProvider>');
  return ctx;
}

───────────────────────────
/adapters/ui/hooks/useRoutesHook.ts
───────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@adapters/infrastructure/api/ApiContext';
import { Route, RouteFilters } from '@core/domain/Route';

export function useRoutes() {
  const { routePort } = useApi();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routePort.getRoutes(filters);
      setRoutes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, [routePort, filters]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const handleSetBaseline = useCallback(async (routeId: string) => {
    try {
      await routePort.setBaseline(routeId);
      await fetchRoutes();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to set baseline');
    }
  }, [routePort, fetchRoutes]);

  return { routes, loading, error, filters, setFilters, setBaseline: handleSetBaseline, refresh: fetchRoutes };
}

───────────────────────────
/adapters/ui/hooks/useComparisonHook.ts
───────────────────────────

useState + useEffect fetching routePort.getComparison() on mount.
Return { baseline, comparisons, loading, error }.

───────────────────────────
/adapters/ui/hooks/useBankingHook.ts
───────────────────────────

Accept shipId and year as parameters.
useState for cb, energyMj, records, loading, error, actionResult.
useEffect fetches CB and records when shipId/year change.
Expose: bankSurplus(amount), applyBanked(amount) — each refreshes CB after action.
Return all state + actions.

───────────────────────────
/adapters/ui/hooks/usePoolHook.ts
───────────────────────────

useState for members (array of {shipId, cb}), poolResult, loading, error.
Derived: poolSum = members.reduce((s,m) => s + m.cb, 0)
Derived: isValid = poolSum >= 0 && members.length >= 2
Expose: addMember(shipId, cb), removeMember(shipId), createPool(year).
Return all state + derived + actions.
```

### PROMPT 7.1 - Frontend: Shared components and App shell

```Build shared UI components and the App shell in /frontend/src/.

───────────────────────────
/adapters/ui/components/shared/LoadingSpinner.tsx
───────────────────────────

A simple centered spinner using TailwindCSS animate-spin.
No props needed.

───────────────────────────
/adapters/ui/components/shared/ErrorBanner.tsx
───────────────────────────

Props: { message: string; onDismiss?: () => void }
Red alert bar with an X button if onDismiss is provided.
Use Tailwind: bg-red-50 border border-red-200 text-red-800 rounded-lg p-4.

───────────────────────────
/adapters/ui/components/shared/KPICard.tsx
───────────────────────────

Props: { label: string; value: string | number; unit?: string; variant?: 'default' | 'success' | 'danger' | 'warning' }
A card showing label above, large value, and optional unit suffix.
variant='success' → green border + text, 'danger' → red, 'warning' → amber.

───────────────────────────
/adapters/ui/components/shared/Badge.tsx
───────────────────────────

Props: { compliant: boolean }
Show ✅ Compliant (green pill) or ❌ Non-compliant (red pill).

───────────────────────────
/adapters/ui/components/shared/TabNav.tsx
───────────────────────────

Props: { tabs: string[]; active: string; onChange: (tab: string) => void }
Horizontal tab bar. Active tab: border-b-2 border-blue-600 text-blue-600.
Inactive: text-gray-500 hover:text-gray-700.

───────────────────────────
/src/App.tsx
───────────────────────────

import { useState } from 'react';
import { ApiProvider } from '@adapters/infrastructure/api/ApiContext';
import TabNav from '@adapters/ui/components/shared/TabNav';
import RoutesTab from '@adapters/ui/components/RoutesTab';
import CompareTab from '@adapters/ui/components/CompareTab';
import BankingTab from '@adapters/ui/components/BankingTab';
import PoolingTab from '@adapters/ui/components/PoolingTab';

const TABS = ['Routes', 'Compare', 'Banking', 'Pooling'];

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState('Routes');
  return (
    <ApiProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">FuelEU Maritime Dashboard</h1>
          <p className="text-sm text-gray-500">Compliance Balance · Banking · Pooling</p>
        </header>
        <div className="bg-white border-b border-gray-200 px-6">
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
        <main className="px-6 py-6">
          {activeTab === 'Routes'  && <RoutesTab />}
          {activeTab === 'Compare' && <CompareTab />}
          {activeTab === 'Banking' && <BankingTab />}
          {activeTab === 'Pooling' && <PoolingTab />}
        </main>
      </div>
    </ApiProvider>
  );
}

───────────────────────────
/src/main.tsx
───────────────────────────

Standard Vite React entry point. Import index.css with Tailwind directives.
Create /src/index.css with @tailwind base; @tailwind components; @tailwind utilities;
```

### PROMPT 7.2 - Frontend: Routes Tab

```Build /frontend/src/adapters/ui/components/RoutesTab.tsx

Use the useRoutes() hook. All styling via TailwindCSS only.

LAYOUT:
  1. Page title row: "Routes" heading + subtitle "FuelEU route data"
  2. Filter row: three <select> dropdowns side by side:
     - Vessel Type: All | Container | BulkCarrier | Tanker | RoRo
     - Fuel Type:   All | HFO | LNG | MGO
     - Year:        All | 2024 | 2025
     When a filter changes, call setFilters() immediately (live filtering).
  3. Loading state: show <LoadingSpinner /> centered
  4. Error state: show <ErrorBanner message={error} />
  5. Data table (horizontal scroll wrapper for mobile):
     Columns: Route ID | Vessel Type | Fuel Type | Year |
              GHG Intensity (gCO₂e/MJ) | Fuel Consumption (t) |
              Distance (km) | Total Emissions (t) | Action
     
     Row styling:
       - Baseline row: bg-blue-50 with a "Baseline" badge in the Route ID cell
       - Non-baseline rows: white/gray alternating
     
     Action column per row:
       - If isBaseline: show a "✓ Baseline" gray pill (disabled, no click)
       - If not baseline: show "Set Baseline" button (blue, onClick calls setBaseline(route.routeId))
       - Show loading state on the button while the action is pending

TYPES:
  Use the Route interface from @core/domain/Route.
  Import VESSEL_TYPES, FUEL_TYPES, YEARS from @shared/constants.
```

### PROMPT 7.3 - Frontend: Compare Tab

```Build /frontend/src/adapters/ui/components/CompareTab.tsx

Use the useComparison() hook. Import BarChart, Bar, XAxis, YAxis, Tooltip, 
ReferenceLine, ResponsiveContainer, Cell from 'recharts'.

LAYOUT:

  1. Loading / error states at top

  2. Baseline info card (when data loaded):
     Show a highlighted card (blue border) with:
       - "Baseline Route" label
       - Route ID, Vessel Type, Fuel Type, Year
       - GHG Intensity: X.XXXX gCO₂e/MJ
       - Target: 89.3368 gCO₂e/MJ
       - Status: ✅ Compliant or ❌ Non-compliant (compare baseline.ghgIntensity to 89.3368)

  3. Bar chart (recharts ResponsiveContainer height=300):
     - Data: [baseline, ...comparisons] all in one array
       Each item: { name: routeId, ghg: ghgIntensity }
     - Bar fill: blue (#3B82F6) for baseline, teal (#14B8A6) for others
       Use Cell from recharts to apply per-bar color
     - ReferenceLine y={89.3368} stroke="#EF4444" strokeDasharray="4 4" 
       label={{ value: 'Target 89.34', fill: '#EF4444', fontSize: 12 }}
     - XAxis dataKey="name", YAxis domain={[85, 96]} label="gCO₂e/MJ"
     - Tooltip formatter: (value) => [`${value} gCO₂e/MJ`, 'GHG Intensity']

  4. Comparison table:
     Columns: Route ID | GHG Intensity | vs Baseline (%) | Compliant
     
     - GHG Intensity: format to 4 decimal places
     - vs Baseline: format as "+X.XX%" or "-X.XX%" (red if positive = worse, green if negative = better)
     - Compliant: use <Badge compliant={...} />
     - Table header shows baseline row first (highlighted blue) then comparisons

FORMULA REMINDER (computed by backend, just display):
  percentDiff = ((comparison / baseline) - 1) * 100
```

### PROMPT 7.4 - Frontend: Banking Tab

```Build /frontend/src/adapters/ui/components/BankingTab.tsx

Implements FuelEU Article 20 — Banking.

STATE:
  - shipId: string (input), year: number (input), loaded: boolean
  - Use useBanking(shipId, year) hook when loaded=true

LAYOUT:

  1. Page header: "Banking" title + "FuelEU Article 20 — Banking" subtitle in gray

  2. Ship selector form (shown always):
     - Row: "Ship ID" text input + "Year" number input + "Load" button
     - On Load click: set loaded=true (triggers hook to fetch CB)
     - Input placeholder: "e.g. R002"

  3. When loaded=true and data available, show:

     A. KPI row (3 cards side by side):
        - "Current CB" : value with color (green if > 0, red if < 0, gray if 0)
          Unit: tCO₂e  variant based on value
        - "Energy in Scope": energyMj formatted as "X.XXM MJ"
        - "Status": "Surplus" (green) or "Deficit" (red) based on CB sign

     B. "Bank Surplus" section (Article 20.1):
        - Small section heading
        - Amount input (number, pre-filled with Math.max(0, cb) when CB loads)
        - "Bank Surplus" button:
            disabled={cb <= 0 || !amount || amount <= 0}
            When disabled, show tooltip: "CB must be positive to bank"
        - On success: show result KPI row: cb_before | banked | cb_after

     C. "Apply Banked Surplus" section (Article 20.2):
        - Amount input (number)
        - "Apply to Deficit" button:
            disabled={availableBanked <= 0}
            "Available banked: X.XX tCO₂e" shown beneath
        - On success: show result KPI row: cb_before | applied | cb_after

     D. Error banner if any action fails

  4. Loading states: show spinner while fetching CB, show button loading state during actions
```

### PROMPT 7.5 - Frontend:  Pooling Tab

```Build /frontend/src/adapters/ui/components/PoolingTab.tsx

Implements FuelEU Article 21 — Pooling.

STATE: Use usePool() hook.

LAYOUT:

  1. Page header: "Pooling" title + "FuelEU Article 21 — Pooling" subtitle

  2. Year selector: number input labeled "Pool Year" (default 2025)

  3. "Add Member" form row:
     - Ship ID text input + CB value number input (allow negative) + "Add Member" button
     - Validate: shipId not empty, cb is a valid number
     - Prevent adding duplicate shipId
     - "Add Member" button disabled after pool is created

  4. Members table (shown when members.length > 0):
     Columns: Ship ID | CB Before | CB After | Action
     - CB Before: the input value, colored red if negative, green if positive
     - CB After: shown as "—" before pool creation, filled after
     - CB After coloring: red if negative, green if positive
     - Action: "Remove" button (disabled after pool is created)

  5. Pool summary bar (always visible when members.length > 0):
     Full-width bar showing:
       "Pool Sum CB: X.XX tCO₂e"
       If poolSum >= 0: green background (bg-green-50 border-green-200 text-green-800)
       If poolSum < 0:  red background (bg-red-50 border-red-200 text-red-800)
       Status text: "✓ Valid pool" or "✗ Invalid — pool sum must be ≥ 0"

  6. "Create Pool" button:
     disabled={!isValid || loading || poolCreated}
     "Create Pool" (primary blue button, full-width on mobile)
     Show tooltip text when disabled: reason from validatePool()

  7. On success: 
     - Show green success banner: "Pool created · ID: {pool.id}"
     - Fill in CB After column in table
     - Lock all form inputs (pool is immutable after creation)

  8. Error banner on API failure

IMPORTANT: Import validatePool from @core/domain — reuse the same pure function for
  client-side validation before even calling the API. This ensures the button disables
  in real-time as members are added/removed.
```

