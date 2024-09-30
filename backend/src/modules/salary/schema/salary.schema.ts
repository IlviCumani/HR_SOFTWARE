import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import * as muv from 'mongoose-unique-validator';
import { Bonus, BonusSchema } from './bonus.schema';

@Schema({ timestamps: true })
export class Salary extends Document {
  @Prop({ required: true, ref: 'Employee' })
  employeeID: Types.ObjectId;

  @Prop({ required: true, type: Date })
  dateTaken: Date;

  @Prop({ required: true })
  netSalary: number;

  @Prop({ required: true })
  workDays: number;

  @Prop()
  incomeTax?: number;

  @Prop({ type: [BonusSchema], required: true })
  bonuses?: Bonus[];

  @Prop({ required: true })
  socialSecurityContributions: number;

  @Prop({ required: true })
  healthInsurance: number;

  @Prop({ required: true })
  socialInsuranceCompany: number;

  @Prop({ required: true })
  healthInsuranceCompany: number;

  @Prop({ required: true })
  grossSalary: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, default: false, type: Boolean })
  paid?: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;
}

const SalarySchema = SchemaFactory.createForClass(Salary);

SalarySchema.index({ employeeID: 1, dateTaken: 1 }, { unique: true });

SalarySchema.plugin(muv, {
  message: 'Error, expected {employeeID, dateTaken} to be unique.',
});

export { SalarySchema };
