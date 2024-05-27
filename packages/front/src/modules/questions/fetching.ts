import { QuestionEntity } from "#shared/models/questions/Question";
import { PatchOneQuestionDto, ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { assertDefined } from "../../../../shared/build/utils/validation/asserts";

export async function patchOneQuestionAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneQuestionDto,
): Promise<ResultOneQuestionDto> {
  assertDefined(id, "id is required");

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/questions/" + id, {
    method: "PATCH",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultOneQuestionDto = await response.json();

  return responseJson;
}
