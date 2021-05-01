import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@morelcorp_learn/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
