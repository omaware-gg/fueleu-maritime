import { Router, Request, Response } from 'express';
import { IRouteService } from '@core/ports/inbound/IRouteService';

export function createRoutesRouter(routeService: IRouteService): Router {
  const router = Router();

  router.get('/comparison', async (_req: Request, res: Response) => {
    try {
      const result = await routeService.getComparison();
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const filters = {
        vesselType: req.query.vesselType as string | undefined,
        fuelType: req.query.fuelType as string | undefined,
        year: req.query.year ? Number(req.query.year) : undefined,
      };
      const routes = await routeService.getAllRoutes(filters);
      res.json(routes);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/baseline', async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      await routeService.setBaseline(id);
      res.json({ message: `Route ${id} set as baseline` });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
