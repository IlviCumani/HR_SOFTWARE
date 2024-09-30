import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Matches } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import * as muv from 'mongoose-unique-validator';
import { Employee } from 'src/employee/schema/employe.schema';

export enum Role {
  Admin = 'admin',
  CEO = 'ceo',
  HR = 'hr',
  Employee = 'employee',
  Dev = 'dev',
  ProjectManager = 'projectManager',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  employID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role;

  @Prop()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'nID must be exactly 10 digits',
  })
  email: string;

  @Prop()
  loginRole: Role;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deleteDate: Date;

  @Prop({ required: false })
  refreshToken: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(muv, { message: 'Username must be unique' });
export { UserSchema };
