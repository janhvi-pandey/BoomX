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
      default: 1000, 
    },

 
    purchasedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    uploadedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

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


receivedGifts: [
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    receivedAt: {
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
