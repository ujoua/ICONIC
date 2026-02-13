const express = require('express');
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

module.exports = router;