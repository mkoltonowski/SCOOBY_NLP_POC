import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { ErrorKey } from '../error';

const ERROR_ID_HEADER = 'error-id';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const errorId = uuidv4();

    AllExceptionFilter.logger.error(
      `Exception occurred. ErrorId: ${errorId}. Message: ${exception.message}`,
      exception.stack,
    );

    return response.header(ERROR_ID_HEADER, errorId).status(500).send({
      statusCode: 500,
      message: ErrorKey.COMMON.INTERNAL_SERVER_ERROR,
      errorId,
    });
  }
}
