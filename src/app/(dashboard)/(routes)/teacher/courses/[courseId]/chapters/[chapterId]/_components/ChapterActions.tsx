'use client'

import { ConfirmModal } from '@/components/modals/confirm-modals';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

interface ChapterActionProps{
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished
} : ChapterActionProps) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async() => {
    try {
      setIsLoading(true);

      if(isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
        toast.success('Chapter unpublished successfully')
      }
      else{
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
        toast.success('Chapter published successfully')
      }

      router.refresh();
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async() => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)

      toast.success('Chapter deleted successfully')
      router.refresh();
      router.push(`/teacher/courses/${courseId}`)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={isPublished ? "outline" : "enroll"}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-x-1"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default ChapterActions