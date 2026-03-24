import { Router, Request, Response } from 'express';
import { IBankingService } from '@core/ports/inbound/IBankingService';

export function createBankingRouter(bankingService: IBankingService): Router {
  const router = Router();

  router.get('/records', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string | undefined;
      const yearRaw = req.query.year as string | undefined;

      if (!shipId || !yearRaw) {
        return res.status(400).json({ error: 'shipId and year query params are required' });
      }

      const year = Number(yearRaw);
      const records = await bankingService.getRecords(shipId, year);
      res.json(records);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/bank', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || year === undefined || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }
      if (Number(amount) <= 0) {
        return res.status(400).json({ error: 'amount must be greater than 0' });
      }

      const result = await bankingService.bankSurplus(shipId, Number(year), Number(amount));
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/apply', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || year === undefined || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }
      if (Number(amount) <= 0) {
        return res.status(400).json({ error: 'amount must be greater than 0' });
      }

      const result = await bankingService.applyBanked(shipId, Number(year), Number(amount));
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
