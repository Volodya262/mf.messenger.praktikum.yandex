import { VComponent } from "./core/v-react/v-component.js";
class MyBlock extends VComponent {
    componentDidMount() {
    }
    render(props) {
        if (this.component == null) {
            this.component = this.createChildComponent(MyComponent, { name: '' });
        }
        if (this.inputComponent == null) {
            this.inputComponent = this.createChildComponent(InputComponent, {});
        }
        // language=Handlebars
        const template = `
        <h1>Контейнер для других компонентов</h1>
        <div>
            {{{renderComponentInstance inputComponent inputComponentProps}}}
        </div>
        <div>
        {{#each users}}
            {{{renderComponentInstance ../component this}}}
        {{/each}}
        </div>`;
        const context = {
            users: props.users,
            component: this.component,
            inputComponent: this.inputComponent,
            inputComponentProps: {}
        };
        const eventListeners = [{
                querySelector: 'h1',
                event: 'click',
                func: () => alert('h1 clicked')
            }];
        return { context: context, template: template, eventListeners: eventListeners };
    }
}
class InputComponent extends VComponent {
    constructor() {
        super(...arguments);
        this.saveInputState = (e) => {
            console.log(e);
            const target = e.target;
            const value = target === null || target === void 0 ? void 0 : target.value;
            this.setState({
                inputValue: value
            });
        };
    }
    componentDidMount() {
        console.log(`${this.constructor.name} mounted`);
    }
    render(props) {
        var _a;
        console.log(`${this.constructor.name} rendered`);
        const template = `
        <div>
        <input type="text" name="login" value="{{value}}"/>
        </div>
        `;
        const context = {
            value: ((_a = this.getState()) === null || _a === void 0 ? void 0 : _a.inputValue) || ''
        };
        const handlers = [{ querySelector: 'input', func: this.saveInputState, event: 'blur' }];
        return { context: context, template: template, eventListeners: handlers };
    }
}
class MyComponent extends VComponent {
    render(props) {
        console.log(`${this.constructor.name} render. props: ${props.name}`);
        const context = {
            name: props.name
        };
        const handler = function () {
            alert('1234');
        };
        // language=Handlebars
        const template = `
            <div><p>Привет, {{name}}</p>
                <button class="my-button">Кнопочка</button>
            </div>`;
        return {
            context: context,
            template: template,
            eventListeners: [{ querySelector: '.my-button', event: 'click', func: handler }]
        };
    }
    componentDidMount() {
        console.log('Child mounted');
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const users = { users: [{ name: 'vasua' }] };
    const myBlock = new MyBlock(users);
    // setTimeout(() => {
    //     myBlock.setProps({users: [{name: 'olga'}]})
    // }, 3000);
    document.getElementById('root').appendChild(myBlock.getElement());
});
//# sourceMappingURL=index.js.map