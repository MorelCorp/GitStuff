import request from 'supertest';
import { app } from '../../app';
import { Stuff } from '../../models/stuff';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  //create a stuff
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  const user = global.signin();
  //make a request to build an order with this stuff
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ stuffId: stuff.id })
    .expect(201);

  //make request to fetch order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  //create a stuff
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();

  const user = global.signin();
  //make a request to build an order with this stuff
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ stuffId: stuff.id })
    .expect(201);

  //make request to fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
