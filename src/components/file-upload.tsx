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
    onClientUploadComplete={(res) => {onChange(res?.[0].url)}}
    onUploadError={(err) => {
        toast.error("Something went wrong.")
    }}
    />
  )
}

export default FileUpload