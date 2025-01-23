import Post from "@/lib/models/post.model";
import { connect } from "@/lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();
    console.log(data);
    console.log(user);

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      !user.publicMetadata.isAdmin
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const slug = data.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      username: user.username,
      image: data.image,
      category:
        data.category === "uncategorized" ? "uncategorized" : data.category,
      slug: slug,
    });
    await newPost.save();
    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (error) {
    console.log(error);
  }
  return new Response(null, { status: 200 });
}
