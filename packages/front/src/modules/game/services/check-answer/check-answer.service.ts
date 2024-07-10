import { AnswerCheckResult, QuestionAnswerCheckingDto } from "#shared/modules/question-answers/services/checking";
import urlJoin from "#shared/utils/urls/urlJoin";
import { assertDefined } from "#shared/utils/validation/asserts";
import { QuestionAnswerID } from "#modules/question-answers";
import { AnswerVO } from "#modules/answers";
import { UseMutation, checkForErrors, createApi } from "#utils/fetching";

type Props = {
  questionAnswerId: QuestionAnswerID;
  answer: AnswerVO;
};

const api = createApi( {
  baseUrl: urlJoin(process.env.NEXT_PUBLIC_BACKEND_URL as string, "question-answers", "checking"),
  endpoints: (build) => ( {
    checkAnswer: build.mutation<AnswerCheckResult, Props, QuestionAnswerCheckingDto>( {
      query: ( { questionAnswerId, answer } ) => ( {
        url: questionAnswerId,
        method: "POST",
        body: {
          answer,
          askForCorrectAnswer: true,
        },
      } ),
      responseHandler: async (res: Response) => {
        const resJson = await res.json();

        checkForErrors(res, resJson);
        const { isCorrect } = resJson;

        assertDefined(isCorrect);

        return resJson;
      },
    } ),
  } ),
} );

export const useCheckAnswerMutation = (api as any)
  .useCheckAnswerMutation as UseMutation<AnswerCheckResult, Props>;
