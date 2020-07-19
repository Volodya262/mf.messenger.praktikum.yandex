import { VComponent } from "../core/v-react/v-component.js";
export class ValidationErrorsComponent extends VComponent {
    componentDidMount() {
    }
    render(props) {
        // language=Handlebars
        const template = `
            <div>
                {{#each errors}}
                    <div class="validation-error-text">{{this}}</div>
                {{/each}}
            </div>
        `;
        const context = {
            errors: (props === null || props === void 0 ? void 0 : props.errors) || []
        };
        return { context: context, template: template };
    }
}
//# sourceMappingURL=ValidationErrorsComponent.js.map