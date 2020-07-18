import {EventBus} from "./event-bus.js";
import {ComponentEventHandler} from "./types/component-event-handler";
import {ComponentEventHandlerInternal} from "./types/internal-component-event-handler";
import {InternalEventHandlersRegistrar} from "./types/internal-event-handlers-registrar";
import {uuidv4} from "../../utils/uuid.js";

enum VfcEvents {
    /** Все поля компонента проинициализированы */
    initComplete,
    /** Компонент вставлен во внутренний element */
    componentMounted,
    /** Был произведен render */
    rendered,
    /** Были обновлены props, componentShouldUpdate вернуло true */
    propsUpdated
}

/**
 * Компонент без состояния
 */
export abstract class VFunctionalComponent<TProps extends object> {
    private readonly tagName: string;
    private props: TProps;
    private readonly eventBus = new EventBus<VfcEvents>();
    private readonly element: HTMLElement;
    private readonly parentEventHandlerRegistrar: InternalEventHandlersRegistrar = null;
    private childEventListeners: ComponentEventHandlerInternal[] = [];

    constructor(props: TProps = null, parentEventHandlerRegistrar: InternalEventHandlersRegistrar = null, tagName: string = 'v-functional-component') {
        this.tagName = tagName;
        this.props = {...props}
        this.parentEventHandlerRegistrar = parentEventHandlerRegistrar;
        this.registerEvents(this.eventBus);

        this.element = document.createElement(this.tagName);
        this.eventBus.emit(VfcEvents.initComplete); // будет вызван render
        this.eventBus.emit(VfcEvents.componentMounted); // будет вызван пользовательский
    }

    /**
     * Пользовательский render. Должен вернуть Handlebars-шаблон и context для него.
     */
    public abstract render(props: Readonly<TProps>): { template: string, context: object, eventListeners?: ComponentEventHandler[] };

    public getElement() {
        return this.element;
    }

    public getElementHtml() {
        return this.element.innerHTML;
    }

    public setProps(newProps: TProps) {
        const oldProps = this.props;
        this.props = newProps;
        if (this.componentShouldUpdate(oldProps, newProps)) {
            this.eventBus.emit(VfcEvents.propsUpdated)
        }
    }

    protected registerChildEventListeners = (handlers: ComponentEventHandlerInternal[]) => {
        if (handlers == null) {
            return;
        }

        this.childEventListeners.push(...handlers);
    }

    /**
     * Оператор сравнения пропсов. Опционально определяется пользователем.
     * @param oldProps
     * @param newProps
     */
    protected componentShouldUpdate(oldProps: TProps, newProps: TProps) {
        return true;
    }

    /**
     * Вызывается после первого монтирования компонента в element
     */
    protected componentDidMount() {
    }

    /**
     * Вызывается после каждого render (пригодится!)
     */
    protected componentAfterViewInit() {
    }

    private registerEvents(eventBus: EventBus<VfcEvents>) {
        eventBus.on(VfcEvents.initComplete, this.renderInternal.bind(this)); // сразу после инициализации вызываем рендер
        eventBus.on(VfcEvents.componentMounted, this.componentDidMount.bind(this)); // после маунта вызываем пользовательский componentDidMount
        eventBus.on(VfcEvents.rendered, this.componentAfterViewInit.bind(this));
        eventBus.on(VfcEvents.propsUpdated, this.renderInternal.bind(this));
    }

    private registerChildEventListenersInternal = () => {
        if (this.childEventListeners == null || this.childEventListeners.length === 0) {
            return;
        }
        const idQuerySelector = `[data-event-handler-id]`;
        const elements = Array.from(this.element.querySelectorAll(idQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить

        for (let {event, func, id} of this.childEventListeners) {
            const targetElements = elements.filter(item => (item as HTMLElement).dataset.eventHandlerId === id);
            targetElements.forEach(item => item.addEventListener(event, func));
        }
    }

    private registerEventListeners = (handlers: ComponentEventHandler[]) => {
        if (handlers == null) {
            return;
        }

        if (this.parentEventHandlerRegistrar != null) {
            const internalHandlers: ComponentEventHandlerInternal[] = [];

            for (let {event, func, querySelector} of handlers) {
                const id = uuidv4();
                const elements = this.element.querySelectorAll(querySelector);
                elements.forEach(item => (item as HTMLElement).dataset.eventHandlerId = id);
                internalHandlers.push({id: id, event: event, func: func});
            }

            this.parentEventHandlerRegistrar(internalHandlers);
        } else {
            for (let {event, func, querySelector} of handlers) {
                const elements = this.element.querySelectorAll(querySelector);
                elements.forEach(item => item.addEventListener(event, func))
            }
        }
    }

    private renderInternal = () => {
        this.childEventListeners = [];

        const {context, template, eventListeners} = this.render(this.props);
        const compiledTemplate = Handlebars.compile(template, context);
        this.element.innerHTML = compiledTemplate(context)
        this.registerEventListeners(eventListeners);
        this.registerChildEventListenersInternal();
        this.eventBus.emit(VfcEvents.rendered);
    }
}