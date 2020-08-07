export type VOptions = {
    method: string;
    query?: string;
    data?: unknown;
    timeout?: number;
    headers?: { [key: string]: string };
};
