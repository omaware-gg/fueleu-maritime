import { Router, Request, Response } from 'express';
import { IPoolService } from '@core/ports/inbound/IPoolService';

export function createPoolsRouter(poolService: IPoolService): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;

      if (!year) {
        return res.status(400).json({ error: 'year is required' });
      }
      if (!Array.isArray(members) || members.length < 2) {
        return res.status(400).json({ error: 'members must be an array with at least 2 items' });
      }

      const pool = await poolService.createPool(Number(year), members);
      res.status(201).json(pool);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
