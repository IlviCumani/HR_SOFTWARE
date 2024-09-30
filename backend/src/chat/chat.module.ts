import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/messageGetaway/message.getaway';

@Module({
  providers: [ChatGateway], 
})
export class ChatModule {}
