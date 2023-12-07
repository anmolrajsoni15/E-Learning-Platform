import React from 'react'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { getCourse } from '@/actions/get-course-preview'
import CoursePreview from './_component/CoursePreview'
import Banner from './_component/Banner'

const PreviewPage = async({
  params
}: {
  params: {courseId : string}
}) => {

  const {userId} = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await getCourse({
    courseId: params.courseId,
    userId
  })

  if (!course) {
    return redirect("/");
  }

  console.log(course);

  return (
    <div className='w-full h-full p-8'>
      <CoursePreview
        image={course.image!}
        title={course.title}
        description={course.description!}
        chapters={course.totalChapters}
        progress={course.progress}
        courseVideo={course.totalVideoLength}
        category={course.category}
      />

      <Banner
        courseId={course.id}
        price={course.price!}
        purchased={!!course.purchase}
      />

    </div>
  )
}

export default PreviewPage