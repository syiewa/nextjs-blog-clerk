import Image from "next/image";
import Link from "next/link";
import { getImageS3 } from "@/lib/aws-s3";

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

const PostCard = async ({ post }: { post: Post }) => {
  if (post.image) {
    post.image = await getImageS3(post.image);
  } else {
    post.image = "https://placehold.co/600x400";
  }
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link href={`../posts/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col grap-2">
        <p className="text-lg  font-semibold line-clamp-2">
          <span className="italic text-sm">{post.category}</span>
          <Link href={`../posts/${post.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-75 text-center py-2 rounded-md !rounded-tl-none m-2">Read Article</Link>
        </p>
      </div>
    </div>
  );
};

export default PostCard;
