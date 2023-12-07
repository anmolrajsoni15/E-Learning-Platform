import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (req:Request, {params}:{params: {courseId: string}}){
    try {
        
        const {userId} = auth();
        const {url} = await req.json();
        
        const data = url.toString();
        console.log("data :- \t", data);
        const splittedData = data.split("@")

        const fileSize = Number(splittedData[2]);
        const fileSizeInMB = Math.ceil((fileSize / (1024 * 1024))*100)/100;
        const fileUrl = splittedData[0];
        const fileName = splittedData[1];

        // const data = value.split("+");
        // console.log(data)
        // const url = data[0];

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            },        
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const attachment = await db.attachment.create({
            data: {
                url: fileUrl,
                name: fileName,
                size: fileSizeInMB,
                courseId: params.courseId
            }
        });

        return new NextResponse(JSON.stringify(attachment), {status: 201})

    } catch (error) {
        console.log("Attachment error", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}