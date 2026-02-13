const express = require('express');
const Photo = require('../schemas/photo');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const photos = await Photo.find({});
    res.json(photos);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;