import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Interview } from './interview.schema';
export enum RecruitmentStage {
  Applied = 'Applied',
  FirstInterview = '1st Interview',
  SecondInterview = '2nd Interview',
  OfferMade = 'Offer Made',
  Hired = 'Hired',
  Rejected = 'Rejected',
}
export enum ContractTypes {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Temporary = 'Temporary',
  Internship = 'Internship',
  Seasonal = 'Seasonal',
  FixedTerm = 'Fixed Term',
  Indefinite = 'Indefinite',
  Freelance = 'Freelance',
  Remote = 'Remote',
  Apprenticeship = 'Apprenticeship',
}
@Schema()
export class OfferMade {
  @Prop({ required: true })
  offeredSalary: number;

  @Prop({ required: true, enum: ContractTypes })
  contractType: ContractTypes;

  @Prop({ required: true, type: Date })
  startDate: Date;
}

@Schema()
export class Recruitment extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  position: string;

  @Prop({
    required: true,
    enum: RecruitmentStage,
    default: RecruitmentStage.Applied,
  })
  stage: string;

  @Prop({ type: Interview })
  firstInterview?: Interview;

  @Prop({ type: Interview })
  secondInterview?: Interview;

  @Prop({ type: OfferMade })
  offerMade?: OfferMade;
  @Prop()
  reference: string;

  @Prop()
  cv: string;

  @Prop()
  submittedDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;

  @Prop()
  rejectReason?: string;

  @Prop({ required: false, ref: 'Events' })
  eventID?: Types.ObjectId;
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment);
