import {logoTemplate} from "../common-templates/logo.tmpl.js";

const template = Handlebars.compile(logoTemplate);
document.getElementById('logo-root').innerHTML = template(logoTemplate);