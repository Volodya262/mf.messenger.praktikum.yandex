import {EventBus} from "./event-bus";
import {ComponentEventHandler} from "./types/component-event-handler";
import {ComponentEventHandlerInternal} from "./types/internal-component-event-handler";
import {InternalEventHandlersRegistrar} from "./types/internal-event-handlers-registrar";
import {
    findAllTaggedElements,
    findTargetElements,
    tagAllElementsWithUniqueEventHandlerId
} from "./helpers/event-handlers-helper";
import Handlebars from 'handlebars';

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
    /** Состояние компонента. Вызывать только в конструкторе! */
    protected state: TState; // TODO можно инициализировать state в конструкторе VComponent
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
                tagName = 'v-component') {
        this.tagName = tagName;
        this.props = {...props};
        this.parentEventHandlerRegistrar = parentEventHandlerRegistrar;
        this.notifyParentChildStateUpdated = notifyParentChildStateUpdated;

        this.registerEvents(this.eventBus);
        this.element = document.createElement(this.tagName);

        this.setState.bind(this);
    }

    public init(): void {
        // TODO добавить абстрактную функцию initChildComponents
        this.eventBus.emit(VfcEvents.initComplete); // будет вызван render
        this.eventBus.emit(VfcEvents.componentMounted); // будет вызван пользовательский componentDidMount()
    }

    //TODO ААААААА я забыл про ComponentDidUpdate

    /**
     * Пользовательский render. Должен вернуть Handlebars-шаблон, context для него и список обработчиков
     */
    public abstract render(props: Readonly<TProps>): { template: string, context: Record<string, unknown>, eventListeners?: ComponentEventHandler[] };

    /**
     * Получить ноду компонента
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Получить HTML компонента. Внимание! Все обработчики событий будут потеряны.
     */
    public getElementHtml(): string {
        return this.element.innerHTML;
    }

    /**
     * Установить новые пропсы компонента. Предназначено для вызова снаружи.
     */
    public setProps(newProps: TProps): void {
        const oldProps = this.props;
        this.props = newProps;
        if (this.componentShouldUpdate(oldProps, newProps)) {
            this.eventBus.emit(VfcEvents.propsUpdated);
        }
    }

    /**
     * Вызывается после первого монтирования компонента в element
     */
    // отключаем эту проверку для этой строки так как хотим ОПЦИОНАЛЬНО перекрывать этот метод
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    componentDidMount(): void {
    }

    public show(): void {
        this.element.style.display = 'block';
    }

    public hide(): void {
        this.element.style.display = 'none';
    }

    protected registerChildEventListeners: (handlers: ComponentEventHandlerInternal[]) => void = (handlers: ComponentEventHandlerInternal[]) => {
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
    protected componentShouldUpdate(oldProps: TProps, newProps: TProps): boolean {
        return oldProps !== newProps;
    }

    /**
     * Вызывается после каждого render (пригодится!)
     */
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected componentAfterViewInit: () => void = () => {
    }

    protected getState(): Readonly<TState> {
        return this.state;
    }

    protected getProps(): Readonly<TProps> {
        return this.props;
    }

    protected setState(newState: Partial<TState>): void {
        this.state = {...this.state, ...newState};
        this.eventBus.emit(VfcEvents.stateUpdated);
    }

    /**
     * Создать дочерний компонент со всеми привязками
     * @param componentClass Класс компонента
     * @param props Default props
     */
    protected createChildComponent<TComponent extends VComponent<TProps, any>, TProps extends object>(
        componentClass: new (props: TProps,
                             parentEventHandlerRegistrar: InternalEventHandlersRegistrar,
                             notifyParentChildStateUpdated: () => void) => TComponent,
        props: TProps): TComponent {
        const component = new componentClass(props, this.registerChildEventListeners, this.dispatchChildUpdatedEvent);
        component.init();
        return component;
    }

    private registerEvents(eventBus: EventBus<VfcEvents>) {
        eventBus.on(VfcEvents.initComplete, this.renderInternal.bind(this)); // сразу после инициализации вызываем рендер
        eventBus.on(VfcEvents.componentMounted, () => this.componentDidMount()); // после маунта вызываем пользовательский componentDidMount
        eventBus.on(VfcEvents.rendered, this.componentAfterViewInit.bind(this)); // хз нужен ли этот ивент
        eventBus.on(VfcEvents.propsUpdated, this.renderInternal.bind(this));
        eventBus.on(VfcEvents.stateUpdated, this.stateUpdatedHandler.bind(this));
        eventBus.on(VfcEvents.childStateUpdated, this.stateUpdatedHandler.bind(this));
        eventBus.on(VfcEvents.childStateUpdatedRoot, this.renderInternal.bind(this));
    }

    private registerChildEventListenersInternal = () => {
        if (this.childEventListeners == null || this.childEventListeners.length === 0) {
            return;
        }

        const elements = findAllTaggedElements(this.getElement());
        for (const {event, func, id} of this.childEventListeners) {
            const targetElements = findTargetElements(elements, id);
            targetElements.forEach(item => item.addEventListener(event, func));
        }
    }

    private dispatchChildUpdatedEvent = () => {
        this.eventBus.emit(VfcEvents.childStateUpdated);
    }

    private stateUpdatedHandler = () => {
        if (this.notifyParentChildStateUpdated != null) {
            this.notifyParentChildStateUpdated();
        } else {
            this.eventBus.emit(VfcEvents.childStateUpdatedRoot);
        }
    }

    private registerEventListeners = (handlers: ComponentEventHandler[]) => {
        if (handlers == null) {
            return;
        }

        if (this.parentEventHandlerRegistrar != null) {
            const internalHandlers = tagAllElementsWithUniqueEventHandlerId(this.element, handlers);
            this.parentEventHandlerRegistrar(internalHandlers);
        } else {
            for (const {event, func, querySelector} of handlers) {
                const elements = this.element.querySelectorAll(querySelector);
                elements.forEach(item => item.addEventListener(event, func));
            }
        }
    }

    private renderInternal = () => {
        this.childEventListeners = []; // каждый рендер DOM "обнуляется" и приходится заново вешать обработчики.

        const {context, template, eventListeners} = this.render(this.props);
        const compiledTemplate = Handlebars.compile(template);
        this.element.innerHTML = compiledTemplate(context || {});
        this.registerEventListeners(eventListeners);
        this.registerChildEventListenersInternal();
        this.eventBus.emit(VfcEvents.rendered);
    }
}