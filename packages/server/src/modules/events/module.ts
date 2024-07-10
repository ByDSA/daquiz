import { DynamicModule, Global, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventDBEmitter } from "./EventDBEmitter";

@Global()
@Module( {
  imports: [
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [EventDBEmitter],
  exports: [EventDBEmitter],
} )
export class CustomEventEmitterModule {
  static forRoot(_config?: any): DynamicModule {
    return {
      module: CustomEventEmitterModule,
      providers: [
        {
          provide: EventDBEmitter,
          useClass: EventDBEmitter,
        },
      ],
      exports: [EventDBEmitter],
    };
  }
}
