import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { NotifyConfigs } from './types';

export interface UseCustomMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  notify?: NotifyConfigs<TData, TError>;
}

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>({
  onSuccess,
  onError,
  mutationFn,
  notify = {},
  ...options
}: UseCustomMutationOptions<TData, TError, TVariables, TContext>) => {
  const { toast } = useToast();
  const { success, error, loading } = notify;

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: mutationFn
      ? (...params) => {
          if (loading) {
            toast(
              typeof loading === 'string' ? { description: loading } : loading()
            );
          }
          return mutationFn(...params);
        }
      : undefined,
    onError: (errorResponse, ...restErrorParams) => {
      onError?.(errorResponse, ...restErrorParams);
      if (error) {
        toast(
          typeof error === 'string'
            ? { description: error, variant: 'destructive' }
            : { variant: 'destructive', ...error(errorResponse) }
        );
      }
    },
    onSuccess: (data, ...restSuccessParams) => {
      onSuccess?.(data, ...restSuccessParams);
      if (success) {
        toast(
          typeof success === 'string' ? { description: success } : success(data)
        );
      }
    },
  });
};
