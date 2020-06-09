const express = require('express');

const app = express();
const PORT = 4000;

const myDir = 'static'

app.use('/', express.static(`${__dirname}/${myDir}`))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/${myDir}/index.html`);
})

app.get('/*', (req, res) => {
  res.sendfile(`${__dirname}/${myDir}/not-found.html`)
})

app.listen(PORT, () => {
  console.log(`Мой текст и порт: ${PORT}!`);
});