import { RemoveManyDto, ResultManyDto, ResultOneDto } from "#shared/utils/dtos";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { checkForErrors } from "./error-handling";

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

  checkForErrors(response, responseJson);

  return responseJson;
}

export async function fetchCreateOneAndGet<ENTITY extends UnknownEntity, DTO>(
  entityUrl: string,
  dto: DTO,
): Promise<ResultOneDto<ENTITY>> {
  const response = await fetch(entityUrl, {
    method: "POST",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultOneDto<ENTITY> = await response.json();

  checkForErrors(response, responseJson);

  return responseJson;
}

export async function fetchDeleteOneAndGet<ENTITY extends UnknownEntity>(
  entityUrl: string,
): Promise<ResultOneDto<ENTITY>> {
  const response = await fetch(entityUrl, {
    method: "DELETE",
  } );
  const responseJson: ResultOneDto<ENTITY> = await response.json();

  checkForErrors(response, responseJson);

  return responseJson;
}

export async function fetchDeleteManyAndGet<ENTITY extends UnknownEntity>(
  entityUrl: string,
  dto: RemoveManyDto<ENTITY["id"]>,
): Promise<ResultManyDto<ENTITY>> {
  const response = await fetch(entityUrl, {
    method: "DELETE",
    body: JSON.stringify(dto),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );
  const responseJson: ResultManyDto<ENTITY> = await response.json();

  checkForErrors(response, responseJson);

  return responseJson;
}
