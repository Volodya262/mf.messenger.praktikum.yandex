import {EventBus} from "./event-bus.js";
import {uuidv4} from "../../utils/uuid.js";

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
    /** Был обновлен state */
    VfcEvents[VfcEvents["stateUpdated"] = 4] = "stateUpdated";
    /** У одного из детей обновился state */
    VfcEvents[VfcEvents["childStateUpdated"] = 5] = "childStateUpdated";
    /** У одного из детей обновился state, стреляет в корневом компоненте */
    VfcEvents[VfcEvents["childStateUpdatedRoot"] = 6] = "childStateUpdatedRoot";
})(VfcEvents || (VfcEvents = {}));

/**
 * Компонент
 */
export class VComponent {
    /**
     * Создать компонент
     * @param props Первоначальные пропсы
     * @param parentEventHandlerRegistrar Родительский регистратор событий
     * @param notifyParentChildStateUpdated Уведомить родителя об изменении своего состояния или одного из дочерних
     * @param tagName
     */
    constructor(props, parentEventHandlerRegistrar = null, notifyParentChildStateUpdated = null, tagName = 'v-functional-component') {
        this.eventBus = new EventBus();
        this.parentEventHandlerRegistrar = null;
        this.childEventListeners = [];
        this.registerChildEventListeners = (handlers) => {
            if (handlers == null) {
                return;
            }
            if (this.parentEventHandlerRegistrar != null) { // если у этого компонента есть родитель, то прокидываем ему
                this.parentEventHandlerRegistrar(handlers);
            } else {
                this.childEventListeners.push(...handlers);
            }
        };
        /**
         * Вызывается после каждого render (пригодится!)
         */
        this.componentAfterViewInit = () => {
        };
        this.registerChildEventListenersInternal = () => {
            if (this.childEventListeners == null || this.childEventListeners.length === 0) {
                return;
            }
            // TODO вынести всю эту логику с добавлением/удалением dataset в отдельную утилитку и покрыть тестами
            const idQuerySelector = `[data-v-event-handler-id]`;
            const elements = Array.from(this.element.querySelectorAll(idQuerySelector)); // нашли все ноды, которым надо будет что-то присвоить
            for (let {event, func, id} of this.childEventListeners) {
                const targetElements = elements.filter(item => item.dataset.vEventHandlerId === id);
                targetElements.forEach(item => item.addEventListener(event, func));
            }
        };
        this.registerEventListeners = (handlers) => {
            if (handlers == null) {
                return;
            }
            if (this.parentEventHandlerRegistrar != null) {
                const internalHandlers = [];
                for (let {event, func, querySelector} of handlers) {
                    const id = uuidv4();
                    const elements = this.element.querySelectorAll(querySelector);
                    // TODO сейчас поддерживается только один event handler на один объект
                    // TODO вынести всю эту логику с добавлением/удалением dataset в отдельную утилитку и покрыть тестами
                    elements.forEach(item => item.dataset.vEventHandlerId = id);
                    internalHandlers.push({id: id, event: event, func: func});
                }
                this.parentEventHandlerRegistrar(internalHandlers);
            } else {
                for (let {event, func, querySelector} of handlers) {
                    const elements = this.element.querySelectorAll(querySelector);
                    elements.forEach(item => item.addEventListener(event, func));
                }
            }
        };
        this.renderInternal = () => {
            this.childEventListeners = [];
            const {context, template, eventListeners} = this.render(this.props);
            const compiledTemplate = window.Handlebars.compile(template, context);
            this.element.innerHTML = compiledTemplate(context);
            this.registerEventListeners(eventListeners);
            this.registerChildEventListenersInternal();
            this.eventBus.emit(VfcEvents.rendered);
        };
        this.dispatchChildUpdatedEvent = () => {
            this.eventBus.emit(VfcEvents.childStateUpdated);
        };
        this.childStateUpdatedHandler = () => {
            if (this.notifyParentChildStateUpdated != null) {
                this.notifyParentChildStateUpdated();
            } else {
                this.eventBus.emit(VfcEvents.childStateUpdatedRoot);
            }
        };
        this.tagName = tagName;
        this.props = Object.assign({}, props);
        this.parentEventHandlerRegistrar = parentEventHandlerRegistrar;
        this.notifyParentChildStateUpdated = notifyParentChildStateUpdated;
        this.registerEvents(this.eventBus);
        this.element = document.createElement(this.tagName);
        this.eventBus.emit(VfcEvents.initComplete); // будет вызван render
        this.eventBus.emit(VfcEvents.componentMounted); // будет вызван пользовательский
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
        return oldProps !== newProps;
    }

    createChildComponent(componentClass, props) {
        return new componentClass(props, this.registerChildEventListeners, this.dispatchChildUpdatedEvent);
    }

    setState(newState) {
        this.state = Object.assign({}, newState);
        this.eventBus.emit(VfcEvents.stateUpdated);
    }

    getState() {
        return this.state;
    }

    registerEvents(eventBus) {
        eventBus.on(VfcEvents.initComplete, this.renderInternal.bind(this)); // сразу после инициализации вызываем рендер
        eventBus.on(VfcEvents.componentMounted, this.componentDidMount.bind(this)); // после маунта вызываем пользовательский componentDidMount
        eventBus.on(VfcEvents.rendered, this.componentAfterViewInit.bind(this)); // хз нужен ли этот ивент
        eventBus.on(VfcEvents.propsUpdated, this.renderInternal.bind(this));
        eventBus.on(VfcEvents.stateUpdated, this.renderInternal.bind(this));
        eventBus.on(VfcEvents.childStateUpdated, this.childStateUpdatedHandler.bind(this));
        eventBus.on(VfcEvents.childStateUpdatedRoot, this.renderInternal.bind(this));
    }
}

//# sourceMappingURL=v-component.js.map