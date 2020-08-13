type myCallback = ((...args: any) => void);

export class EventBus<TEvent> {
    // ссылки были для предыдущего код-ревьюера :)
    listeners = new Map<TEvent, myCallback[]>();

    on(event: TEvent, callback: myCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(callback);
    }

    off(event: TEvent, callback: myCallback): void {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }

        const filtered = this.listeners.get(event).filter(
            listener => listener !== callback
        );

        this.listeners.set(event, filtered);
    }

    emit(event: TEvent, ...args: any[]): void {
        if (!this.listeners.has(event)) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners.get(event).forEach(function (listener) {
            listener(...args);
        });
    }
}
