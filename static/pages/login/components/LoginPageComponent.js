import { VComponent } from "../../../core/v-react/v-component.js";
import { LoginBlockComponent } from "./LoginBlockComponent.js";
export class LoginPageComponent extends VComponent {
    componentDidMount() {
    }
    render(props) {
        if (this.loginBlockComponent == null) {
            this.loginBlockComponent = this.createChildComponent(LoginBlockComponent, {});
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
        };
        return { context: context, template: template };
    }
}
//# sourceMappingURL=LoginPageComponent.js.map