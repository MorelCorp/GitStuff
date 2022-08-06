import {
  Publisher,
  Subjects,
  StuffUpdatedEvent,
} from '@morelcorp_learn/common';
import { natsWrapper } from '../../nats-wrapper';

export class StuffUpdatedPublisher extends Publisher<StuffUpdatedEvent> {
  subject: Subjects.StuffUpdated = Subjects.StuffUpdated;
}
