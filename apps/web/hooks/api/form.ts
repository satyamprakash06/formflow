import { trpc } from "~/trpc/client";

export function useCreateForm() {
  const util = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await util.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
}

export const useListForms = () => {
  const {
    data: forms,
    error,
    isFetching,
    isFetched,
    isLoading,
    status,
  } = trpc.form.listForms.useQuery();
  return {
    forms,
    error,
    isFetching,
    isFetched,
    isLoading,
    status,
  };
};
