import {VRoute} from "./v-route.js";

export class VRouter {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.currentRoute = null;
        this.routes = [];
        this.history = window.history;
        this.start = () => {
            window.onpopstate = (event) => {
                console.log('pop');
                if (document.location != null) {
                    this.handlePathChange(document.location.hash);
                }
            };
            this.handlePathChange(document.location.hash);
        };
        if (VRouter.instance) {
            return VRouter.instance;
        }
        VRouter.instance = this;
    }
    use(pathname, block) {
        const route = new VRoute(pathname, block);
        this.routes.push(route);
        return this;
    }
    go(pathname) {
        // history.pushState({}, '', pathname)
        window.location.hash = pathname;
        this.handlePathChange(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname) {
        return this.routes.find(route => route.match(pathname));
    }
    handlePathChange(pathname) {
        const route = this.getRoute(pathname);
        if (route == null) {
            console.log(`route ${pathname} не найден`);
        }
        if (route !== this.currentRoute && this.currentRoute != null) {
            this.currentRoute.leave();
        }
        this.currentRoute = route;
        route === null || route === void 0 ? void 0 : route.render(this.rootNode);
    }
}
//# sourceMappingURL=v-router.js.map