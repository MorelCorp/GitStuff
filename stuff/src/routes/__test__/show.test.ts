import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the stuff is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/stuff/${id}`).send().expect(404);
});

it('returns a 404 if the stuff is not found', async () => {
  const title = 'Concert Stuff';
  const price = 20;
  const description = '';

  const response = await request(app)
    .post('/api/stuff')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
      description,
    })
    .expect(201);

  const stuffResponse = await request(app)
    .get(`/api/stuff/${response.body.id}`)
    .send()
    .expect(200);

  expect(stuffResponse.body.title).toEqual(title);
  expect(stuffResponse.body.price).toEqual(price);
});
