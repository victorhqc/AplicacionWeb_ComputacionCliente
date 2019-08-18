const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
//
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', `${req.path.slice(1)}.html`));
// });

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
