import { Message } from 'node-nats-streaming';
import { Subjects, Listener, StuffCreatedEvent } from '@morelcorp_learn/common';
import { Stuff } from '../../models/stuff';
import { queueGroupName } from './queue-group-name';

export class StuffCreatedListener extends Listener<StuffCreatedEvent> {
  subject: Subjects.StuffCreated = Subjects.StuffCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: StuffCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const stuff = Stuff.build({
      id,
      title,
      price,
    });
    await stuff.save();

    msg.ack();
  }
}
