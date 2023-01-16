import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any) => ({
        isSuccessful: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data?.message || '',
        data: data,
      })),
    );
  }
}
