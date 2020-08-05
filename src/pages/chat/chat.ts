import {ChatApiStub} from "../../api/messages-api-stub";
import {ChatPageComponent} from "./components/ChatPageComponent";

document.addEventListener("DOMContentLoaded", function () {
    const api = new ChatApiStub();
    const chat = new ChatPageComponent({}, api);
    chat.init();

    document.getElementById('chat-root').appendChild(chat.getElement());
});