import { CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AddStatusCodeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        return {
          statusCode,
          ...data,
        };
      } ),
    );
  }
}
