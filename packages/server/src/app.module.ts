import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { TextAnswersModule } from "./modules/answers/submodules/text-answer/module";
import { HistoryEntriesModule } from "./modules/history-entries/module";
import { QuestionsAnswersModule } from "./modules/question-answers";
import { QuestionAnswerCheckingModule } from "./modules/question-answers/app/checking";
import { QuestionAnswerModule } from "./modules/question-answers/infra";
import { QuestionsModule } from "./modules/questions";
import { QuizzesModule } from "./modules/quizzes";

@Module( {
  imports: [
    ConfigModule.forRoot( {
      load: [configuration],
    } ),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync( {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = `mongodb://${configService.get("mongo.user")}:${configService.get("mongo.password")}@${configService.get("mongo.host")}:${configService.get("mongo.port")}/${configService.get("mongo.db")}`;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    } ),
    QuestionsModule,
    RouterModule.register([
      {
        path: "questions",
        module: QuestionsModule,
      },
    ]),
    TextAnswersModule,
    RouterModule.register([
      {
        path: "answers",
        module: TextAnswersModule,
      },
    ]),
    QuestionsAnswersModule,
    RouterModule.register([
      {
        path: "question-answers",
        module: QuestionsAnswersModule,
        children: [
          {
            path: "/",
            module: QuestionAnswerModule,
          },
          {
            path: "checking",
            module: QuestionAnswerCheckingModule,
          }],
      },
    ]),
    QuizzesModule,
    RouterModule.register([
      {
        path: "quizzes",
        module: QuizzesModule,
      },
    ]),
    HistoryEntriesModule,
    RouterModule.register([
      {
        path: "history-entries",
        module: HistoryEntriesModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
} )
export class AppModule {}
