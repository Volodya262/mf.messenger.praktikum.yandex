// import {EventBus} from "./event-bus";
//
// export abstract class VComponent {
//     static EVENTS = {
//         INIT: "init",
//         FLOW_CDM: "flow:component-did-mount",
//         FLOW_CDU: "flow:component-did-update",
//         FLOW_RENDER: "flow:render"
//     };
//
//     private _element = null;
//     private _meta: {
//         tagname: string,
//         props: object
//     }
//
//     /** JSDoc
//      * @param {string} tagName
//      * @param {Object} props
//      *
//      * @returns {void}
//      */
//     constructor(tagName = "div", props = {}) {
//         const eventBus = new EventBus();
//         this._meta = {
//             tagName,
//             props
//         };
//
//         this.props = this._makePropsProxy(props);
//
//         this.eventBus = () => eventBus;
//
//         this._registerEvents(eventBus);
//         eventBus.emit(VComponent.EVENTS.INIT);
//     }
//
//     _registerEvents(eventBus) {
//         eventBus.on(VComponent.EVENTS.INIT, this.init.bind(this));
//         eventBus.on(VComponent.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
//         eventBus.on(VComponent.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
//         eventBus.on(VComponent.EVENTS.FLOW_RENDER, this._render.bind(this));
//     }
//
//     _createResources() {
//         const { tagName } = this._meta;
//         this._element = this.createDocumentElement(tagName);
//     }
//
//     init() {
//         this._createResources();
//         this.eventBus().emit(VComponent.EVENTS.FLOW_CDM);
//     }
//
//     _componentDidMount() {
//         this.componentDidMount();
//         this.eventBus().emit(VComponent.EVENTS.FLOW_RENDER);
//     }
//
//     // Может переопределять пользователь, необязательно трогать
//     componentDidMount(oldProps) { }
//
//     _componentDidUpdate(oldProps, newProps) {
//         const response = this.componentDidUpdate(oldProps, newProps);
//         if (response) {
//             this.eventBus().emit(VComponent.EVENTS.FLOW_RENDER);
//         }
//     }
//
//     // Может переопределять пользователь, необязательно трогать
//     componentDidUpdate(oldProps, newProps) {
//         return true;
//     }
//
//     setProps = nextProps => {
//         if (!nextProps) {
//             return;
//         }
//
//         const oldProps = this.props;
//         Object.assign(this.props, nextProps);
//         this.eventBus().emit(VComponent.EVENTS.FLOW_CDU, oldProps, nextProps)
//     };
//
//     get element() {
//         return this._element;
//     }
//
//     _render() {
//         const block = this.render();
//         // Этот небезопасный метод для упрощения логики
//         // Используйте шаблонизатор из npm или напиши свой безопасный
//         // Нужно не в строку компилировать (или делать это правильно),
//         // либо сразу в DOM-элементы превращать из возвращать из compile DOM-ноду
//         this._element.innerHTML = block;
//     }
//
//     // Может переопределять пользователь, необязательно трогать
//     render() { }
//
//     getContent() {
//         return this.element;
//     }
//
//     private createDocumentElement(tagName) {
//         return document.createElement(tagName);
//     }
//
//     public show = () => {
//         this.element.style.display = 'block'
//     }
//
//     public hide = () => {
//         this.element.style.display = 'none'
//     }
// }