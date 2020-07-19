import {VComponent} from "../v-react/v-component.js";

function isEqual(lhs, rhs) {
    return lhs === rhs;
}

export class VRoute {
    constructor(private pathname: string, private component: VComponent<any, any>) {
        if (pathname == null) {
            throw new TypeError(`expected component, but got ${pathname}`)
        }

        if (component == null) {
            throw new TypeError(`expected component, but got ${component}`)
        }
    }

    public leave() {
        this.component.hide();
    }

    match(pathname) {
        pathname = pathname.replace('#', '');
        return isEqual(pathname, this.pathname);
    }

    public render(node: HTMLElement) {
        this.component.show();
        node.appendChild(this.component.getElement())
    }
}