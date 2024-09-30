import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateMessageDto } from './dto/message.dto';
import { MessageService } from './chat.service';


@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    console.log('Received message to send:', createMessageDto);
    return this.messageService.sendMessage(createMessageDto);
  }

  @Get('/:sender/:receiver')
  async getMessages(
    @Param('sender') sender: string,
    @Param('receiver') receiver: string,
  ) {
    console.log(`Fetching messages between ${sender} and ${receiver}`); 
    return this.messageService.getMessages(sender, receiver);
  }
}
