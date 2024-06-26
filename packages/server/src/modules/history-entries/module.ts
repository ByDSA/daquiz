import { Module } from "@nestjs/common";
import { HistoryEntryDBModule } from "./infra";
import { HistoryEntriesController } from "./infra/controller";
import { CustomEventEmitterModule } from "#modules/events/module";

@Module( {
  imports: [
    HistoryEntryDBModule,
    CustomEventEmitterModule,
  ],
  controllers: [HistoryEntriesController],
  providers: [],
  exports: [HistoryEntryDBModule],
} )
export class HistoryEntriesModule {}
