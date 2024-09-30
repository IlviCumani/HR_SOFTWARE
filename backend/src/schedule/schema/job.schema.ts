import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ScheduleJob extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  step: string;

  @Prop({ required: true, default: 'active' })
  status: string;

  @Prop({ type: [Date], default: [] })
  executionHistory: Date[];
}

export const ScheduleJobSchema = SchemaFactory.createForClass(ScheduleJob);
