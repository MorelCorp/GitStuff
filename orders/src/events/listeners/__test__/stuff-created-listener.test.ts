import { StuffCreatedEvent } from '@morelcorp_learn/common';
import { StuffCreatedListener } from '../stuff-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Stuff } from '../../../models/stuff';

const setup = async () => {
  //create an instance of the listener
  const listener = new StuffCreatedListener(natsWrapper.client);

  //create a fake data event
  const data: StuffCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    description: 'so much noize!',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a stuff', async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object + nessage object
  await listener.onMessage(data, msg);

  //write assertions to make sure a stuff was created!
  const stuff = await Stuff.findById(data.id);

  expect(stuff).toBeDefined();
  expect(stuff!.title).toEqual(data.title);
  expect(stuff!.price).toEqual(data.price);
});

it('acts the message', async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object + nessage object
  await listener.onMessage(data, msg);

  //write assertions to make sure ack functions is called
  expect(msg.ack).toHaveBeenCalled();
});
