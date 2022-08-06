import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@morelcorp_learn/common';
import { Stuff } from '../models/stuff';
import { StuffCreatedPublisher } from '../events/publishers/stuff-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/stuff',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greated than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;

    const stuff = Stuff.build({
      title,
      price,
      description,
      userId: req.currentUser!.id,
    });
    await stuff.save();

    new StuffCreatedPublisher(natsWrapper.client).publish({
      id: stuff.id,
      title: stuff.title,
      price: stuff.price,
      userId: stuff.userId,
      description: stuff.description,
      version: stuff.version,
    });

    res.status(201).send(stuff);
  }
);

export { router as createStuffRouter };
