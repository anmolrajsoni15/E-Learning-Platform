'use client'

import React, { useMemo } from 'react'
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

interface Props{
  onChange: (value: string) => void;
  value: string;
}

const Editor = ({onChange, value}: Props) => {

  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className='bg-white'>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Editor