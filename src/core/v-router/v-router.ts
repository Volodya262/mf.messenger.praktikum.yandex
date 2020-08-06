import {VComponent} from "../v-react/v-component";
import {VRoute} from "./v-route";

export class VRouter {
    static instance: VRouter;

    currentRoute: VRoute = null;
    private routes: VRoute[] = [];
    private history = window.history;

    constructor(private rootNode: HTMLElement) { // просто копипастнул код из тренажера
        if (VRouter.instance) {
            return VRouter.instance;
        }

        VRouter.instance = this;
    }

    use(pathname: string, block: VComponent<any, any>): VRouter {
        const route = new VRoute(pathname, block);
        this.routes.push(route);
        return this;
    }

    start: () => void = () => {
        window.onpopstate = (event) => {
            if (document.location != null) {
                this.handlePathChange(document.location.hash);
            }
        }

        this.handlePathChange(document.location.hash);
    }

    go(pathname: string): void {
        // history.pushState({}, '', pathname)
        window.location.hash = pathname;
        this.handlePathChange(pathname);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    getRoute(pathname: string): VRoute {
        return this.routes.find(route => route.match(pathname));
    }

    private handlePathChange(pathname: string) {
        const route = this.getRoute(pathname);
        if (route == null) {
            const err = `route ${pathname} не найден`;
            console.error(err);
            throw new Error(err);
        }

        if (route !== this.currentRoute && this.currentRoute != null) {
            this.currentRoute.leave();
        }

        this.currentRoute = route;
        route?.render(this.rootNode);
    }
}