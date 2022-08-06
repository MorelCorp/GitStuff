import { Subjects } from './subjects';

export interface StuffCreatedEvent {
  subject: Subjects.StuffCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
