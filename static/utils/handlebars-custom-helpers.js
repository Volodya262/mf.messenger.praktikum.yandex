export function registerAll(handlebars = null) {
    const target = handlebars || window.Handlebars;
    target.registerHelper('dateFormat', function (date) {
        return window.dateFns.format(date, 'DD.MM.YYYY');
    });
    target.registerHelper('timeFormat', function (date) {
        return window.dateFns.format(date, 'HH:mm');
    });
    target.registerHelper('renderFunctionalComponent', function (componentClass, props, registerEventHandlers) {
        const component = new componentClass(props, registerEventHandlers);
        component.init();
        return component.getElementHtml();
    });
    target.registerHelper('renderComponentInstance', function (component, props) {
        component.setProps(props);
        return component.getElementHtml();
    });
}
//# sourceMappingURL=handlebars-custom-helpers.js.map