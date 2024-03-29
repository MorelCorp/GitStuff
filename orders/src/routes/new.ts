import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@morelcorp_learn/common';
import { body } from 'express-validator';
import { Stuff } from '../models/stuff';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

// const EXPIRATION_WINDOW_SECONDS = 15 * 60; //this should probably be in environment k8s variable or something but here is good enough for now...
const EXPIRATION_WINDOW_SECONDS = 60; //this should probably be in environment k8s variable or something but here is good enough for now...

router.post(
  '/api/orders',
  requireAuth,
  [
    body('stuffId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) ///this validation introduces some coupling between stuff service db type and order service (not super cool)
      .withMessage('StuffId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { stuffId } = req.body;

    // Find the stuff the user wants to order in the database
    const stuff = await Stuff.findById(stuffId);
    if (!stuff) {
      throw new NotFoundError();
    }

    // make sure this stuff is not already reserved
    const isReserved = await stuff.isReserved();
    if (isReserved) {
      throw new BadRequestError('Stuff is already reserved');
    }

    //calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      stuff,
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      stuff: {
        id: stuff.id,
        price: stuff.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
