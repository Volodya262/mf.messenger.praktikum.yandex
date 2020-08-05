import {VComponent} from "../../../core/v-react/v-component";
import {NoState} from "../../../core/v-react/types/no-state";
import {NoProps} from "../../../core/v-react/types/no-props";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {logoTemplate} from '../templates/logo.tmpl'

export class LogoComponent extends VComponent<NoProps, NoState> {
    render(props: Readonly<NoProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        const template = logoTemplate;
        return {context: {}, template: template};
    }
}