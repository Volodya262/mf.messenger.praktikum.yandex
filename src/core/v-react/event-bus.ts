type myCallback = ((...args: any) => void);

export class EventBus<TEvent> {
    // https://codeburst.io/array-vs-set-vs-map-vs-object-real-time-use-cases-in-javascript-es6-47ee3295329b
    // https://gist.github.com/jung-kim/83676b2310c7c2a9c3d8 сравнение производительности Map, Array, Object. Map быстрее.
    // Я использовал Map из-за готового метода has и проверки на уникальность ключа.
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