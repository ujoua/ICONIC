const express = require('express');
const mongoose = require('mongoose');
const Photo = require('../schemas/photo');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const photos = await Photo.find({});
      res.json(photos);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const photo = await Photo.findById(id);
      res.json(photo);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;