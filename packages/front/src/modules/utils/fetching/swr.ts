/* eslint-disable no-use-before-define */
import { useState } from "react";
import useSWR, { mutate } from "swr";
import urlJoin from "../../../../../shared/build/utils/urls/urlJoin";
import { checkForErrors } from "./error-handling";
import { UseMutation, UseMutationRet, UseQuery, UseQueryRet } from "./hooks";

type ResponseHandler<RESULT> = (res: Response)=> Promise<RESULT>;
const jsonResponseHandler = <RESULT>(response: Response): Promise<RESULT> => {
  return response.json();
};

type MutationDefinition<RESULT, QUERY_ARGS> = {
  fn: (
    apiProps: ApiProps<any>,
    args: QUERY_ARGS
  )=> UseMutationRet<RESULT, QUERY_ARGS>;
  type: "mutation";
};

type MutationProps<RESULT, QUERY_ARGS, BODY = QUERY_ARGS> = {
  query?: (args: QUERY_ARGS)=> {
    url?: string;
    method?: string;
    body?: BODY;
  };
  responseHandler?: ResponseHandler<RESULT>;
};

type QueryDefinition<RESULT, QUERY_ARGS> = {
  fn: (
    apiProps: ApiProps<any>,
    args: QUERY_ARGS
  )=> UseQueryRet<RESULT>;
  type: "query";
};
type QueryProps<RESULT, QUERY_ARGS> = {
  query?: (args: QUERY_ARGS)=> string;
  responseHandler?: ResponseHandler<RESULT>;
};
class ApiEndpointBuilder<T> {
  query<RESULT, QUERY_ARGS>(
    props?: QueryProps<RESULT, QUERY_ARGS>,
  ): QueryDefinition<RESULT, QUERY_ARGS> {
    const queryUrlFn = props?.query;

    return {
      fn: (apiProps: ApiProps<T>, args: QUERY_ARGS) => {
        const finalUrl = urlJoin(apiProps.baseUrl, queryUrlFn?.(args) ?? "");
        const responseHandler: ResponseHandler<RESULT> = props?.responseHandler
      ?? jsonResponseHandler;
        const fetcher = (url: string) => {
          return fetch(url).then(responseHandler);
        };
        const { data, error, isLoading } = useSWR(finalUrl, fetcher);
        const revalidate = () => mutate(finalUrl);

        return {
          data,
          isLoading,
          error,
          revalidate,
        };
      },
      type: "query",
    };
  }

  mutation<RESULT, QUERY_ARGS, BODY = QUERY_ARGS>(
    props?: MutationProps<RESULT, QUERY_ARGS, BODY>,
  ): MutationDefinition<RESULT, QUERY_ARGS> {
    const queryUrlFn = props?.query;

    return {
      fn: (apiProps: ApiProps<T>) => {
        const responseHandler: ResponseHandler<RESULT> = props?.responseHandler
        ?? jsonResponseHandler;
        const fetcher = (args: QUERY_ARGS) => {
          const finalUrl = urlJoin(apiProps.baseUrl, queryUrlFn?.(args).url ?? "");
          const method = queryUrlFn?.(args).method;
          const bodyStr = JSON.stringify(queryUrlFn?.(args).body);

          return fetch(
            finalUrl,
            {
              method: method,
              body: bodyStr,
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            },
          ).then(responseHandler);
        };
        const [result, setResult] = useState<RESULT | undefined>();

        return [
          async (args: QUERY_ARGS)=> {
            const res = await fetcher(args);

            setResult(res);
          },
          result,
        ] as UseMutationRet<RESULT, QUERY_ARGS>;
      },
      type: "mutation",
    };
  }
}

export type Definition<RESULT, QUERY_ARGS>
= MutationDefinition<RESULT, QUERY_ARGS> | QueryDefinition<RESULT, QUERY_ARGS>;

export type RecordDefinition = Record<string, Definition<any, any>>;
type ApiProps<T> = {
  baseUrl: string;
  endpoints: (
    builder: ApiEndpointBuilder<T>
  )=> T;
};

// eslint-disable-next-line max-len
// TODO: no he conseguido que funcione. Sólo funciona si se usa QueryDefinition o MutationDefinition explícitamente, pero no son Definition.
export type TransformRecord<T extends Record<string, Definition<any, any>>> = {
  [
    K in keyof T as T[K] extends { type: "query" }
  ? `use${Capitalize<K & string>}Query`
  : T[K] extends { type: "mutation" }
  ? `use${Capitalize<K & string>}Mutation`
  : T[K]["type"]
]: T[K] extends { type: "query" }
  ? UseQueryRet<any>
  : T[K] extends { type: "mutation" }
  ? UseMutationRet<any, any>
  : never;
};

export function createApi<
T extends Record<string, Definition<any, any>>
>(props: ApiProps<T>): TransformRecord<T> {
  const hooks: Partial<TransformRecord<T>> = {};
  const builder = new ApiEndpointBuilder<T>();

  for (const [key, value] of Object.entries(props.endpoints(builder))) {
    if (value.type === "query") {
      const finalKey = "use" + key.slice(0, 1).toUpperCase() + key.slice(1) + "Query";
      const query: UseQuery<any, any> = (queryArgs: any) =>(value.fn(
        props,
        queryArgs,
      ));

      (hooks as any)[finalKey] = query;
    } else {
      const finalKey = "use" + key.slice(0, 1).toUpperCase() + key.slice(1) + "Mutation";
      const mutation: UseMutation<any, any> = () =>(value.fn(
        props,
        undefined,
      ));

      (hooks as any)[finalKey] = mutation;
    }
  }

  return hooks as unknown as TransformRecord<T>;
}

export const responseWithDataHandler = async (res: Response) => {
  const resJson = await res.json();

  checkForErrors(res, resJson);

  return resJson.data;
};

// eslint-disable-next-line require-await
export const responseNoDataHandler = async (res: Response) => {
  if (!res.ok) {
    throw new Error(undefined, {
      cause: res,
    } );
  }
};
