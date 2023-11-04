import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {params} : {params: {courseId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId){
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
      include:{
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    })

    if(!course){
      return new NextResponse("Course not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished);

    if(!course.title || !course.description || !course.image || !course.categoryId || !hasPublishedChapter){
      return new NextResponse("Course is not ready to be published", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedCourse, { status: 200 });

  } catch (error) {
    console.log("Course publish error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}