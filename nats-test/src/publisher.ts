import nats from 'node-nats-streaming';
import { StuffCreatedPublisher } from './events/stuff-created-publisher';

console.clear();

//ppl use stan (reverse nats) instead of client for the cool factor
const stan = nats.connect('gitstuff', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new StuffCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // // for (let index = 0; index < 4; index++) {
  // stan.publish('stuff:created', data, () => {
  //   console.log('  Event Published!');
  // });
  // // }
});
