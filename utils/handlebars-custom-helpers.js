Handlebars.registerHelper('dateFormat', function (date) {
    return dateFns.format(date, 'DD.MM.YYYY')
})