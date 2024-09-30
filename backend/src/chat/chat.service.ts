import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/chat.schema';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    console.log(message, 'ssssss');
    return message.save();
  }

  async getMessages(sender: string, receiver: string): Promise<Message[]> {
    return this.messageModel
      .find({ sender, receiver })
      .sort({ timestamp: 1 })
      .exec();
  }
}
