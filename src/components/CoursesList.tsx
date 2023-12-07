import { Category, Course } from '@prisma/client';
import React from 'react'
import CourseCard from './CourseCard';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: {id: string}[];
  progress: number | null;
  totalChapters: number;
  totalVideoLength: number;
}

interface Props {
  items: CourseWithProgressWithCategory[];
}

const CoursesList = ({items}: Props) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.image!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
            totalVideoLength={item.totalVideoLength}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}

export default CoursesList