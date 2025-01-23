import { connect } from "@/lib/mongodb/mongoose";
import Post from "@/lib/models/post.model";
import { getImageS3 } from "@/lib/aws-s3";

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();
    if (data.slug === "") {
      return new Response("Failed to load post", { status: 400 });
    }
    const post = await Post.findOne({ slug: data.slug });
    if (post.image) {
      post.image = await getImageS3(post.image);
    }
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.log(error);
  }
  return new Response(null, { status: 200 });
}
