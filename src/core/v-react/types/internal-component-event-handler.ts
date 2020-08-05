/**
 * Обработчик события дочернего компонента. Используется в "движке"
 */
export interface ComponentEventHandlerInternal {
    id: string;
    event: string;
    func: (...args: any) => void;
}