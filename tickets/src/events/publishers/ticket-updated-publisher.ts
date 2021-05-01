import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@morelcorp_learn/common';
import { natsWrapper } from '../../nats-wrapper';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
