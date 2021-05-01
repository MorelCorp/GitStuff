import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@morelcorp_learn/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
