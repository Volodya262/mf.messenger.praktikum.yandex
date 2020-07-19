import {VComponent} from "./core/v-react/v-component.js";
import {ComponentEventHandler} from "./core/v-react/types/component-event-handler.js";
import {NoState} from "./core/v-react/types/no-state.js";

interface MyProps {
    name: string
}

interface BlockProps {
    users: {
        name: string
    }[]
}

class MyBlock extends VComponent<BlockProps, object> { // родительский компонент

    component: MyComponent;
    inputComponent: InputComponent;

    componentDidMount(): void {
    }

    render(props: Readonly<BlockProps>): { template: string; context: object, eventListeners?: ComponentEventHandler[] } {
        if (this.component == null) {
            this.component = this.createChildComponent(MyComponent, {name: ''});
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
        }

        const eventListeners: ComponentEventHandler[] = [{
            querySelector: 'h1',
            event: 'click',
            func: () => alert('h1 clicked')
        }];

        return {context: context, template: template, eventListeners: eventListeners};
    }
}

interface InputState {
    inputValue?: string;
}

class InputComponent extends VComponent<object, InputState> {
    componentDidMount(): void {
        console.log(`${this.constructor.name} mounted`)
    }

    saveInputState = (e: InputEvent) => {
        console.log(e);
        const target = e.target as HTMLInputElement;
        const value = target?.value;
        this.setState({
            inputValue: value
        })
    }

    render(props: Readonly<any>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        console.log(`${this.constructor.name} rendered`)

        const template = `
        <div>
        <input type="text" name="login" value="{{value}}"/>
        </div>
        `

        const context = {
            value: this.getState()?.inputValue || ''
        }

        const handlers: ComponentEventHandler[] = [{querySelector: 'input', func: this.saveInputState, event: 'blur'}]

        return {context: context, template: template, eventListeners: handlers};
    }
}

class MyComponent extends VComponent<MyProps, NoState> { // дочерний компонент
    render(props): { template: string; context: object, eventListeners?: ComponentEventHandler[] } {
        console.log(`${this.constructor.name} render. props: ${props.name}`)
        const context = {
            name: props.name
        }

        const handler = function () {
            alert('1234')
        }

        // language=Handlebars
        const template = `
            <div><p>Привет, {{name}}</p>
                <button class="my-button">Кнопочка</button>
            </div>`
        return {
            context: context,
            template: template,
            eventListeners: [{querySelector: '.my-button', event: 'click', func: handler}]
        };
    }

    componentDidMount(): void {
        console.log('Child mounted')
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const users = {users: [{name: 'vasua'}]};
    const myBlock = new MyBlock(users);

    // setTimeout(() => {
    //     myBlock.setProps({users: [{name: 'olga'}]})
    // }, 3000);
    document.getElementById('root').appendChild(myBlock.getElement());
});
