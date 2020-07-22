/**
 * Определяет, является аргумент объектом или примитивным типом. Null не считается объектом.
 * @param obj
 */
export function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
/** Заглушка */
export function noop(...args) {
}
//# sourceMappingURL=common-utils.js.map