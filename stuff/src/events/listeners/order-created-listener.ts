import { Listener, OrderCreatedEvent, Subjects } from '@morelcorp_learn/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Stuff } from '../../models/stuff';
import { StuffUpdatedPublisher } from '../publishers/stuff-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the stuff that the order is reserving
    const stuff = await Stuff.findById(data.stuff.id);

    // if no stuff, throw error
    if (!stuff) {
      throw new Error('Stuff not found');
    }

    // mark the stuff as being reserved by setting its orderId property
    stuff.set({ orderId: data.id });

    //save the stuff
    await stuff.save();
    await new StuffUpdatedPublisher(this.client).publish({
      id: stuff.id,
      price: stuff.price,
      title: stuff.title,
      description: stuff.description,
      userId: stuff.userId,
      orderId: stuff.orderId,
      version: stuff.version,
    });

    //ack the message
    msg.ack();
  }
}
