// language=Handlebars
export const inputErrorMessagesListTemplate = `
{{#each errors}}
    <div class="auth-block__validation-error-text">{{this}}</div>
{{/each}}
`

