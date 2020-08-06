import {logoTemplate} from "./common/templates/logo.tmpl.js";
import Handlebars from 'handlebars'

// TODO удалить когда весь проект переедет на компоненты
const template = Handlebars.compile(logoTemplate);
document.getElementById('logo-root').innerHTML = template(logoTemplate);