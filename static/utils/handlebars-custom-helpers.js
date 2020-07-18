Handlebars.registerHelper('dateFormat', function (date) {
    return dateFns.format(date, 'DD.MM.YYYY');
});
Handlebars.registerHelper('timeFormat', function (date) {
    return dateFns.format(date, 'HH:mm');
});
Handlebars.registerHelper('createAndRenderComponent', function (componentClass, props, registerEventHandlers) {
    const component = new componentClass(props, registerEventHandlers);
    return component.getElementHtml();
});
//# sourceMappingURL=handlebars-custom-helpers.js.map