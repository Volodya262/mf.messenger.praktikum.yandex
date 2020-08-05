import {logoTemplate} from "./common/templates/logo.tmpl.js";

// TODO удалить когда весь проект переедет на компоненты
const template = window.Handlebars.compile(logoTemplate);
document.getElementById('logo-root').innerHTML = template(logoTemplate);