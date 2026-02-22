const express = require('express');
const mongoose = require('mongoose');
const Photo = require('../schemas/photo');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/upload', upload.single('photo'), async (req, res, next) => {
  try {
    const file = req.file;
    const { artist, title, text, tags, earliestDate, camera, materials, dimensons } = req.body;

    const form = new FormData();
    form.append('photo', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('http://localhost:4000/upload', form, {
      headers: form.getHeaders()
    });

    const imageUrl = response.data.url;
    const filePath = imageUrl.split('/').pop();

    const parsedTags = tags
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const parsedMaterials = materials
      ? materials.split(',').map(m => m.trim()).filter(Boolean)
      : [];
    const parsedEarliestDate = earliestDate ? new Date(earliestDate) : undefined;

    const newPhoto = new Photo({
      filePath,
      artist: artist || undefined,
      title: title || undefined,
      text: text || undefined,
      tags: parsedTags.length ? parsedTags : undefined,
      earliestDate: parsedEarliestDate,
      camera: camera || undefined,
      materials: parsedMaterials.length ? parsedMaterials : undefined,
      dimensons: dimensons || undefined
    });

    await newPhoto.save();

    res.json({ success: true, url: response.data.url });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;