const multer = require('multer');
const path = require('path');
const os = require('os');

// Use /tmp directory for serverless environments
const uploadDir = path.join(os.tmpdir(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

module.exports = upload;
