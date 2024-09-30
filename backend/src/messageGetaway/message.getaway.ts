import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/chat/schema/chat.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private activeUsers = new Set<string>();

  afterInit(server: Server) {
    console.log('WebSocket Server Initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.add(userId);
      console.log(`Client connected: ${userId}, Socket ID: ${client.id}`);
    } else {
      console.log(`Client connected without userId, Socket ID: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`Client disconnected: ${userId}, Socket ID: ${client.id}`);
    } else {
      console.log(`Client disconnected: Unknown user, Socket ID: ${client.id}`);
    }
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody()
    client: Socket,
    payload: { receiver: string; content: string; sender: string },
  ) {
    const sender = payload.sender;
    console.log(client, 'clientIDDD')

    if (!sender || !payload.receiver) {
      console.log('Message must have a valid sender and receiver');
      return;
    }

    console.log(
      `Message from ${sender} to ${payload.receiver}: ${payload.content}`,
    );

    this.server.to(payload.receiver).emit('message', { sender, ...payload });
  }

}
