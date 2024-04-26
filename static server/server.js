const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/manifest', express.static(path.join(__dirname, 'public/manifest')));
app.use('/service-worker.js', express.static(path.join(__dirname, 'public/service-worker.js')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));