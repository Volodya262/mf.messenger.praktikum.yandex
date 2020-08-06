import {VComponent} from "../../../core/v-react/v-component";
import {NoState} from "../../../core/v-react/types/no-state";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";

export interface ValidationErrorsComponentProps {
    errors?: string[]
}

export class ValidationErrorsComponent extends VComponent<ValidationErrorsComponentProps, NoState> {
    render(props: Readonly<ValidationErrorsComponentProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
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