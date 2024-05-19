import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { TextAnswersModule } from "./answers/text-answer/modules";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { QuestionsAnswersModule } from "./questions-answers/modules";
import { TextQuestionTextAnswerModule } from "./questions-answers/modules/text_text/modules";
import { TextQuestionsModule } from "./questions/text-question/modules";

@Module( {
  imports: [
    ConfigModule.forRoot( {
      load: [configuration],
    } ),
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
    TextQuestionsModule,
    RouterModule.register([
      {
        path: "questions",
        module: TextQuestionsModule,
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
          path: "text-question/text-answer",
          module: TextQuestionTextAnswerModule,
        }],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
} )
export class AppModule {}
