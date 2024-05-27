import { ResultOneDto } from "#shared/utils/dtos";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";

export * from "./swr";

type UnknownEntity = {id: unknown};

export async function fetchPatchOneAndGet<ENTITY extends UnknownEntity, DTO>(
  entityUrl: string,
  id: ENTITY["id"],
  dto: DTO,
): Promise<ResultOneDto<ENTITY>> {
  assertDefined(id, "id is required");

  const response = await fetch(entityUrl + "/" + id, {
    method: "PATCH",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultOneDto<ENTITY> = await response.json();

  return responseJson;
}

export async function fetchCreateOneAndGet<ENTITY extends UnknownEntity, DTO>(
  enityUrl: string,
  dto: DTO,
): Promise<ResultOneDto<ENTITY>> {
  const response = await fetch(enityUrl, {
    method: "POST",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultOneDto<ENTITY> = await response.json();

  return responseJson;
}
