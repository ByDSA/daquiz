import { Module } from "@nestjs/common";
import { EventDBEmitter } from "./EventDBEmitter";

@Module( {
  imports: [
  ],
  controllers: [],
  providers: [EventDBEmitter],
  exports: [EventDBEmitter],
} )
export class EventsModule {}
