'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  courseId: string;
}

const PreviewButton = ({courseId}: Props) => {

  const router = useRouter();

  const onClick = () => {
    router.push(`/courses/${courseId}`)
  }

  return (
    <Button
    onClick={onClick}
      type='button'
      variant='preview'
      size='lg'
      className='px-28 text-base font-semibold w-full'
    >
      Preview Course
    </Button>
  )
}

export default PreviewButton