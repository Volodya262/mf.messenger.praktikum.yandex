import {ComponentEventHandlerInternal} from "../../core/v-react/types/internal-component-event-handler";
import {VComponent} from "../../core/v-react/v-component";
import {NoState} from "../../core/v-react/types/no-state";
import {format} from 'date-fns';
import Handlebars from 'handlebars'; // у меня блок import всегда скрыт, не вижу смысла в сортировке

export function registerAll(): void {
    const handlebars = Handlebars;

    handlebars.registerHelper('dateFormat', function (date) {
        return format(date, 'dd.MM.yyyy')
    })

    handlebars.registerHelper('timeFormat', function (date) {
        return format(date, 'HH:mm')
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handlebars.registerHelper('renderFunctionalComponent', function (componentClass: new (...args: any) => VComponent<any, NoState>,
                                                                     props: unknown,
                                                                     registerEventHandlers: (handlers: ComponentEventHandlerInternal[]) => void) {
        // any убрать не получится, registerHelper - стандартная функция Handlebars и не имеет дженериков
        const component = new componentClass(props, registerEventHandlers);
        component.init();
        return component.getElementHtml();
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handlebars.registerHelper('renderComponentInstance', function (component: VComponent<any, any>,
                                                                   props: unknown) {
        // any убрать не получится, registerHelper - стандартная функция Handlebars и не имеет дженериков
        component.setProps(props);
        return component.getElementHtml();
    })
}
