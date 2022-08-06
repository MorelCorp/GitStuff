import { Subjects } from './subjects';

export interface StuffCreatedEvent {
  subject: Subjects.StuffCreated;
  data: {
    id: string;
    title: string;
    price: number;
    description: string;
    userId: string;
    version: number;
  };
}
