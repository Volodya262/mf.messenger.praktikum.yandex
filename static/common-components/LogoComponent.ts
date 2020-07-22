import {VComponent} from "../core/v-react/v-component.js";
import {NoState} from "../core/v-react/types/no-state.js";
import {NoProps} from "../core/v-react/types/no-props.js";
import {ComponentEventHandler} from "../core/v-react/types/component-event-handler.js";
import {logoTemplate} from '../common-templates/logo.tmpl.js'

export class LogoComponent extends VComponent<NoProps, NoState> {
        render(props: Readonly<NoProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
            const template = logoTemplate;
            return {context: {}, template: template};
        }
}