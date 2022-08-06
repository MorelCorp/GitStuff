import { StuffUpdatedListener } from '../stuff-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Stuff } from '../../../models/stuff';
import mongoose from 'mongoose';
import { StuffUpdatedEvent } from '@morelcorp_learn/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //create a listener
  const listener = new StuffUpdatedListener(natsWrapper.client);

  //create and save a stuff
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  //create a fake data object
  const data: StuffUpdatedEvent['data'] = {
    id: stuff.id,
    version: stuff.version + 1,
    title: 'another title',
    price: 666,
    userId: '3214rasdffgd',
    description: 'so described',
  };

  //create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return all
  return { msg, data, stuff, listener };
};

it('finds, updates and saves a stuff', async () => {
  const { msg, data, stuff, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedStuff = await Stuff.findById(stuff.id);

  expect(updatedStuff!.title).toEqual(data.title);
  expect(updatedStuff!.price).toEqual(data.price);
  expect(updatedStuff!.version).toEqual(data.version);
});

it('calls ack', async () => {
  const { msg, data, stuff, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has a skipped version number', async () => {
  const { msg, data, stuff, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
