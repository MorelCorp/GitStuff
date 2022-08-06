import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@morelcorp_learn/common';
import { Stuff } from '../models/stuff';
import { StuffUpdatedPublisher } from '../events/publishers/stuff-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/stuff/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const stuff = await Stuff.findById(req.params.id);

    if (!stuff) {
      throw new NotFoundError();
    }

    if (stuff.orderId) {
      throw new BadRequestError('Cannot edit a reserved stuff');
    }

    if (stuff.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    stuff.set({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });
    await stuff.save();
    new StuffUpdatedPublisher(natsWrapper.client).publish({
      id: stuff.id,
      title: stuff.title,
      price: stuff.price,
      userId: stuff.userId,
      description: stuff.description,
      version: stuff.version,
    });

    res.send(stuff);
  }
);

export { router as updateStuffRouter };
