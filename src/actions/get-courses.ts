import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: {
    id: string;
    videoLength: number | null; 
}[];
  progress: number | null;
  totalChapters: number;
  totalVideoLength: number;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            videoLength: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async course => {
        const totalVideoLength = course.chapters.reduce((acc, chapter) => {
          if (!chapter.videoLength) {
            return acc;
          }

          return acc + chapter.videoLength;
        }, 0);

        const totalChapters = course.chapters.length;

        if (course.purchases.length === 0) {
          return {
            ...course,
            totalVideoLength,
            totalChapters,
            progress: null,
          }
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          totalVideoLength,
          totalChapters,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}