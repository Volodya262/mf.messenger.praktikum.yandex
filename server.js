const express = require('express');

const app = express();
const PORT = 4000;

const myDir = 'dist'

app.use('/dist/', express.static(`${__dirname}/${myDir}/`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/*', (req, res) => {
    res.sendFile(`${__dirname}/src/pages/not-found/not-found.html`);
})

app.listen(PORT, () => {
    console.log(`Приложение доступно по адресу: http://localhost:${PORT}!`);
});