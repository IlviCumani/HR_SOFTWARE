import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString } from 'class-validator';
import { streetviewpublish_v1 } from 'googleapis';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Employee, Position } from 'src/employee/schema/employe.schema';

@Schema()
export class Promotion extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  employee: Employee;

  @Prop()
  employeeName: string;

  @Prop({type: String, required: true })
  oldPosition: Position;

  @Prop({type: String, required: true })
  newPosition: Position;

  @Prop({ required: true })
  oldSalary: number;

  @Prop({ required: true })
  newSalary: number;

  @Prop({ required: true })
  dateOfPromotion: string;

  @Prop({ required: true })
  trainedBy: string;

  @Prop({ default: false })
  isTeamLeader: boolean;

  @Prop()
  dateOfHire: string;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
