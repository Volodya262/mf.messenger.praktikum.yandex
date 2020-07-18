export class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }
        const filtered = this.listeners.get(event).filter(listener => listener !== callback);
        this.listeners.set(event, filtered);
    }
    emit(event, ...args) {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners.get(event).forEach(function (listener) {
            listener(...args);
        });
    }
}
//# sourceMappingURL=event-bus.js.map