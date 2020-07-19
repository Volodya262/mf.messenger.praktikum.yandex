import {VComponent} from "./v-component.js";
import {ComponentEventHandler} from "./types/component-event-handler.js";
import crypto from '@trust/webcrypto';
import * as Handlebars from 'handlebars'
import {registerAll} from "../../utils/handlebars-custom-helpers";

beforeAll(() => {
    window.Handlebars = Handlebars;

    // @ts-ignore
    // noinspection JSConstantReassignment
    window.crypto = crypto;
    registerAll();
})

describe('VComponentTests: single component', function () {
    interface TestProps {
        name: string;
    }

    class TestableComponent extends VComponent<TestProps, object> {
        componentDidMount() {
        };

        public render(props: Readonly<TestProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
            // language=Handlebars
            const template = `<h1>Hello {{name}}</h1>`;
            return {context: {name: props.name}, template: template};
        }
    }

    test('It should render simple template', function () {
        // setup
        const myComponent = new TestableComponent({name: 'vasya'});

        // act
        const element = myComponent.getElement();

        // verify
        expect(element.innerHTML).toBe('<h1>Hello vasya</h1>')
    });

    test('It should update template after setProps', function () {
        // setup
        const myComponent = new TestableComponent({name: 'vasya'});
        myComponent.setProps({name: 'vova'})

        // act
        const element = myComponent.getElement();

        // verify
        expect(element.innerHTML).toBe('<h1>Hello vova</h1>')
    })

    test('it should call componentDidMount only once', function () {
        const mockFunction = jest.fn();

        class TestableComponent2 extends VComponent<TestProps, object> {
            render(props: Readonly<TestProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
                return {context: undefined, template: '<div>hello</div>'};
            }

            componentDidMount() {
                mockFunction();
            }
        }

        const myComponent = new TestableComponent2({name: ''});

        // act
        myComponent.setProps({name: 'vova'})

        // verify
        expect(mockFunction).toBeCalledTimes(1);
    })
})

describe('VComponentTests: parent and child component', function () {

})
