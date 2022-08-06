import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Stuff } from '../../models/stuff';
import mongoose from 'mongoose';

const buildStuff = async () => {
  const stuff = Stuff.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await stuff.save();
  return stuff;
};

it('fetches order for a particular user', async () => {
  //create 3 stuff
  const stuffOne = await buildStuff();
  const stuffTwo = await buildStuff();
  const stuffThree = await buildStuff();

  const userOne = global.signin();
  const userTwo = global.signin();
  // create one order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ stuffId: stuffOne.id })
    .expect(201);

  // create 2 orders as user #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ stuffId: stuffTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ stuffId: stuffThree.id })
    .expect(201);

  // make request to get orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  //make sure we only get user #2 orders
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);

  expect(response.body[0].stuff.id).toEqual(stuffTwo.id);
  expect(response.body[1].stuff.id).toEqual(stuffThree.id);
});
