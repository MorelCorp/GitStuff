import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Stuff } from '../../models/stuff';
import { natsWrapper } from '../../nats-wrapper';

it('return an error if stuff does not exist', async () => {
  const stuffId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ stuffId })
    .expect(404);
});

it('returns an error if the stuff is already reserved', async () => {
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  const order = Order.build({
    stuff,
    userId: 'asdfasdfasdfa',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ stuffId: stuff.id })
    .expect(400);
});

it('reserves a stuff', async () => {
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ stuffId: stuff.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ stuffId: stuff.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
