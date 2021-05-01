import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@morelcorp_learn/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
