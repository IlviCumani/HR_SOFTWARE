import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DayOff extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: string;

  @Prop()
  EmployeeName: string;

  @Prop({ required: true })
  StartTime: Date;

  @Prop()
  EndTime?: Date;

  @Prop({
    enum: ['annual', 'sick', 'other'],
  })
  leaveType: string;

  @Prop()
  totalDays: number;

  @Prop()
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop()
  approvedDate: Date;

  createdAt: Date;
}

export const DayOffSchema = SchemaFactory.createForClass(DayOff);
