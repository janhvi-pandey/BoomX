const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  description: String,
  videoType: {
    type: String,
    enum: ["short", "long"],
  },
  videoUrl: String,
  thumbnail: String,
  isPaid: {
    type: Boolean,
    default: false,
  },
  price: Number,
  duration: String,
  views: {
    type: Number,
    default: 0,
  },
 likes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: String,  
      avatar: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
module.exports = Video;
