import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'events' })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  afterInit(server: any) {
    Logger.log('Sockets: ready to handle connections', MessageGateway.name);
  }
}
