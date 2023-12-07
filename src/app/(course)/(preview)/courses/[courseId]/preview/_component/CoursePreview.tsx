import { CourseProgress } from '@/components/CourseProgress';
import Image from 'next/image';
import React from 'react'

interface CoursePreviewProps {
  image: string;
  title: string;
  description: string;
  chapters: number;
  progress: number | null;
  courseVideo: number;
  category: string;
}

const CoursePreview = ({
  image,
  title,
  description,
  chapters,
  progress,
  courseVideo,
  category
}: CoursePreviewProps) => {

  const truncatedDiscription = description.length > 300 ? description.substring(0, 300) + "..." : description;

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border w-full flex flex-col md:flex-row items-center gap-6 justify-start rounded-lg p-6">
        <div className="relative w-full md:w-[35%] aspect-video md:aspect-square lg:aspect-[1.4] xl:aspect-[1.6] rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={image} />
        </div>
        <div className="flex flex-col justify-start items-start gap-[18px] pt-2 w-full md:w-[65%]">
          <div className="bg-[#E0F2FE] rounded-[16px] text-[#0369A1] p-1 gap-2 flex items-center justify-start w-fit px-[10px] pl-1 font-medium text-xs leading-[18px] my-2">
            <span className="bg-white rounded-[16px] px-2 py-[2px]">
              {chapters} {chapters === 1 ? "Chapter" : "Chapters"}
            </span>
            <span>{courseVideo} Total Hours</span>
          </div>
          <div className="text-base md:text-2xl font-semibold text-[#020817] group-hover:text-sky-600 transition">
            {title}
          </div>
          <p className="text-base text-[#64748B] ">{truncatedDiscription}</p>
          <p className="text-xs text-muted-foreground ">{category}</p>
          
          <div className="mt-[9px] w-full">
          {progress !== null && (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          )}
          </div>
        </div>
      </div>
  )
}

export default CoursePreview