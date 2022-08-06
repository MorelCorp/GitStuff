import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StuffAttrs {
  id: string;
  title: string;
  price: number;
}

export interface StuffDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface StuffModel extends mongoose.Model<StuffDoc> {
  build(attrs: StuffAttrs): StuffDoc;
  findByEvent(event: { id: string; version: number }): Promise<StuffDoc | null>;
}

const stuffSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

stuffSchema.set('versionKey', 'version');
stuffSchema.plugin(updateIfCurrentPlugin);

stuffSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Stuff.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
stuffSchema.statics.build = (attrs: StuffAttrs) => {
  return new Stuff({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
stuffSchema.methods.isReserved = async function () {
  /// this === the stuff document that we just called 'isReserved' on

  const existingOrder = await Order.findOne({
    //@ts-ignore
    stuff: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Stuff = mongoose.model<StuffDoc, StuffModel>('Stuff', stuffSchema);

export { Stuff };
