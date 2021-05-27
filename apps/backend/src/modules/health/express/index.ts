import { Router } from 'express';
import type { Application } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    data: {
      api: 'healthy',
    },
  });
});

export function useHealthRouter(app: Application): void {
  app.use('/v0/health', router);
  app.use('/health', router);
}
