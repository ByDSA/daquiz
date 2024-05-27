import { Module } from "@nestjs/common";
import { QuestionsController } from "./controllers";
import { QuestionsDBModule } from "./db";
import { QuestionsService } from "./services";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    QuestionsDBModule,
    EventsModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsDBModule, QuestionsService],
} )
export class QuestionsModule {}
