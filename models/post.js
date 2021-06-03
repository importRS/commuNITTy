const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80",
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [{
    text: String,
    postedBy: { type: ObjectId, ref: "User" }
  }],
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
}, { timestamps: true })

mongoose.model("Post", postSchema)
