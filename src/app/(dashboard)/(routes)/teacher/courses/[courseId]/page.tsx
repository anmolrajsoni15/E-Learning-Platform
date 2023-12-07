import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DiscriptionForm from "./_components/DiscriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";
import { Banner } from "@/components/banner";
import Actions from "./_components/Actions";
import { Separator } from "@/components/ui/separator";

const page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) return redirect("/");

  const courseDetailsRequiredFields = [
    course.title,
    course.description,
    course.image,
    course.categoryId,
    course.price,
  ];

  const requiredFields = [
    courseDetailsRequiredFields.every(Boolean),
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields}) fields completed`;

  const isComplete =
    requiredFields.every(Boolean) && courseDetailsRequiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published. It will not be visible to students."
        />
      )}
      <div className="p-8 pb-12 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Course Setup
            </h1>
            <span className="text-sm text-slate-600">
              Complete all fields {completionText}{" "}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <Separator className="-mt-3 bg-gray-300" />
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="flex items-start justify-start gap-8 w-full">
            <div className="flex flex-col justify-center items-start gap-x-2 w-[280px]">
              <h2 className="text-sm font-medium text-gray-700">
                Course Details
              </h2>
              <span className="text-sm font-normal text-gray-600">
                Customise title, description, etc.
              </span>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <Separator className=" bg-gray-300" />
          <div className="flex items-start justify-start gap-8 w-full">
            <div className="flex flex-col justify-center items-start gap-x-2 w-[280px]">
              <h2 className="text-sm font-medium text-gray-700">
                Course Structure
              </h2>
              <span className="text-sm font-normal text-gray-600">
                Add and arrange chapters
              </span>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <Separator className=" bg-gray-300" />
          <div className="flex items-start justify-start gap-8 w-full">
            <div className="flex flex-col justify-center items-start gap-x-2 w-[280px]">
              <h2 className="text-sm font-medium text-gray-700">
                Resources and Attachments
              </h2>
              <span className="text-sm font-normal text-gray-600">
                Integrate supplementary materials.
              </span>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
