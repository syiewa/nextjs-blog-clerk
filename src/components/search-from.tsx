"use client";

import { Button, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  initialSearchTerm: string;
  initialSort: string;
  initialCategory: string;
}

export default function SearchForm({ 
  initialSearchTerm, 
  initialSort, 
  initialCategory 
}: SearchFormProps) {
  const [formData, setFormData] = useState({
    searchTerm: initialSearchTerm,
    sort: initialSort,
    category: initialCategory,
  });
  
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (formData.searchTerm) params.set("searchTerm", formData.searchTerm);
    if (formData.sort) params.set("sort", formData.sort);
    if (formData.category) params.set("category", formData.category);
    params.set("page", "1"); // Reset to first page on new search
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <label className="whitespace-nowrap font-semibold">
          Search Term:
        </label>
        <TextInput
          placeholder="Search..."
          id="searchTerm"
          type="text"
          value={formData.searchTerm}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="font-semibold">Sort:</label>
        <Select onChange={handleChange} value={formData.sort} id="sort">
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <label className="font-semibold">Category:</label>
        <Select onChange={handleChange} value={formData.category} id="category">
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
  );
}