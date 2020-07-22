import {ComponentEventHandler} from "../types/component-event-handler.js";
import {ComponentEventHandlerInternal} from "../types/internal-component-event-handler.js";
import {uuidv4} from "../../../utils/uuid.js";

const eventHandlerTargetQuerySelector = `[data-v-event-handler-id]`;
const eventHandlerIdTag = 'vEventHandlerId';

/** Найти все элементы, которым надо присвоить обработчики событий*/
export function findAllTaggedElements(rootNode: HTMLElement): HTMLElement[] {
    return Array.from(rootNode.querySelectorAll(eventHandlerTargetQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить
}

/** Найти все элементы, которым надо присвоить конкретный обработчик события */
export function findTargetElements(elements: HTMLElement[], eventHandlerId: string): HTMLElement[] {
    return elements.filter(item => (item as HTMLElement).dataset[eventHandlerIdTag] === eventHandlerId)
}

/** Добавить элементу event handler id */
export function tagElementWithEventHandlerId(elements: Element[] | NodeListOf<Element>, eventHandlerId: string): void {
    elements.forEach(item => (item as HTMLElement).dataset[eventHandlerIdTag] = eventHandlerId);
}

/**
 * Пометить каждый элемент уникальным id в соответствии с querySelector из handlers
 * @param rootNode корневая нода
 * @param handlers описание обработчиков событий. querySelector, тип события, обработчик
 */
export function tagAllElementsWithUniqueEventHandlerId(rootNode: HTMLElement, handlers: ComponentEventHandler[]): ComponentEventHandlerInternal[] {
    const internalHandlers: ComponentEventHandlerInternal[] = [];

    for (let {event, func, querySelector} of handlers) {
        const id = uuidv4();
        const elements = rootNode.querySelectorAll(querySelector);
        // TODO добавить поддержку нескольких event handler на один объект
        tagElementWithEventHandlerId(elements, id)
        internalHandlers.push({id: id, event: event, func: func});
    }

    return internalHandlers;
}