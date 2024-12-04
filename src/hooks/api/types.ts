import { Toast } from '../use-toast';
import { NOTIFY_STATUSES } from './constants';

export type ToastContentGetter<TParams> = (params: TParams) => Toast;

export interface NotifyConfigs<TData, TError> {
  [NOTIFY_STATUSES.SUCCESS]?: string | ToastContentGetter<TData>;
  [NOTIFY_STATUSES.ERROR]?: string | ToastContentGetter<TError>;
  [NOTIFY_STATUSES.LOADING]?: string | ToastContentGetter<void>;
}
