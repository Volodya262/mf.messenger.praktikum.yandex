export type VOptions<TData> = {
    method: string;
    query?: string;
    data?: TData;
    timeout?: number;
    headers?: { [key: string]: string };
};
