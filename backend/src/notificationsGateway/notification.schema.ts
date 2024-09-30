import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum NotificationStatus {
  NOTIFICATION = 'notification',
  REMINDER = 'reminder',
}

@Schema()
export class Notifications extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  path: string;

  @Prop()
  reminderTitle?: string;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.NOTIFICATION })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notifications);
