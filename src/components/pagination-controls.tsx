"use client";

import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

interface PaginationControlsProps {
  currentPage: number;
  hasMore: boolean;
}

export default function PaginationControls({ 
  currentPage, 
  hasMore 
}: PaginationControlsProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="w-full flex justify-center gap-4 p-4">
      {currentPage > 1 && (
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
      )}
      {hasMore && (
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      )}
    </div>
  );
}