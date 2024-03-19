const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/manifest', express.static(path.join(__dirname, 'manifest')));
app.use('/service-worker.js', express.static(path.join(__dirname, 'service-worker.js')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));