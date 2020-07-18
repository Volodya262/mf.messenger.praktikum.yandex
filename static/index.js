import { VFunctionalComponent } from "./core/v-react/v-functional-component.js";
class MyBlock extends VFunctionalComponent {
    render(props) {
        const template = `
        <h1>Контейнер для других компонентов</h1>
        <div>
        {{#each users}}
            {{{createAndRenderComponent ../component this ../registerChildEventListeners}}}
        {{/each}}
             
        </div>`;
        const context = {
            users: props.users,
            component: MyComponent,
            registerChildEventListeners: this.registerChildEventListeners
        };
        const eventListeners = [{ querySelector: 'h1', event: 'click', func: () => alert('h1 clicked') }];
        return { context: context, template: template, eventListeners: eventListeners };
    }
}
class MyComponent extends VFunctionalComponent {
    render(props) {
        const context = {
            name: props.name
        };
        const handler = function () {
            alert('1234');
        };
        const template = `<div><p>Привет, {{name}}</p><button class="my-button">Кнопочка</button></div>`;
        return { context: context, template: template, eventListeners: [{ querySelector: '.my-button', event: 'click', func: handler }] };
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