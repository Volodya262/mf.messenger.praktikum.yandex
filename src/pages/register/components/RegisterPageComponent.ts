import {VComponent} from "../../../core/v-react/v-component";
import {NoProps} from "../../../core/v-react/types/no-props";
import {NoState} from "../../../core/v-react/types/no-state";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {RegisterBlockComponent} from "./RegisterBlockComponent";

export class RegisterPageComponent extends VComponent<NoProps, NoState> {
    private registerBlockComponent: RegisterBlockComponent;

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
        if (this.registerBlockComponent == null) {
            this.registerBlockComponent = this.createChildComponent<RegisterBlockComponent, NoProps>(RegisterBlockComponent, {});
        }

        // language=Handlebars
        const template = `
            <div class="auth-window">
                {{{renderComponentInstance registerBlockComponent noProps}}}
            </div>
        `;

        const context = {
            registerBlockComponent: this.registerBlockComponent,
            noProps: {}
        };

        return {context: context, template: template};
    }

}
