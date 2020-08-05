/**
 * Обработчик
 */
export interface ComponentEventHandler {
    querySelector: string;
    event: string;
    func: (...args: any) => void;
}