export type UseQueryRet<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  revalidate: ()=> Promise<any>;
};

export type UseQuery<RESULT, QUERY_ARGS> = (args: QUERY_ARGS)=> UseQueryRet<RESULT>;

export type UseMutationRet<RESULT, QUERY_ARGS> = [
  (args: QUERY_ARGS)=> Promise<void>,
  RESULT | undefined
];

export type UseMutation<RESULT, QUERY_ARGS> = ()=> UseMutationRet<RESULT, QUERY_ARGS>;
