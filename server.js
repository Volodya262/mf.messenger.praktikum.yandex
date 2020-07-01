const express = require('express');

const app = express();
const PORT = 4000;

// const myDir = 'static'

app.use('/', express.static(`${__dirname}`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/*', (req, res) => {
    res.sendFile(`${__dirname}/not-found.html`);
})

app.listen(PORT, () => {
  console.log(`Приложение доступно по адресу: http://localhost:${PORT}!`);
});