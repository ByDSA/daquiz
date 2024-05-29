import { Module } from "@nestjs/common";
import { HistoryEntriesController } from "./controllers";
import { HistoryEntriesDBModule } from "./db";
import { HistoryEntriesService } from "./services";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    HistoryEntriesDBModule,
    EventsModule,
  ],
  controllers: [HistoryEntriesController],
  providers: [HistoryEntriesService],
  exports: [HistoryEntriesDBModule, HistoryEntriesService],
} )
export class HistoryEntriesModule {}
