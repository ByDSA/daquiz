import { PatchOneTextAnswerDto, ResultOneTextAnswerDto } from "#shared/models/answers/text-answers/dtos";
import { QuestionEntity } from "#shared/models/questions/Question";
import { assertDefined } from "../../../../shared/build/utils/validation/asserts";

export async function patchOneTextAnswerAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneTextAnswerDto,
): Promise<ResultOneTextAnswerDto> {
  assertDefined(id, "id is required");

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text/" + id, {
    method: "PATCH",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultOneTextAnswerDto = await response.json();

  return responseJson;
}
