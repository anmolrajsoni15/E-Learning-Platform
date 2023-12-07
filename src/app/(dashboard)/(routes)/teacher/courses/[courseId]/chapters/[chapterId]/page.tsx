import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDiscriptionForm from "./_components/ChapterDiscriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import { Banner } from "@/components/banner";
import ChapterActions from "./_components/ChapterActions";
import VideoLengthForm from "./_components/VideoLengthForm";
import { Separator } from "@/components/ui/separator";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is not published. It will not be visible to students."
        />
      )}
      <div className="p-8 pb-12 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-xl font-semibold text-gray-900">Chapter Creation</h1>
                <span className="text-sm text-slate-600">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions 
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <Separator className="-mt-3 bg-gray-300" />
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="flex items-start justify-start gap-8 w-full">
            <div className="flex flex-col justify-center items-start gap-x-2 w-[280px]">
              <h2 className="text-sm font-medium text-gray-700">Chapter Details</h2>
              <span className="text-sm font-normal text-gray-600">Customise title, description, etc.</span>
            </div>
            <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default page;
