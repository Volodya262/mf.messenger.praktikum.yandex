export interface VResponse {
    status: number,
    statusText: string,
    data: {
        reason?: string
    }
}
