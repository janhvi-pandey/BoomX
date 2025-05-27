const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/shorts/');
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer upload middleware for short videos
const uploadShortVideo = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
   
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only .mp4 files are allowed!'));
    }
  },
});

module.exports = {
  uploadShortVideo,
};
