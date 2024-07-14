import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): object;
}

// Custom function as decorator instead of UseInterceptors decorator in controller
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //? running anything before req handeled

    return next.handle().pipe(
      //? running anything before response is sentout

      map((data: any) => {
        //! thats because custom features and task.dto
        if (
          data &&
          typeof data === 'object' &&
          'tasks' in data &&
          'total' in data
        ) {
          return {
            tasks: data.tasks.map((data) =>
              plainToClass(this.dto, data, { excludeExtraneousValues: true }),
            ),
            total: data.total,
          };
        } else {
          return plainToClass(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
