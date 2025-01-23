import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { getImageS3 } from "@/lib/aws-s3";

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(data.userId && { userId: data.userId }),
      ...(data.category &&
        data.category !== "null" &&
        data.category !== "undefined" && { category: data.category }),
      ...(data.slug && { slug: data.slug }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: "i" } },
          { content: { $regex: data.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    console.log(posts);
    if (data.slug === "") {
      return new Response("Failed to load post", { status: 400 });
    }
    //const post = await Post.findOne({ slug: data.slug });
    // if (post.image) {
    //   post.image = await getImageS3(post.image);
    // }
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMOnthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMOnthAgo },
    });
    return new Response(JSON.stringify({ posts, totalPosts, lastMonthPosts }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
  return new Response(null, { status: 200 });
}
