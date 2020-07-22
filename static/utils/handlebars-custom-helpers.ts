import {ComponentEventHandlerInternal} from "../core/v-react/types/internal-component-event-handler.js";
import {VComponent} from "../core/v-react/v-component.js";
import {NoState} from "../core/v-react/types/no-state.js";

export function registerAll(handlebars = null): void {
    const target = handlebars || window.Handlebars;
    target.registerHelper('dateFormat', function (date) {
        return window.dateFns.format(date, 'DD.MM.YYYY')
    })

    target.registerHelper('timeFormat', function (date) {
        return window.dateFns.format(date, 'HH:mm')
    })

    target.registerHelper('renderFunctionalComponent', function (componentClass: new (...args: any) => VComponent<any, NoState>,
                                                                 props: unknown,
                                                                 registerEventHandlers: (handlers: ComponentEventHandlerInternal[]) => void) {
        const component = new componentClass(props, registerEventHandlers);
        component.init();
        return component.getElementHtml();
    })

    target.registerHelper('renderComponentInstance', function (component: VComponent<any, any>,
                                                               props: unknown) {
        component.setProps(props);
        return component.getElementHtml();
    })
}