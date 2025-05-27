const express = require("express");
const upload = require("../middleware/multerUpload");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Video = require("../models/Video");
const uploadToS3 = require("../services/awsUploader");
const fs = require("fs");

const uploadFields = upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.post("/upload", uploadFields, verifyToken, async (req, res) => {
  try {
    const { title, description, videoType, isPaid, price, videoUrl } = req.body;

    const videoFile = req.files.videoFile?.[0] || null;
    const thumbnail = req.files.thumbnail?.[0] || null;

    let videoFileUrl;
    let thumbnailUrl;

    if (videoType === "short") {
      const uploadResult = await uploadToS3(videoFile.path, "video");
      videoFileUrl = uploadResult.Location;
      fs.unlinkSync(videoFile.path);
    }

    if (videoType === "long") {
      const uploadResult = await uploadToS3(thumbnail.path, "thumbnail");
      thumbnailUrl = uploadResult.Location;
      videoFileUrl = videoUrl;
    }

    const video = new Video({
      creator: req.userId,
      title,
      description,
      videoType,
      videoUrl: videoType === "short" ? videoFileUrl : videoUrl,
      isPaid,
      price,
      thumbnail: videoType === "long" ? thumbnailUrl : null,
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/feed", verifyToken, async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("creator", "username") // Assuming your User model has a username
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;