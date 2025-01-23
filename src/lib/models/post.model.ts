import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
