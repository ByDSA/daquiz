import { QuestionEntity } from "#shared/models/questions/Question";
import { PatchOneQuestionDto, ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { useState } from "react";
import { UseMutation, fetchPatchOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions";

function patchOneQuestionAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneQuestionDto,
): Promise<ResultOneQuestionDto> {
  return fetchPatchOneAndGet(URL, id, dto);
}

type QueryParams = {
  id: QuestionEntity["id"];
  dto: PatchOneQuestionDto;
};

export const usePatchOneQuestionAndGet: UseMutation<ResultOneQuestionDto, QueryParams> = () => {
  const [result, setResult] = useState<ResultOneQuestionDto | undefined>(undefined);
  const fn = async (params: QueryParams) =>{
    const res = await patchOneQuestionAndGet(params.id, params.dto);

    setResult(res);
  };

  return [
    fn,
    result,
  ];
};
