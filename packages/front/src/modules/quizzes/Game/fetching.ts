import { UnknownAnswerVO } from "#shared/models/answers/unknown-answers/UnknownAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { checkForErrors } from "#modules/utils/fetching";

const genCheckAnswerUrl = (id: QuestionAnswerID) =>process.env.NEXT_PUBLIC_BACKEND_URL + "/questions-answers/checking/" + id;

type Props = {
  questionAnswerId: QuestionAnswerID;
  answer: UnknownAnswerVO;
};
export type CheckAnswerResult = {
  isCorrect: boolean;
};

export async function fetchCheckAnswer(
  { answer, questionAnswerId }: Props,
): Promise<CheckAnswerResult> {
  const url = genCheckAnswerUrl(questionAnswerId);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify( {
      answer,
    } ),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson = await response.json();

  checkForErrors(response, responseJson);
  const { isCorrect } = responseJson;

  assertDefined(isCorrect);

  return responseJson;
}
