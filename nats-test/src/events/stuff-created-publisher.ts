import { Publisher } from './base-publisher';
import { Subjects } from './subjects';
import { StuffCreatedEvent } from './stuff-created-event';

export class StuffCreatedPublisher extends Publisher<StuffCreatedEvent> {
  subject: Subjects.StuffCreated = Subjects.StuffCreated;
}
