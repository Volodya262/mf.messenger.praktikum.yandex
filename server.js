const express = require('express');

const app = express();
const PORT = 4000;

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.use(express.static('./'));

app.listen(PORT, () => {
  console.log(`Мой текст и порт: ${PORT}!`);
});