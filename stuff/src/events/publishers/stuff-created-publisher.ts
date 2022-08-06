import {
  Publisher,
  Subjects,
  StuffCreatedEvent,
} from '@morelcorp_learn/common';

export class StuffCreatedPublisher extends Publisher<StuffCreatedEvent> {
  subject: Subjects.StuffCreated = Subjects.StuffCreated;
}
