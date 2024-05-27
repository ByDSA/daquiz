import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuizzesController } from "./controllers";
import { Quiz, QuizSchema } from "./db";
import { QuizzesService } from "./services";
import { QuestionsAnswersModule } from "#/questions-answers/modules";
import { EventsModule } from "#/events/module";

export const QuizzesDBModule = MongooseModule.forFeature([{
  name: Quiz.name,
  schema: QuizSchema,
}]);

@Module( {
  imports: [
    QuestionsAnswersModule,
    QuizzesDBModule,
    EventsModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [],
} )
export class QuizzesModule {}
