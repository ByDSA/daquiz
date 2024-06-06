import { Module } from "@nestjs/common";
import { HistoryEntriesController } from "./HistoryEntries.controller";
import { HistoryEntriesService } from "./HistoryEntries.service";
import { HistoryEntriesServicePort } from "./HistoryEntries.service.port";
import { HistoryEntriesDBModule } from "./db";
import { CustomEventEmitterModule } from "#/events/module";

@Module( {
  imports: [
    HistoryEntriesDBModule,
    CustomEventEmitterModule,
  ],
  controllers: [HistoryEntriesController],
  providers: [{
    provide: HistoryEntriesServicePort,
    useClass: HistoryEntriesService,
  }],
  exports: [HistoryEntriesDBModule, HistoryEntriesServicePort],
} )
export class HistoryEntriesModule {}
