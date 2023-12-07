'use client'

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';
import React from 'react'
import toast from 'react-hot-toast';

interface Props {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({
    onChange,
    endpoint,
}:Props) => {
  return (
    <UploadDropzone
    endpoint={endpoint}
    onClientUploadComplete={(res) => {
      const onChangeData = {
        value: `${res?.[0].url}@${res?.[0].name}@${res?.[0].size}`
      };
      console.log(res);
      onChange(onChangeData.value);
    }}
    onUploadError={(err) => {
        toast.error("Something went wrong.")
    }}
    />
  )
}

export default FileUpload