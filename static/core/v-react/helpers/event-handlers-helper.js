import { uuidv4 } from "../../../utils/uuid.js";
const eventHandlerTargetQuerySelector = `[data-v-event-handler-id]`;
const eventHandlerIdTag = 'vEventHandlerId';
/** Найти все элементы, которым надо присвоить обработчики событий*/
export function findAllTaggedElements(rootNode) {
    return Array.from(rootNode.querySelectorAll(eventHandlerTargetQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить
}
/** Найти все элементы, которым надо присвоить конкретный обработчик события */
export function findTargetElements(elements, eventHandlerId) {
    return elements.filter(item => item.dataset[eventHandlerIdTag] === eventHandlerId);
}
/** Добавить элементу event handler id */
export function tagElementWithEventHandlerId(elements, eventHandlerId) {
    elements.forEach(item => item.dataset[eventHandlerIdTag] = eventHandlerId);
}
/**
 * Пометить каждый элемент уникальным id в соответствии с querySelector из handlers
 * @param rootNode корневая нода
 * @param handlers описание обработчиков событий. querySelector, тип события, обработчик
 */
export function tagAllElementsWithUniqueEventHandlerId(rootNode, handlers) {
    const internalHandlers = [];
    for (let { event, func, querySelector } of handlers) {
        const id = uuidv4();
        const elements = rootNode.querySelectorAll(querySelector);
        // TODO добавить поддержку нескольких event handler на один объект
        tagElementWithEventHandlerId(elements, id);
        internalHandlers.push({ id: id, event: event, func: func });
    }
    return internalHandlers;
}
//# sourceMappingURL=event-handlers-helper.js.map