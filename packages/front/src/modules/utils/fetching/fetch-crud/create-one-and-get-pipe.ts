import { ResultOneDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { validateOkResponse } from "../error-handling";
import { FetchPipe, createFetchPipe } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipeCreateOneAndGetProps = {
  url: string;
};
export function createFetchPipeCreateOneAndGet<ENTITY extends UnknownEntity, DTO extends object>(
  props: CreateFetchPipeCreateOneAndGetProps,
): FetchPipe<ResultOneDto<ENTITY>, DTO> {
  const { url } = props;

  return createFetchPipe<
    ResultOneDto<ENTITY>,
    DTO
  >( {
    preFetchValidation: validateOrReject,
    fetchFn: (dto) => {
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      } );
    },
    postFetchValidation: validateOkResponse,
    transform: (res) => res.json(),
    postValidation: validateOrReject,
  } );
}
