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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: any) {
    Logger.log('Sockets: ready to handle connections', MessageGateway.name);
  }
}
