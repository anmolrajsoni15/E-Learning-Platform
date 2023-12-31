import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(req:Request, {params}:{params:{courseId:string}}){
    try {
        const {userId} = auth();

        if(!userId) return new NextResponse("Unauthorized", { status: 401 });

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if(!course) return new NextResponse("Course Not Found", { status: 404 });

        for(const chapter of course.chapters){
            if(chapter.muxData?.assertId){
                await Video.Assets.del(chapter.muxData.assertId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        })

        return NextResponse.json(deletedCourse, { status: 200 });

    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req:Request, {params}:{params:{courseId:string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });

        console.log("values :- \t", values)

        const course = await db.course.update({
            where: { id: courseId, userId },
            data: {
                ...values,
                updatedAt: new Date().toISOString(),
            },
        })

        console.log("course :- \t", course);

        return new NextResponse(JSON.stringify(course), { status: 200 });

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}