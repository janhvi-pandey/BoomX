const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['short', 'long'],
    required: true,
  },
  shortVideoPath: {
    type: String, 
  },
  longVideoUrl: {
    type: String, 
  },
  price: {
    type: Number, 
    default: 0,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
