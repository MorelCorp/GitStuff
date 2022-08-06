import { Subjects } from './subjects';

export interface StuffUpdatedEvent {
  subject: Subjects.StuffUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    description: string;
    userId: string;
    version: number;
    orderId?: string;
  };
}
