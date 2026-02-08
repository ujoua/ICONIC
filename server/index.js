const express = require('express')
const app = express()
const port = 3000

app.use(express.static('.'))

const photoList = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];

app.get('/photos', (req, res) => {
  const urls = photoList.map(name => `http://192.168.1.105:4000/photos/${name}`);
  res.json(urls);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
