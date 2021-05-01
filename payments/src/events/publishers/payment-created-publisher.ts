import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@morelcorp_learn/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
