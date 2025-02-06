import { Suspense } from "react";
import SearchForm from "@/components/search-from";
import PostCard from "@/components/post-card";
import PaginationControls from "@/components/pagination-controls";

// Types
interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  userId: string;
  username: string;
  slug: string;
}

type SearchParams = {
  searchTerm?: string;
  sort?: string;
  category?: string;
  page?: string;
}

// Correct Next.js page props type for App Router
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

// Server-side data fetching function
async function getPosts(searchParams: SearchParams) {
  const {
    searchTerm = "",
    sort = "desc",
    category = "",
    page = "1",
  } = searchParams;
  
  const limit = 9;
  const startIndex = (parseInt(page) - 1) * limit;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit,
      searchTerm,
      order: sort,
      category,
      startIndex,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

// Main Server Component with correct Next.js page props type
export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const { posts } = await getPosts(searchParams);
  const currentPage = parseInt(searchParams.page || "1");
  const hasMore = posts.length === 9;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <SearchForm
          initialSearchTerm={searchParams.searchTerm || ""}
          initialSort={searchParams.sort || "desc"}
          initialCategory={searchParams.category || "uncategorized"}
        />
      </div>

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <Suspense
          fallback={<p className="text-xl text-gray-500 p-7">Loading...</p>}
        >
          <div className="p-7 flex flex-wrap gap-4">
            {posts.length === 0 ? (
              <p className="text-xl text-gray-500">No Posts Found.</p>
            ) : (
              <>
                {posts.map((post: Post) => (
                  <PostCard key={post._id} post={post} />
                ))}
                {hasMore && (
                  <PaginationControls
                    currentPage={currentPage}
                    hasMore={hasMore}
                  />
                )}
              </>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}