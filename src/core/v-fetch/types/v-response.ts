type ErrorDataType = {
    reason?: string
}

export interface VResponse<TData> {
    status: number,
    statusText: string,
    data: TData & ErrorDataType
}
