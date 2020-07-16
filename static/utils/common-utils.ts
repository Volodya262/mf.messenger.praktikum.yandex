/**
 * Определяет, является аргумент объектом или примитивным типом. Null не считается объектом.
 * @param obj
 */
export function isObject(obj: unknown): boolean {
    return typeof obj === 'object' && obj !== null;
}