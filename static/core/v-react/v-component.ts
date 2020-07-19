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
    propsUpdated,
    /** Был обновлен state */
    stateUpdated,
    /** У одного из детей обновился state */
    childStateUpdated,
    /** У одного из детей обновился state, стреляет в корневом компоненте */
    childStateUpdatedRoot
}

/**
 * Компонент
 */
export abstract class VComponent<TProps extends object, TState extends object> {
    private readonly tagName: string;
    private readonly eventBus = new EventBus<VfcEvents>();
    private readonly element: HTMLElement;
    private props: TProps;
    private state: TState;
    private readonly parentEventHandlerRegistrar: InternalEventHandlersRegistrar = null;
    private childEventListeners: ComponentEventHandlerInternal[] = [];
    private readonly notifyParentChildStateUpdated: () => void;

    /**
     * Создать компонент. Обязательно вызвать init() после!!!
     * @param props Первоначальные пропсы
     * @param parentEventHandlerRegistrar Родительский регистратор событий
     * @param notifyParentChildStateUpdated Уведомить родителя об изменении своего состояния или одного из дочерних
     * @param tagName
     */
    constructor(props: TProps,
                parentEventHandlerRegistrar: InternalEventHandlersRegistrar = null,
                notifyParentChildStateUpdated: () => void = null,
                tagName: string = 'v-component') {
        this.tagName = tagName;
        this.props = {...props}
        this.parentEventHandlerRegistrar = parentEventHandlerRegistrar;
        this.notifyParentChildStateUpdated = notifyParentChildStateUpdated;

        this.registerEvents(this.eventBus);
        this.element = document.createElement(this.tagName);

        this.setState.bind(this);
        this.init.bind(this);
    }

    public init() {
        this.eventBus.emit(VfcEvents.initComplete); // будет вызван render
        this.eventBus.emit(VfcEvents.componentMounted); // будет вызван пользовательский componentDidMount()
    }

    //TODO ААААААА я забыл про ComponentDidUpdate

    /**
     * Пользовательский render. Должен вернуть Handlebars-шаблон, context для него и список обработчиков
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

    /**
     * Вызывается после первого монтирования компонента в element
     */
    abstract componentDidMount(): void;

    protected registerChildEventListeners = (handlers: ComponentEventHandlerInternal[]) => {
        if (handlers == null) {
            return;
        }

        if (this.parentEventHandlerRegistrar != null) { // если у этого компонента есть родитель, то прокидываем ему
            this.parentEventHandlerRegistrar(handlers);
        } else {
            this.childEventListeners.push(...handlers);
        }
    }

    /**
     * Оператор сравнения пропсов. Опционально определяется пользователем.
     * @param oldProps
     * @param newProps
     */
    protected componentShouldUpdate(oldProps: TProps, newProps: TProps) {
        return oldProps !== newProps;
    }

    /**
     * Вызывается после каждого render (пригодится!)
     */
    protected componentAfterViewInit = () => {
    }

    /**
     * Создать дочерний компонент со всеми привязками
     * @param componentClass Класс компонента
     * @param props Default props
     */
    protected createChildComponent<TComponent extends VComponent<TProps, any>, TProps extends object>(
        componentClass: new (...args: any) => TComponent, props: TProps): TComponent {
        const component = new componentClass(props, this.registerChildEventListeners, this.dispatchChildUpdatedEvent);
        component.init();
        return component;
    }

    protected setState(newState: Partial<TState>) {
        this.state = {...this.state, ...newState};
        this.eventBus.emit(VfcEvents.stateUpdated);
    }

    protected getState(): Readonly<TState> {
        return this.state;
    }

    protected getProps(): Readonly<TProps> {
        return this.props;
    }

    private registerEvents(eventBus: EventBus<VfcEvents>) {

        eventBus.on(VfcEvents.initComplete, this.renderInternal.bind(this)); // сразу после инициализации вызываем рендер
        eventBus.on(VfcEvents.componentMounted, () => this.componentDidMount()); // после маунта вызываем пользовательский componentDidMount
        eventBus.on(VfcEvents.rendered, this.componentAfterViewInit.bind(this)); // хз нужен ли этот ивент
        eventBus.on(VfcEvents.propsUpdated, this.renderInternal.bind(this));
        eventBus.on(VfcEvents.stateUpdated, this.renderInternal.bind(this));
        eventBus.on(VfcEvents.childStateUpdated, this.childStateUpdatedHandler.bind(this));
        eventBus.on(VfcEvents.childStateUpdatedRoot, this.renderInternal.bind(this));
    }

    private registerChildEventListenersInternal = () => {
        if (this.childEventListeners == null || this.childEventListeners.length === 0) {
            return;
        }
        // TODO вынести всю эту логику с добавлением/удалением dataset в отдельную утилитку и покрыть тестами
        const idQuerySelector = `[data-v-event-handler-id]`;
        const elements = Array.from(this.element.querySelectorAll(idQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить

        for (let {event, func, id} of this.childEventListeners) {
            const targetElements = elements.filter(item => (item as HTMLElement).dataset.vEventHandlerId === id);
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
                // TODO добавить поддержку нескольких event handler на один объект
                // TODO вынести всю эту логику с добавлением/удалением dataset в отдельную утилитку и покрыть тестами
                elements.forEach(item => (item as HTMLElement).dataset.vEventHandlerId = id);
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
        this.childEventListeners = []; // каждый рендер DOM "обнуляется" и приходится заново вешать обработчики.

        const {context, template, eventListeners} = this.render(this.props);
        const compiledTemplate = window.Handlebars.compile(template);
        this.element.innerHTML = compiledTemplate(context || {})
        this.registerEventListeners(eventListeners);
        this.registerChildEventListenersInternal();
        this.eventBus.emit(VfcEvents.rendered);
    }

    private dispatchChildUpdatedEvent = () => {
        this.eventBus.emit(VfcEvents.childStateUpdated);
    }

    private childStateUpdatedHandler = () => {
        if (this.notifyParentChildStateUpdated != null) {
            this.notifyParentChildStateUpdated();
        } else {
            this.eventBus.emit(VfcEvents.childStateUpdatedRoot);
        }
    }
}