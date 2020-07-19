import {ChatApiStub} from "../../api/messages-api-stub.js";
import {ChatWindowComponent} from "./components/ChatWindowComponent.js";

document.addEventListener("DOMContentLoaded", function () {
    const api = new ChatApiStub();
    const chat = new ChatWindowComponent({}, api);
    chat.init();

    document.getElementById('chat-root').appendChild(chat.getElement());
});