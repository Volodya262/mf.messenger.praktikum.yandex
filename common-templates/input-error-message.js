// language=Handlebars
export const inputErrorMessagesListTemplate = `
    {{#each errors}}
        <div class="validation-error-text">{{this}}</div>
    {{/each}}
`

