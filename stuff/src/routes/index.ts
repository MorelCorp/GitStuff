import express, { Request, Response } from 'express';
import { Stuff } from '../models/stuff';

const router = express.Router();

router.get('/api/stuff', async (req: Request, res: Response) => {
  const stuff = await Stuff.find({
    orderId: undefined,
  });

  res.send(stuff);
});

export { router as indexStuffRouter };
