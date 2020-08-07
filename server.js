const express = require('express');

const app = express();
const PORT = 4000;
const host = '0.0.0.0';

const myDir = 'dist'
const dist = 'dist';

app.use('/', express.static(`${__dirname}/${myDir}/`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/${dist}/index.html`);
})

app.get('/*', (req, res) => {
    res.sendFile(`${__dirname}/${dist}/not-found.html`);
})

app.listen(PORT, host, () => {
    console.log(`Приложение доступно по адресу: http://localhost:${PORT}!`);
});
