import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { TextAnswersModule } from "./answers/text-answer/TextAnswers.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { QuestionsModule } from "./questions";
import { QuestionsAnswersModule } from "./questions-answers/submodules";
import { QuestionTextAnswerModule } from "./questions-answers/submodules/answer-text/modules";
import { QuestionAnswerCheckingModule } from "./questions-answers/submodules/checking/modules";
import { QuizzesModule } from "./quizzes";

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
        path: "questions-answers",
        module: QuestionsAnswersModule,
        children: [{
          path: "text-answer",
          module: QuestionTextAnswerModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
} )
export class AppModule {}
