import {LoginPageComponent} from "./components/LoginPageComponent.js";

document.addEventListener("DOMContentLoaded", function () {
    const pageComponent = new LoginPageComponent({});
    pageComponent.init();

    document.getElementById('login-root').appendChild(pageComponent.getElement());
})