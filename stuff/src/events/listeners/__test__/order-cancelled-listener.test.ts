import { OrderCancelledEvent, OrderStatus } from '@morelcorp_learn/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Stuff } from '../../../models/stuff';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //create and save

  const orderId = mongoose.Types.ObjectId().toHexString();

  const stuff = Stuff.build({
    title: 'concert',
    price: 99,
    description: '',
    userId: 'asf',
  });
  stuff.set({ orderId: orderId });
  await stuff.save();

  //create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    stuff: {
      id: stuff.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, stuff, orderId, listener };
};

it('updates the stuff, publishes an event, and acks the message', async () => {
  const { msg, data, stuff, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedStuff = await Stuff.findById(stuff.id);

  expect(updatedStuff!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
