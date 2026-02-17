const express = require('express');
const path = require('path');
const Hype = require('../schemas/hype');
const Photo = require('../schemas/photo');

const router = express.Router();

router.get('/hypes', async (req, res, next) => {
  try {
    // const hypes = await Hype.find();
    // const photos = hypes.map(hype => Photo.findById(hype.pid));
    const photos = await Hype.find().populate('pid');
    res.json(photos);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/admin/upload', (req, res) => {
  if (req.ip.replace('::ffff:', '') !== '127.0.0.1') {
    return res.status(403).send('Forbidden');
  }
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(403).send('Forbidden');
  }
  res.sendFile(path.join(__dirname, '..', 'private', 'upload.html'));
});

module.exports = router;