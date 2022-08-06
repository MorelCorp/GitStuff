import request from 'supertest';
import { app } from '../../app';
import { createStuffRouter } from '../new';

const createStuff = () => {
  return request(app).post('/api/stuff').set('Cookie', global.signin()).send({
    title: 'asdffgasdfasd',
    price: 20,
    description: 'so described!',
  });
};

it('can fetch a list of stuff', async () => {
  await createStuff();
  await createStuff();
  await createStuff();

  const response = await request(app).get('/api/stuff').send().expect(200);

  expect(response.body.length).toEqual(3);
});
