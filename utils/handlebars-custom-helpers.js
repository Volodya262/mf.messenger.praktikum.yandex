Handlebars.registerHelper('dateFormat', function (date) {
    return dateFns.format(date, 'DD.MM.YYYY')
})

Handlebars.registerHelper('timeFormat', function (date) {
    return dateFns.format(date, 'HH:mm')
})

