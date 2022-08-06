import express, { Request, Response } from 'express';
import { Stuff } from '../models/stuff';
import { NotFoundError } from '@morelcorp_learn/common';

const router = express.Router();

router.get('/api/stuff/:id', async (req: Request, res: Response) => {
  const stuff = await Stuff.findById(req.params.id);

  if (!stuff) {
    throw new NotFoundError();
  }
  res.send(stuff);
});

export { router as showStuffRouter };
