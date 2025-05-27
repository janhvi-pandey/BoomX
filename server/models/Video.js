const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  videoType: {
    type: String,
    enum: ["short", "long"],
  },
  videoUrl: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

module.exports = Video;