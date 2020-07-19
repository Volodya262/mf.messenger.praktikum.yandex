import { ChatApiStub } from "../../api/messages-api-stub.js";
import { ChatPageComponent } from "./components/ChatPageComponent.js";
document.addEventListener("DOMContentLoaded", function () {
    const api = new ChatApiStub();
    const chat = new ChatPageComponent({}, api);
    chat.init();
    document.getElementById('chat-root').appendChild(chat.getElement());
});
//# sourceMappingURL=chat.js.map