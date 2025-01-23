"use client";

import { useUser } from "@clerk/nextjs";
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import { useState } from "react";
import { uploadImageS3 } from "@/lib/aws-s3";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// https://dev.to/a7u/reactquill-with-nextjs-478b
import "react-quill-new/dist/quill.snow.css";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    image?: string;
    imageUrl?: string;
  }>({});
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [PublishError, setPublishError] = useState("");

  const router = useRouter();
  console.log(formData);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError("");
      setUploadProgress(0);
      setIsUploading(true);

      const imageUrl = await uploadImageS3(file, {
        onProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setFormData({
        ...formData,
        image: imageUrl.fileName,
        imageUrl: imageUrl.presignedUrl,
      });
      setUploadProgress(100);

      setIsUploading(false);
    } catch (error) {
      setImageUploadError("Error uploading image");
      setUploadProgress(0);
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMongoId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError("");
        router.push(`/posts/${data.slug}`);
      }
      console.log("Post created:", data);
    } catch (error) {
      if (error instanceof Error) {
        setPublishError(error.message);
      } else {
        setPublishError("An unknown error occurred");
      }
    }
  };
  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Create a post
        </h1>
        {PublishError && <Alert color="failure">{PublishError}</Alert>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData(() => ({ ...formData, title: e.target.value }))
              }
            />
            <Select
              onChange={(e) =>
                setFormData(() => ({ ...formData, category: e.target.value }))
              }
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={isUploading}
            >
              Upload Image
            </Button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full mt-2">
              <div
                className="bg-blue-600 rounded-full text-center text-white font-bold py-1 text-xs"
                style={{ width: `${uploadProgress}%` }}
              >{`${uploadProgress}%`}</div>
            </div>
          )}

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {formData.image && (
            <img
              src={formData.imageUrl}
              alt="uploaded image"
              className="w-full h-72 object-cover"
            />
          )}

          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            onChange={(value) =>
              setFormData(() => ({ ...formData, content: value }))
            }
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </form>
      </div>
    );
  } else {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );
  }
}
