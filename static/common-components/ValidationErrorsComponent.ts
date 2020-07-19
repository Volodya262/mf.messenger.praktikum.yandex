import {VComponent} from "../core/v-react/v-component.js";
import {NoState} from "../core/v-react/types/no-state.js";
import {ComponentEventHandler} from "../core/v-react/types/component-event-handler.js";

export interface ValidationErrorsComponentProps {
    errors?: string[]
}

export class ValidationErrorsComponent extends VComponent<ValidationErrorsComponentProps, NoState> {
    componentDidMount(): void {
    }

    render(props: Readonly<ValidationErrorsComponentProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        // language=Handlebars
        const template = `
            <div>
                {{#each errors}}
                    <div class="validation-error-text">{{this}}</div>
                {{/each}}
            </div>
        `;

        const context = {
            errors: props?.errors || []
        }

        return {context: context, template: template};
    }

}