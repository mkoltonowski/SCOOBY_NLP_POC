import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards/constants';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

type ErrorPayload = {
  isUnauthorizedError: boolean;
  status: string;
  message?: string;
  statusCode?: number;
  [key: string]: unknown;
};
@Catch(HttpException, WsException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;

    const { isUnauthorizedError, ...error } = this.getErrorPayload(exception);

    client.emit('exception', error);
    if (isUnauthorizedError) {
      client.disconnect(true);
    }
  }

  private getErrorPayload(
    exception: HttpException | WsException,
  ): ErrorPayload {
    const status = 'error';
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return {
        status: 'error',
        statusCode,
        message: exception.message,
        isUnauthorizedError: statusCode === HttpStatus.UNAUTHORIZED,
      };
    }

    const error = exception.getError();
    if (isObject(error)) {
      return {
        ...error,
        status,
        isUnauthorizedError: false,
      };
    }
    return {
      status,
      message: error,
      isUnauthorizedError: error === FORBIDDEN_MESSAGE,
    };
  }
}
