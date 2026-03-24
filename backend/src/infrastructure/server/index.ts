import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { RouteRepository } from '@adapters/outbound/postgres/RouteRepository';
import { ComplianceRepository } from '@adapters/outbound/postgres/ComplianceRepository';
import { BankingRepository } from '@adapters/outbound/postgres/BankingRepository';
import { PoolRepository } from '@adapters/outbound/postgres/PoolRepository';

import { RouteUseCases } from '@core/application/use-cases/RouteUseCases';
import { ComplianceUseCases } from '@core/application/use-cases/ComplianceUseCases';
import { BankingUseCases } from '@core/application/use-cases/BankingUseCases';
import { PoolUseCases } from '@core/application/use-cases/PoolUseCases';

import { createRoutesRouter } from '@adapters/inbound/http/routes/routesRouter';
import { createComplianceRouter } from '@adapters/inbound/http/routes/complianceRouter';
import { createBankingRouter } from '@adapters/inbound/http/routes/bankingRouter';
import { createPoolsRouter } from '@adapters/inbound/http/routes/poolsRouter';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const routeRepo = new RouteRepository();
const complianceRepo = new ComplianceRepository();
const bankingRepo = new BankingRepository();
const poolRepo = new PoolRepository();

const routeService = new RouteUseCases(routeRepo);
const complianceService = new ComplianceUseCases(routeRepo, complianceRepo, bankingRepo);
const bankingService = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);
const poolService = new PoolUseCases(poolRepo);

app.use('/routes', createRoutesRouter(routeService));
app.use('/compliance', createComplianceRouter(complianceService));
app.use('/banking', createBankingRouter(bankingService));
app.use('/pools', createPoolsRouter(poolService));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT) || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FuelEU backend running on port ${PORT}`);
  });
}

export default app;
