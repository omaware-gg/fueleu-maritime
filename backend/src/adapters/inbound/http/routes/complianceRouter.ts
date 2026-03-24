import { Router, Request, Response } from 'express';
import { IComplianceService } from '@core/ports/inbound/IComplianceService';

export function createComplianceRouter(complianceService: IComplianceService): Router {
  const router = Router();

  router.get('/cb', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string | undefined;
      const yearRaw = req.query.year as string | undefined;

      if (!shipId || !yearRaw) {
        return res.status(400).json({ error: 'shipId and year query params are required' });
      }

      const year = Number(yearRaw);
      const result = await complianceService.getCB(shipId, year);
      res.json({ shipId, year, ...result });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/adjusted-cb', async (req: Request, res: Response) => {
    try {
      const shipId = req.query.shipId as string | undefined;
      const yearRaw = req.query.year as string | undefined;

      if (!shipId || !yearRaw) {
        return res.status(400).json({ error: 'shipId and year query params are required' });
      }

      const year = Number(yearRaw);
      const result = await complianceService.getAdjustedCB(shipId, year);
      res.json({ shipId, year, ...result });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
