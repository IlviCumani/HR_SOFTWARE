import { Prop, Schema } from '@nestjs/mongoose';
import { IsOptional, Matches } from 'class-validator';

@Schema()
export class LeftDto {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @Matches(/^\d{10}$/, { message: 'nID must be exactly 10 digits' })
  nID: string;

  @Prop()
  position: string;

  @Prop()
  startingDate: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  @IsOptional()
  teamLeader: string;

  @Prop({
    enum: ['Female', 'Male'],
  })
  gender: string;

  @Prop()
  salary: number;

  @Prop()
  contract: string;

  @Prop()
  daletedAt: string;
}
