const express = require('express');
const Video = require('../models/Video');
const verifyToken = require('../middleware/verifyToken');
const { uploadShortVideo } = require('../services/uploadService');
const router = express.Router();

// Upload video
router.post('/upload', verifyToken, uploadShortVideo.single('videoFile'), async (req, res) => {
  try {
    const { title, description, type, videoURL, price } = req.body;
     console.log('Uploaded file:', req.file);

    const videoData = {
      title,
      description,
      type,
      creator: req.user.id,
    };

   if (type === 'short') {
  if (!req.file) {
    console.log('Uploaded file:', req.file);

    return res.status(400).json({ error: 'Short video file is required.' });
  }
  videoData.shortVideoPath = req.file.path;  
}
else if (type === 'long') {
      if (!videoURL) {
        return res.status(400).json({ error: 'Long-form video URL is required.' });
      }
      videoData.longVideoUrl = videoURL; 
      videoData.price = price || 0;
    } else {
      return res.status(400).json({ error: 'Invalid video type. Must be "short" or "long".' });
    }

    const video = await Video.create(videoData);
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
