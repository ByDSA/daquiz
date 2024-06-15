import { ResultOneDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { assertDefined } from "../../../../../../shared/build/utils/validation/asserts";
import { validateOkResponse } from "../error-handling";
import { FetchPipe, createFetchPipe } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipePatchOneAndGetProps = {
  entityUrl: string;
};
type CreateFetchPipePatchOneAndGetFetchFnProps<ENTITY extends UnknownEntity, DTO extends object> = {
  id: ENTITY["id"];
  dto: DTO;
};
export function createFetchPipePatchOneAndGet<ENTITY extends UnknownEntity, DTO extends object>(
  props: CreateFetchPipePatchOneAndGetProps,
): FetchPipe<ResultOneDto<ENTITY>, CreateFetchPipePatchOneAndGetFetchFnProps<ENTITY, DTO>> {
  const { entityUrl } = props;

  return createFetchPipe<
    ResultOneDto<ENTITY>,
    CreateFetchPipePatchOneAndGetFetchFnProps<ENTITY, DTO>
  >( {
    preFetchValidation: async ( { id, dto } ) => {
      assertDefined(id, "id is required");
      await validateOrReject(dto);
    },
    fetchFn: ( { id, dto } ) => {
      const url = entityUrl + "/" + id;

      return fetch(url, {
        method: "PATCH",
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
