function isEqual(lhs, rhs) {
    return lhs === rhs;
}
export class VRoute {
    constructor(pathname, component) {
        this.pathname = pathname;
        this.component = component;
        if (pathname == null) {
            throw new TypeError(`expected component, but got ${pathname}`);
        }
        if (component == null) {
            throw new TypeError(`expected component, but got ${component}`);
        }
    }
    leave() {
        this.component.hide();
    }
    match(pathname) {
        pathname = pathname.replace('#', '');
        return isEqual(pathname, this.pathname);
    }
    render(node) {
        this.component.show();
        node.appendChild(this.component.getElement());
    }
}
//# sourceMappingURL=v-route.js.map