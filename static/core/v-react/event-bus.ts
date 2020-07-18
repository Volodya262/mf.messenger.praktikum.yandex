type myCallback = ((...args: any) => void);

export class EventBus<TEvent> {
    listeners = new Map<TEvent, myCallback[]>();

    constructor() {
    }

    on(event: TEvent, callback: myCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(callback);
    }

    off(event: TEvent, callback: myCallback) {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }

        const filtered = this.listeners.get(event).filter(
            listener => listener !== callback
        );

        this.listeners.set(event, filtered);
    }

    emit(event: TEvent, ...args) {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners.get(event).forEach(function (listener) {
            listener(...args);
        });
    }
}