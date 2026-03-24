# AI Agent Workflow Log

## Agents Used
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

