import { Module } from "@nestjs/common";
import { TextAnswersController } from "./controllers";
import { TextAnswersDBModule } from "./db";
import { TextAnswersService } from "./services";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    TextAnswersDBModule,
    EventsModule,
  ],
  controllers: [TextAnswersController],
  providers: [TextAnswersService],
  exports: [TextAnswersDBModule, TextAnswersService],
} )
export class TextAnswersModule {}
