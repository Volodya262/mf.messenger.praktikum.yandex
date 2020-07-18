import {ComponentEventHandlerInternal} from "../core/v-react/types/internal-component-event-handler.js";

Handlebars.registerHelper('dateFormat', function (date) {
    return dateFns.format(date, 'DD.MM.YYYY')
})

Handlebars.registerHelper('timeFormat', function (date) {
    return dateFns.format(date, 'HH:mm')
})

Handlebars.registerHelper('createAndRenderComponent', function (componentClass, props: unknown, registerEventHandlers: (handlers: ComponentEventHandlerInternal[]) => void) {
    const component = new componentClass(props, registerEventHandlers);
    return component.getElementHtml();
})