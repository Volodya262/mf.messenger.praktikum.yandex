import {VComponent} from "../../../core/v-react/v-component.js";
import {NoProps} from "../../../core/v-react/types/no-props.js";
import {NoState} from "../../../core/v-react/types/no-state.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {LoginBlockComponent} from "./LoginBlockComponent.js";

export class LoginPageComponent extends VComponent<NoProps, NoState> {
    private loginBlockComponent: LoginBlockComponent;

    componentDidMount(): void {
    }

    render(props: Readonly<NoProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        if (this.loginBlockComponent == null) {
            this.loginBlockComponent = this.createChildComponent<LoginBlockComponent, NoProps>(LoginBlockComponent, {});
        }

        // language=Handlebars
        const template = `
            <div class="auth-window">
                {{{renderComponentInstance loginBlockComponent noProps}}}
            </div>
        `;

        const context = {
            loginBlockComponent: this.loginBlockComponent,
            noProps: {}
        }

        return {context: context, template: template};
    }

}