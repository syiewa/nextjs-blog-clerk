import PostCard from "./post-card";

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  userId: string;
  username: string;
  category: string;
  slug: string;
  // Add other properties of the post object if needed
}

export default async function RecentPosts({ limit }: { limit: number }) {
  let posts = null;
  try {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/posts/get",
      {
        method: "POST",
        body: JSON.stringify({
          limit: limit,
          order: "desc",
        }),
        cache: "no-store",
      }
    );
    const data = await result.json();
    posts = data.posts;
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex flex-col mb-5 justify-center items-center">
      <h1 className="text-xl mt-5">Recent Articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {posts &&
          posts.map((post: Post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
