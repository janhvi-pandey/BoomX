const express = require("express");
const upload = require("../middleware/multerUpload");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Video = require("../models/Video");
const uploadToS3 = require("../services/awsUploader");
const fs = require("fs");
const User = require("../models/User");

const uploadFields = upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.post("/upload", uploadFields, verifyToken, async (req, res) => {
  try {
    const { title, description, videoType, isPaid, price, videoUrl } = req.body;
    // console.log(req.user);

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
    const video = await Video.findById(req.params.id).populate(
      "creator",
      "name"
    );
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;
    const user = await User.findById(userId);
    const purchased = user?.purchasedVideos.includes(req.params.id) || false;

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
      purchased,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to a video
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    const videoId = req.params.id;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, user ID missing" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const newComment = {
      username: user.name,
      content,
      createdAt: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json({
      message: "Comment added",
      comments: video.comments,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Purchase video - updated route path: /:videoId/purchase
router.post("/:videoId/purchase", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!video || !video.isPaid) {
      return res.status(400).json({ message: "Invalid or free video" });
    }

    if (user.purchasedVideos.includes(videoId)) {
      return res.status(400).json({ message: "Video already purchased" });
    }

    if (user.wallet < video.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.wallet -= video.price;
    user.purchasedVideos.push(videoId);
    await user.save();

    res.status(200).json({ message: "Video purchased successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//Gift Video Creator
router.post("/gift/:videoId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.videoId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gift amount" });
    }

    const user = await User.findById(userId);
    const video = await Video.findById(videoId).populate("creator");

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (video.creator._id.toString() === userId) {
      return res
        .status(400)
        .json({ success: false, message: "You can't gift your own video" });
    }

    if (user.wallet < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    user.wallet -= amount;
    user.giftHistory.push({
      videoId: video._id,
      creatorId: video.creator._id,
      amount,
      giftedAt: new Date(),
    });

    video.creator.wallet += amount;

    video.creator.receivedGifts = video.creator.receivedGifts || [];
    video.creator.receivedGifts.push({
      videoId: video._id,
      senderId: user._id,
      amount,
      receivedAt: new Date(),
    });

    await user.save();
    await video.creator.save();

    res.status(200).json({
      success: true,
      message: `Gifted ₹${amount} to ${video.creator.name}`,
      senderBalance: user.wallet,
      creatorBalance: video.creator.wallet,
    });
  } catch (err) {
    console.error("Gift error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
