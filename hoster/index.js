const express = require('express')
// const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express()
const port = 4000

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'photos'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// app.use(cors({ origin: 'http://127.0.0.1:3000' }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.1.105:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/upload', upload.single('photo'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // 업로드된 파일 접근 URL 생성 (실제 운영에서는 CDN이나 reverse proxy로 제공)
  const fileUrl = `http://localhost:${port}/photos/${file.filename}`;

  res.json({
    message: 'File uploaded successfully!',
    url: fileUrl
  });
});

app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use('/xml', express.static(path.join(__dirname, 'xml')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})