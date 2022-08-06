import { OrderCreatedEvent, OrderStatus } from '@morelcorp_learn/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Stuff } from '../../../models/stuff';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save
  const stuff = Stuff.build({
    title: 'concert',
    price: 99,
    description: '',
    userId: 'asf',
  });
  await stuff.save();

  //create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'asdfasdf',
    version: 0,
    expiresAt: 'asdfasdf',
    stuff: {
      id: stuff.id,
      price: stuff.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, stuff, data, msg };
};

it('sets the userId of the stuff', async () => {
  const { listener, stuff, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedStuff = await Stuff.findById(stuff.id);

  expect(updatedStuff!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, stuff, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a stuff updated event', async () => {
  const { listener, stuff, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const stuffUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(stuffUpdatedData.orderId);
});
