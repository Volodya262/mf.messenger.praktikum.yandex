import { VComponent } from "../core/v-react/v-component.js";
import { logoTemplate } from '../common-templates/logo.tmpl.js';
export class LogoComponent extends VComponent {
    componentDidMount() {
    }
    render(props) {
        const template = logoTemplate;
        return { context: {}, template: template };
    }
}
//# sourceMappingURL=LogoComponent.js.map