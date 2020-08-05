import {ComponentEventHandlerInternal} from "../../core/v-react/types/internal-component-event-handler";
import {VComponent} from "../../core/v-react/v-component";
import {NoState} from "../../core/v-react/types/no-state";
import {format} from 'date-fns';
import {registerHelper} from 'handlebars'

export function registerAll(): void {
    registerHelper('dateFormat', function (date) {
        return format(date, 'DD.MM.YYYY')
    })

    registerHelper('timeFormat', function (date) {
        return format(date, 'HH:mm')
    })

    registerHelper('renderFunctionalComponent', function (componentClass: new (...args: any) => VComponent<any, NoState>,
                                                          props: unknown,
                                                          registerEventHandlers: (handlers: ComponentEventHandlerInternal[]) => void) {
        const component = new componentClass(props, registerEventHandlers);
        component.init();
        return component.getElementHtml();
    })

    registerHelper('renderComponentInstance', function (component: VComponent<any, any>,
                                                        props: unknown) {
        component.setProps(props);
        return component.getElementHtml();
    })
}