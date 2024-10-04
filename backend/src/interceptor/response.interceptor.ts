import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path: url } = request;

    this.logger.debug(
      `${method} ${url}  ${context.getClass().name} Function: ${
        context.getHandler().name
      }  invoked...`,
    );

    return next.handle().pipe(
      map((response) => {
        // Modify response data here
        const message = response.message;
        delete response['message'];
        return { message, data: response };
      }),
    );
  }
}
