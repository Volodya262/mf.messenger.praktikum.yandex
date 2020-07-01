document.addEventListener("DOMContentLoaded", function () {
    const chatItemTemplate = document.templates.chatList;
    const template = Handlebars.compile(chatItemTemplate);
    //const context = {title: "Выделенный123 чат", date: new Date(), author: "Владимир", message: "Всем привет!"};
    document.api.chatApiStub.getChats().then(
        chats => {
            if (chats.length > 0) {
                chats[0].isSelected = true;
            }

            const context = {chats: chats}
            document.getElementById('chat-list-container').innerHTML = template(context);
        }
    );
});