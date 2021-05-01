import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@morelcorp_learn/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
