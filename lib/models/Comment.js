// models/Comment.js
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blog', // Assuming you have a Blog model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;
