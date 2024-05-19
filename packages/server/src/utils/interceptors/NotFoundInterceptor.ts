import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(private readonly msg?: string) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(tap(data => {
        if (isNullOrUndefined(data) || isObjectWithDataNullOrUndefined(data))
          throw new NotFoundException(this.msg ?? "Resource not found");
      } ));
  }
}

function isNullOrUndefined(value: unknown): boolean {
  return value === undefined || value === null;
}

function isObjectWithDataNullOrUndefined(value: NonNullable<unknown>): boolean {
  return typeof value === "object" && "data" in value && isNullOrUndefined(value.data);
}
