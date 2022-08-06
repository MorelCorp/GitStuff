import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { StuffCreatedEvent } from './stuff-created-event';

export class StuffCreatedListener extends Listener<StuffCreatedEvent> {
  subject: Subjects.StuffCreated = Subjects.StuffCreated;
  queueGroupName = 'payment-service';
  onMessage(data: StuffCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
