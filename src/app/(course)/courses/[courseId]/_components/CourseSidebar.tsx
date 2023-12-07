import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation';
import React from 'react'
import CourseSidebarItem from './CourseSidebarItem';
import { CourseProgress } from '@/components/CourseProgress';

interface CourseProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null ;
    }) []
  }
  progressCount: number
}

const CourseSidebar = async({
  course,
  progressCount,
}:CourseProps) => {

  const {userId} = auth();

  if(!userId){
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  })

  return (
    <div className='h-full w-full md:w-[280px] flex flex-col gap-6 overflow-y-auto bg-[#101828] text-white'>
      <div className="p-8 flex flex-col border-b border-solid border-[#344054]">
        <h1 className="font-semibold text-white text-lg">
        {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full px-4 gap-2">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSidebar