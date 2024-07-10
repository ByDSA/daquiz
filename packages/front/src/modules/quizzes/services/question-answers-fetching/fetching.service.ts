import { QuestionAnswerID } from "#/modules/question-answers";
import { UseMutation, createApi, responseNoDataHandler } from "#utils/fetching";
import { QuizID } from "../../models";

type AddQuestionAnswerQuery = {
  quizId: QuizID;
  questionsAnswersIds: QuestionAnswerID[];
};
type AddQuestionAnswerDto = Pick<AddQuestionAnswerQuery, "questionsAnswersIds">;

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";
const api = createApi( {
  baseUrl: URL,
  endpoints: (builder) => ( {
    addQuestionAnswer: builder.mutation<
    void,
    AddQuestionAnswerQuery,
    AddQuestionAnswerDto
    >( {
      query: (queryData) => ( {
        url: `${queryData.quizId}/add`,
        method: "POST",
        body: {
          questionsAnswersIds: queryData.questionsAnswersIds,
        },
      } ),
      responseHandler: responseNoDataHandler,
    } ),
    removeOneQuestionAnswer: builder.mutation<void, {
      quizId: QuizID;
      questionAnswerId: QuestionAnswerID;
    }>( {
      query: (props) => ( {
        url: `${props.quizId}/remove/${props.questionAnswerId}`,
        method: "DELETE",
      } ),
      responseHandler: responseNoDataHandler,
    } ),
    removeManyQuestionAnswer: builder.mutation<void, {
      quizId: QuizID;
      ids: QuestionAnswerID[];
    }, {
      ids: QuestionAnswerID[];
    }>( {
      query: (props) => ( {
        url: `${props.quizId}/remove`,
        method: "DELETE",
        body: {
          ids: props.ids,
        },
      } ),
      responseHandler: responseNoDataHandler,
    } ),
  } ),
} );

export const useAddQuestionAnswer = (api as any).useAddQuestionAnswerMutation as UseMutation<
AddQuestionAnswerDto, AddQuestionAnswerQuery
>;

export const useRemoveOneQuestionAnswer = (api as any)
  .useRemoveOneQuestionAnswerMutation as UseMutation<
void, {
  quizId: QuizID;
  questionAnswerId: QuestionAnswerID;
}>;

export const useRemoveManyQuestionAnswer = (api as any)
  .useRemoveManyQuestionAnswerMutation as UseMutation<
void, {
  quizId: QuizID;
  ids: QuestionAnswerID[];
}>;
