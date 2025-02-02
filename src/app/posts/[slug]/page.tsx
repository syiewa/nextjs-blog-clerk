import CallToAction from "@/components/call-to-action";
import { Button } from "flowbite-react";

import Link from "next/link";
import { getImageS3 } from "@/lib/aws-s3";
import RecentPosts from "@/components/recent-post";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post = null;
  try {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/posts/get",
      {
        method: "POST",
        body: JSON.stringify({
          slug: (await params).slug,
        }),
        cache: "no-store",
      }
    );
    const data = await result.json();
    console.log(data);
    post = data.posts[0];
    if(post.image) {
      post.image = await getImageS3(post.image);
    } else {
      post.image ='https://placehold.co/600x400';
    }
  } catch (error) {
    console.log(error);
  }

  if (!post || post.title === "Failed to load post") {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        href={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="blue" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <RecentPosts limit={3} />
    </main>
  );
}
