import request from 'supertest';
import { app } from '../../app';
import { Stuff } from '../../models/stuff';
import { OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
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

  //make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // //fetch the deleted order and check status
  const { body: cancelledOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
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

  //make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
