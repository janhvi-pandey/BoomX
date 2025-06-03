const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Video = require("../models/Video");
const User = require("../models/User");

// GET /api/feed/videos
router.get("/videos", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const user = await User.findById(req.user.id)
      .select("purchasedVideos")
      .lean();

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creator", "name")
      .populate("comments.user", "avatar name")
      .lean();

    const feed = videos.map((video) => {
      const isPurchased = user?.purchasedVideos?.some(
        (v) => v.toString() === video._id.toString()
      );

      const commentsWithUser = (video.comments || []).map((comment) => ({
        _id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        username: comment.username || comment.user?.name || "Unknown",
        avatar: comment.user?.avatar || "https://ui-avatars.com/api/?name=User",
      }));

      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        comments: commentsWithUser,
        creatorName: video.creator?.name || "Unknown",
        videoType: video.videoType,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        isPaid: video.isPaid,
        price: video.price,
        createdAt: video.createdAt,
        likes: video.likes ?? 0,
        views: video.views ?? 0,
        access:
          video.videoType === "short" || !video.isPaid || isPurchased
            ? "watch"
            : "buy",
      };
    });

    res.status(200).json({ success: true, feed });
  } catch (err) {
    console.error("Feed Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
