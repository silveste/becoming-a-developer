const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'new'
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

module.exports = model('User', userSchema);