import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  sender: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  receiver: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
