import { Prop, Schema } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { Types } from 'mongoose';

enum InterviewType {
  PhoneInterview = 'Phone Interview',
  VideoInterview = 'Video Interview',
  InPersonInterview = 'In-Person Interview',
  TechnicalInterview = 'Technical Interview',
  PanelInterview = 'Panel Interview',
  InformationalInterview = 'Informational Interview',
}

@Schema({ timestamps: true })
export class Interview {
  @Prop()
  date: Date;
  @Prop()
  @IsEnum(InterviewType)
  type: InterviewType;
  @Prop()
  notes: string;
  @Prop()
  evaluation: string;
  @Prop()
  interviewers: [{ type: Types.ObjectId; ref: 'Employee' }];
  @Prop({ default: false })
  notified: boolean;
}
