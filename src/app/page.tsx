import Link from "next/link";
import CallToAction from "@/components/call-to-action";
import RecentPosts from "@/components/recent-post";

export default async function Home() {
  // let posts = null;
  // try {
  //   const result = await fetch(
  //     process.env.NEXT_PUBLIC_API_URL + "/api/posts/get",
  //     {
  //       method: "POST",
  //       body: JSON.stringify({
  //         limit: 9,
  //         order: "desc",
  //       }),
  //       cache: "no-store",
  //     }
  //   );
  //   const data = await result.json();
  //   posts = data.posts;
  // } catch (error) {
  //   console.log(error);
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my blog</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Discover a variety of articles on web development, programming, and
          more.
        </p>
        <Link
          href="/search"
          className="text-sx sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Post
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 w-5/6">
        <CallToAction />
      </div>
      <div className="p-3 flex flex-col gap-8 py-7">
        <RecentPosts limit={9} />
      </div>
    </div>
  );
}
