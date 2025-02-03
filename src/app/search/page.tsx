"use client";

import { Button, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/post-card";

export default function SearchPage() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  interface Post {
    _id: string;
    title: string;
    content: string;
    category: string;
    // Add other fields as necessary
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      fetch("api/posts/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 9,
          searchTerm: searchTermFromUrl || "",
          order: sortFromUrl || "desc",
          category: categoryFromUrl || "uncategorized",
        }),
      })
        .then((res) => {
          if (!res.ok) {
            setLoading(false);
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
          }
        });
    };
    fetchPosts();
  }, [searchParams]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    if (id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: value,
      });
    }
    if (id === "sort") {
      setSidebarData({
        ...sidebarData,
        sort: value || "desc",
      });
    }
    if (id === "category") {
      setSidebarData({
        ...sidebarData,
        category: value || "uncategorized",
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    setLoading(true);
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;

    fetch("api/posts/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: 9,
        searchTerm: sidebarData.searchTerm,
        order: sidebarData.sort,
        category: sidebarData.category,
        startIndex,
      }),
    })
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setPosts([...posts, ...data.posts]);
          setLoading(false);
          setShowMore(data.posts.length === 9);
        }
      });
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort">
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} id="category">
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* main content */}

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts result:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Posts Found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
