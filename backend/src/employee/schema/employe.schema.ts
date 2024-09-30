import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Role } from 'src/users/schemas/user.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Promotion } from 'src/promotion/schema/promotion.schema';

export enum Position {
  JuniorFrontEnd = 'Junior FrontEnd',
  JuniorBackEnd = 'Junior BackEnd',
  SeniorFrontEnd = 'Senior FrontEnd',
  SeniorBackEnd = 'Senior BackEnd',
  FullStack = 'FullStack',
  DevOps = 'DevOps',
  ProjectManager = 'projectManager',
  HR = 'hr',
  CEO = 'ceo',
}

export enum EmploymentStatus {
  REMOTE = 'Remote',
  ONSITE = 'On Site',
}

@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  @Matches(/^[A-Z]\d{8}[A-Z]$/, { message: 'nID must be exactly 10 digits' })
  nID: string;

  @Prop()
  @IsEnum(Position)
  position: Position;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Promotion' }] })
  promotionHistory: Promotion[];

  @Prop({ type: String, enum: Role })
  @IsEnum(Role)
  role: Role;

  @Prop({ type: String, enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  status: string;

  @Prop()
  startingDate: Date;

  @Prop()
  phoneNumber: string;

  @Prop()
  profilePhoto: string;

  @Prop()
  fullName: string;

  @Prop()
  birthDay: Date;

  @Prop()
  @IsOptional()
  teamLeader: string;
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Promotion' }],
    default: [],
  })
  teamLeaders: MongooseSchema.Types.ObjectId[];

  @Prop({
    enum: ['Female', 'Male'],
  })
  gender: string;

  @Prop()
  salary: number;

  @Prop()
  @IsOptional()
  contract: string;

  @Prop({ default: false })
  deleteDate: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
