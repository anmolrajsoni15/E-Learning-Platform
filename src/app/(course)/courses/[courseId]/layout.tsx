import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="hidden h-full bg-[#101828] md:flex items-center justify-start w-full fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
        <div className="flex flex-col items-start justify-start h-full w-full py-3">
          <div className="h-[80px] sticky inset-y-0 w-full z-50">
            <CourseNavbar course={course} progressCount={progressCount} />
          </div>
          <main className=" w-full h-full overflow-y-auto bg-white rounded-bl-[40px] border-b-[10px] border-solid border-white">
            {children}
          </main>
        </div>
      </div>

      <div className="md:hidden h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      {/* <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div> */}
      <main className="md:pl-56 md:hidden pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
