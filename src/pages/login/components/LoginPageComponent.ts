import {VComponent} from "../../../core/v-react/v-component";
import {NoProps} from "../../../core/v-react/types/no-props";
import {NoState} from "../../../core/v-react/types/no-state";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {LoginBlockComponent} from "./LoginBlockComponent";

export class LoginPageComponent extends VComponent<NoProps, NoState> {
    private loginBlockComponent: LoginBlockComponent;

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
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