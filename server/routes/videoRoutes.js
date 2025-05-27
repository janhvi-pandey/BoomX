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
const red=req.user;
console.log(red)
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
      creator: req.user.id,
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

// Get a specific video by ID (with comments)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("creator", "name");
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoType: video.videoType,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      isPaid: video.isPaid,
      price: video.price,
      createdAt: video.createdAt,
      comments: video.comments,
      creatorName: video.creator?.name || "Unknown",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a video
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Add new comment
    video.comments.push({
      username: req.user.name || "Anonymous",
      content: content.trim(),
      createdAt: new Date(),
    });

    await video.save();

    res.status(201).json({ message: "Comment added", comments: video.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;