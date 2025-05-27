const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    wallet: {
      type: Number,
      default: 500, 
    },

    // List of purchased video IDs (long-form only)
    purchasedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    // List of videos the user has uploaded 
    uploadedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    // Gift actions 
    giftHistory: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
          required: true,
        },
        creatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        giftedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
