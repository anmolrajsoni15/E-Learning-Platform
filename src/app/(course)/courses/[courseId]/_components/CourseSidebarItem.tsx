'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

interface CourseSidebarItemProps {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

const CourseSidebarItem = ({
  id,
  label,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {

  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle)
  const isActive = pathname?.includes(id)

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`)
  }

  const truncatedLabel = label.length > 15 ? label.substring(0, 15) + "..." : label

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-[#F2F4F7] text-sm font-[500] px-[12px] transition-all hover:text-[#F2F4F7] hover:bg-[#344054] rounded-[6px]",
        isActive && "text-[#F2F4F7] bg-[#344054] hover:bg-[#344054] hover:text-white",
        isCompleted && "text-[#039855] hover:text-[#039855]",
        isCompleted && isActive && "bg-[#344054] text-[#039855]"
      )}
    >
      <div className="flex flex-row items-center gap-x-2 py-4  ">
        <Icon 
          size={24}
          className={cn(
            "text-[#D8D8D8]",
            isActive && "text-white",
            isCompleted && "text-[#039855]"
          )}
        />
        <div className="text-base font-medium">{truncatedLabel}</div>
      </div>
      {/* <div className={cn(
        "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
        isActive && "opacity-100",
        isCompleted && "border-emerald-700"
      )}></div> */}
    </button>
  )
}

export default CourseSidebarItem