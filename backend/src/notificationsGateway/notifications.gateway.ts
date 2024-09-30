import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendNotification(message: string, payload: any) {
    const eventNotification = this.server.emit('newEventCreated', {
      message,
      contenct: payload,
    });
    return eventNotification;
  }

  notifyDueDayTask(message: string, payload: any) {
    const eventNotification = this.server.emit('taskDueDay', {
      message,
      contenct: payload,
    });
    return eventNotification;
  }

  @SubscribeMessage('eventCreated')
  handleEventCreated(@MessageBody() payload: any): void {
    console.log(payload, 'payloaddd');
    this.server.emit('notification', {
      message: 'New Event Created',
      content: payload,
    });
  }
}
