import mongoose, { mongo } from 'mongoose';
import { OrderStatus } from '@morelcorp_learn/common';
import { StuffDoc } from './stuff';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  stuff: StuffDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  stuff: StuffDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    stuff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stuff',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
export { OrderStatus }; //this will make it easier to import all order related stuff from one file...
