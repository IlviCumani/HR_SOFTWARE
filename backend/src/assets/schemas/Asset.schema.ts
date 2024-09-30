import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as muv from 'mongoose-unique-validator';

@Schema({ timestamps: true })
export class Asset extends Document {
  @Prop({ required: true, unique: true })
  assetName: string;

  @Prop()
  quantity: number;

  @Prop()
  reserved: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;
}

const AssetSchema = SchemaFactory.createForClass(Asset).plugin(muv);
export { AssetSchema };
