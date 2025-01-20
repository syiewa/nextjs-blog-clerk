'use client';

import { useUser } from '@clerk/nextjs';
import { Button, FileInput, Select, TextInput } from 'flowbite-react';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
// https://dev.to/a7u/reactquill-with-nextjs-478b
import 'react-quill-new/dist/quill.snow.css';

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
          Create a post
        </h1>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput
              type='text'
              placeholder='Title'
              required
              id='title'
              className='flex-1'
            />
            <Select>
              <option value='uncategorized'>Select a category</option>
              <option value='javascript'>JavaScript</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput accept='image/*' />
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              size='sm'
              outline
            >
                Upload Image
            </Button>
          </div>

          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='h-72 mb-12'
          />
          <Button type='submit' gradientDuoTone='purpleToPink'>
            Publish
          </Button>
        </form>
      </div>
    );
  } else {
    return (
      <h1 className='text-center text-3xl my-7 font-semibold'>
        You are not authorized to view this page
      </h1>
    );
  }
}