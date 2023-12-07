import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";


type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
  courseId: string;
};

export const getCourse = async ({
  userId,
  courseId
}: GetCourses) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })
  
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      }, 
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            videoLength: true,
          }
        }
      }
    })
  
    if (!course) {
      throw new Error("Course not found")
    }

    const totalVideoLength = course.chapters.reduce((acc, chapter) => {
      if (!chapter.videoLength) {
        return acc;
      }
  
      return acc + chapter.videoLength;
    }, 0);
  
    const totalChapters = course.chapters.length;

    const categoryData = await db.category.findUnique({
      where: {
        id: course.categoryId!
      },
      select: {
        name: true,
      }
    })

    if(!purchase){
      return {
        ...course,
        totalVideoLength,
        totalChapters,
        progress: null,
        category: categoryData?.name || "",
        purchase
      }
    }

    const progressPercentage = await getProgress(userId, course.id);

    return {
      ...course,
      totalVideoLength,
      totalChapters,
      progress: Math.round(progressPercentage),
      category: categoryData?.name || "",
      purchase
    };
  } catch (error) {
    console.log("[GET_COURSE_PREVIEW]", error);
    return null;
  }
}