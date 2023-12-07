import NavbarRoutes from '@/components/NavbarRoutes';
import { Chapter, Course, UserProgress } from '@prisma/client'
import React from 'react'
import CourseMobileSidebar from './CourseMobileSidebar';

interface Props {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
}

const CourseNavbar = ({
  course,
  progressCount,
}: Props) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white md:rounded-tl-[40px] shadow-sm'>
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />
    </div>
  )
}

export default CourseNavbar