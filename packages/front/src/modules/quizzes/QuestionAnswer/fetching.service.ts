import { CreateQuestionTextAnswerDto } from "#shared/models/questions-answers/text-answers/dtos";
import { ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { useState } from "react";
import { UseMutation, fetchCreateOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions-answers/text-answer";

function fetchCreateOneQuestionTextAnswerAndGet(
  dto: CreateQuestionTextAnswerDto,
): Promise<ResultOneQuestionDto> {
  return fetchCreateOneAndGet(URL, dto);
}

export const useCreateOneQuestionTextAnswerAndGet: UseMutation<ResultOneQuestionDto, CreateQuestionTextAnswerDto> = () => {
  const [result, setResult] = useState<ResultOneQuestionDto | undefined>(undefined);
  const fn = async (dto: CreateQuestionTextAnswerDto) => {
    const res = await fetchCreateOneQuestionTextAnswerAndGet(dto);

    setResult(res);
  };

  return [
    fn,
    result,
  ];
};
