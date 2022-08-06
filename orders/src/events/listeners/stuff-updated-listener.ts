import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  StuffUpdatedEvent,
  StuffCreatedEvent,
} from '@morelcorp_learn/common';
import { Stuff } from '../../models/stuff';
import { queueGroupName } from './queue-group-name';
import { StuffCreatedListener } from './stuff-created-listener';

export class StuffUpdatedListener extends Listener<StuffUpdatedEvent> {
  subject: Subjects.StuffUpdated = Subjects.StuffUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: StuffCreatedEvent['data'], msg: Message) {
    const stuff = await Stuff.findByEvent(data);

    if (!stuff) {
      throw new Error('Stuff not found');
    }

    const { title, price } = data;
    stuff.set({ title, price });
    await stuff.save();

    msg.ack();
  }
}
