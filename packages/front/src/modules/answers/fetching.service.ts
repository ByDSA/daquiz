import { PatchOneTextAnswerDto, ResultOneTextAnswerDto } from "#shared/models/answers/text-answers/dtos";
import { QuestionEntity } from "#shared/models/questions/Question";
import { useState } from "react";
import { UseMutation, fetchPatchOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text";

function patchOneTextAnswerAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneTextAnswerDto,
): Promise<ResultOneTextAnswerDto> {
  return fetchPatchOneAndGet(URL, id, dto);
}

type QueryParams = {
  id: QuestionEntity["id"];
  dto: PatchOneTextAnswerDto;
};

export const usePatchOneTextAnswerAndGet: UseMutation<ResultOneTextAnswerDto, QueryParams> = () => {
  const [result, setResult] = useState<ResultOneTextAnswerDto | undefined>(undefined);
  const fn = async (params: QueryParams) =>{
    const res = await patchOneTextAnswerAndGet(params.id, params.dto);

    setResult(res);
  };

  return [
    fn,
    result,
  ];
};
