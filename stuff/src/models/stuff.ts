import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StuffAttrs {
  title: string;
  price: number;
  description: string;
  userId: string;
}

interface StuffDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  description: string;
  version: number;
  orderId?: string;
}

interface StuffModel extends mongoose.Model<StuffDoc> {
  build(attrs: StuffAttrs): StuffDoc;
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
    },
    description: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

stuffSchema.statics.build = (attrs: StuffAttrs) => {
  return new Stuff(attrs);
};

const Stuff = mongoose.model<StuffDoc, StuffModel>('Stuff', stuffSchema);

export { Stuff };
