import { HistoryEntryEntity } from "#shared/modules/history-entries/models";
import { QuestionAnswerEntity } from "#shared/modules/questions-answers/models";
import { QuestionEntity } from "#shared/modules/questions/models";
import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Inject } from "@nestjs/common";
import { WeightPicker } from "rand-picker";
import { createSafeIntegerMaxWeightFixer } from "rand-picker/WeightPicker/weight-fixers";
import { Filter } from "rand-picker/filters";
import { QuestionAnswerInQuizEntity, QuestionAnswerPickerService, QuizID, QuizzesServicePort, ResultQuizPickQuestionsAnswersDto } from "../../domain";
import { HistoryEntriesServicePort } from "#/historyEntries";

export class QuestionAnswerPickerServiceImp implements QuestionAnswerPickerService {
  constructor(
    @Inject(QuizzesServicePort)
    private readonly quizzesService: QuizzesServicePort,
    @Inject(HistoryEntriesServicePort)
    private readonly historyEntriesService: HistoryEntriesServicePort,
  ) {
  }

  async pickOneQuestionAnswer(id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> {
    const gotQuiz = await this.quizzesService.findOne(id);
    const gotQuestionsAnswers = gotQuiz?.questionAnswers;

    assertDefined(gotQuestionsAnswers);

    if (gotQuestionsAnswers.length === 0)
      throw new BadRequestException("No questions answers");

    const [defaultValue] = gotQuestionsAnswers;

    assertDefined(defaultValue);
    const picker = new WeightPicker(gotQuestionsAnswers);
    const lastHistoryEntry = await this.historyEntriesService.findAll().then((historyEntries) => {
      return historyEntries.at(-1);
    } );
    const preventLastFilter: Filter<QuestionAnswerEntity> = (qa: QuestionAnswerInQuizEntity) => {
      return qa.id !== lastHistoryEntry?.questionAnswerId;
    };
    const lastHistoryEntriesOfEach: Record<QuestionAnswerEntity["id"], HistoryEntryEntity | undefined> = {};

    for (const d of picker.data)
      lastHistoryEntriesOfEach[d.id] = await this.#getLastEntryOkOfQuestionAnswerId(d.id);

    const secondsElapsedOfEach = Object.entries(lastHistoryEntriesOfEach).reduce(
      (acc, [id, entry]) => {
        acc[id] = calcSecondsElapsed(entry?.date);

        return acc;
      },
      {} as Record<QuestionAnswerEntity["id"], number>,
    );

    picker.filter(
      preventLastFilter,
      (item) => {
        return secondsElapsedOfEach[item.id] > 120;
      },
    );

    picker.fixWeights(
      (item, weight) => {
        return weight * Math.ceil(secondsElapsedOfEach[item.id] / 60);
      },
      createSafeIntegerMaxWeightFixer(picker.data.length),
    );
    const retQuestionsAnswers = picker.pick(1);

    if (retQuestionsAnswers.length === 0)
      retQuestionsAnswers.push(defaultValue);

    const pickedPartialQuestionAnswer = retQuestionsAnswers.map((qa) => {
      assertDefined(qa.question);

      const questionEntity: QuestionEntity = {
        id: qa.questionId,
        ...qa.question,
      };

      return {
        id: qa.id,
        question: questionEntity,
      };
    } );

    return {
      data: {
        pickedQuestions: pickedPartialQuestionAnswer,
      },
    };
  }

  async #getLastEntryOkOfQuestionAnswerId(questionAnswerId: QuestionAnswerEntity["id"]) {
    const all = await this.historyEntriesService.findAll();

    return all.findLast(
      (entry) => entry.questionAnswerId === questionAnswerId && entry.checkResult.isCorrect,
    );
  }
}

function calcSecondsElapsed(date: Date | undefined) {
  if (!date)
    return Infinity;

  const signedSecondsElapsed = (Date.now() - date.getTime()) / 1000;

  if (signedSecondsElapsed < 0)
    return 0;

  return signedSecondsElapsed;
}
