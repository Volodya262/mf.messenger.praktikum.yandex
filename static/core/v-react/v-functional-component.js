import { EventBus } from "./event-bus.js";
import { uuidv4 } from "../../utils/uuid.js";
var VfcEvents;
(function (VfcEvents) {
    /** Все поля компонента проинициализированы */
    VfcEvents[VfcEvents["initComplete"] = 0] = "initComplete";
    /** Компонент вставлен во внутренний element */
    VfcEvents[VfcEvents["componentMounted"] = 1] = "componentMounted";
    /** Был произведен render */
    VfcEvents[VfcEvents["rendered"] = 2] = "rendered";
    /** Были обновлены props, componentShouldUpdate вернуло true */
    VfcEvents[VfcEvents["propsUpdated"] = 3] = "propsUpdated";
})(VfcEvents || (VfcEvents = {}));
/**
 * Компонент без состояния
 */
export class VFunctionalComponent {
    constructor(props = null, parentEventHandlerRegistrar = null, tagName = 'v-functional-component') {
        this.eventBus = new EventBus();
        this.parentEventHandlerRegistrar = null;
        this.childEventListeners = [];
        this.registerChildEventListeners = (handlers) => {
            if (handlers == null) {
                return;
            }
            this.childEventListeners.push(...handlers);
        };
        this.registerChildEventListenersInternal = () => {
            if (this.childEventListeners == null || this.childEventListeners.length === 0) {
                return;
            }
            const idQuerySelector = `[data-event-handler-id]`;
            const elements = Array.from(this.element.querySelectorAll(idQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить
            for (let { event, func, id } of this.childEventListeners) {
                const targetElements = elements.filter(item => item.dataset.eventHandlerId === id);
                targetElements.forEach(item => item.addEventListener(event, func));
            }
        };
        this.registerEventListeners = (handlers) => {
            if (handlers == null) {
                return;
            }
            if (this.parentEventHandlerRegistrar != null) {
                const internalHandlers = [];
                for (let { event, func, querySelector } of handlers) {
                    const id = uuidv4();
                    const elements = this.element.querySelectorAll(querySelector);
                    elements.forEach(item => item.dataset.eventHandlerId = id);
                    internalHandlers.push({ id: id, event: event, func: func });
                }
                this.parentEventHandlerRegistrar(internalHandlers);
            }
            else {
                for (let { event, func, querySelector } of handlers) {
                    const elements = this.element.querySelectorAll(querySelector);
                    elements.forEach(item => item.addEventListener(event, func));
                }
            }
        };
        this.renderInternal = () => {
            this.childEventListeners = [];
            const { context, template, eventListeners } = this.render(this.props);
            const compiledTemplate = Handlebars.compile(template, context);
            this.element.innerHTML = compiledTemplate(context);
            this.registerEventListeners(eventListeners);
            this.registerChildEventListenersInternal();
            this.eventBus.emit(VfcEvents.rendered);
        };
        this.tagName = tagName;
        this.props = Object.assign({}, props);
        this.parentEventHandlerRegistrar = parentEventHandlerRegistrar;
        this.registerEvents(this.eventBus);
        this.element = document.createElement(this.tagName);
        this.eventBus.emit(VfcEvents.initComplete); // будет вызван render
        this.eventBus.emit(VfcEvents.componentMounted); // будет вызван пользовательский
    }
    registerEvents(eventBus) {
        eventBus.on(VfcEvents.initComplete, this.renderInternal.bind(this)); // сразу после инициализации вызываем рендер
        eventBus.on(VfcEvents.componentMounted, this.componentDidMount.bind(this)); // после маунта вызываем пользовательский componentDidMount
        eventBus.on(VfcEvents.rendered, this.componentAfterViewInit.bind(this));
        eventBus.on(VfcEvents.propsUpdated, this.renderInternal.bind(this));
    }
    getElement() {
        return this.element;
    }
    getElementHtml() {
        return this.element.innerHTML;
    }
    setProps(newProps) {
        const oldProps = this.props;
        this.props = newProps;
        if (this.componentShouldUpdate(oldProps, newProps)) {
            this.eventBus.emit(VfcEvents.propsUpdated);
        }
    }
    /**
     * Оператор сравнения пропсов. Опционально определяется пользователем.
     * @param oldProps
     * @param newProps
     */
    componentShouldUpdate(oldProps, newProps) {
        return true;
    }
    /**
     * Вызывается после первого монтирования компонента в element
     */
    componentDidMount() {
    }
    /**
     * Вызывается после каждого render (нахуя?)
     */
    componentAfterViewInit() {
    }
}
//# sourceMappingURL=v-functional-component.js.map