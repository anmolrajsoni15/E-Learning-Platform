import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import Mux, { CreateAssetParams, InputSettings } from "@mux/mux-node";
import axios from "axios";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const exisitingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (exisitingMuxData) {
        await Video.Assets.del(exisitingMuxData.assertId);
        await db.muxData.delete({
          where: {
            id: exisitingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("Chapter delete error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assertId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: [
          {
            url: values.videoUrl,
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          } as InputSettings,
        ],
        playback_policy: "public",
        test: false,
        passthrough: JSON.stringify({
          chapterId: params.chapterId,
        }),
      });


      console.log(asset);

      // const assestData = await Video.Assets.get(asset.id);
      // console.log(assestData);

      // const video_data = await axios.get(
      //   `https://api.mux.com/video/v1/assets/${process.env.ASSETID}`,
      //   {
      //     // Use basic authentication with your API key and secret
      //     auth: {
      //       username: process.env.MUX_TOKEN_ID!,
      //       password: process.env.MUX_TOKEN_SECRET!,
      //     },
      //   }
      // );

      // const data = video_data.data.data.tracks;
      // //filter the data by type text
      // const textTracks = data.filter((track: any) => track.type === "text");
      // const trackid = textTracks.map((track: any) => track.id)[0];
      // console.log(trackid);
      // const trackData = await axios.get(
      //   `https://stream.mux.com/VxEQFkHUI01mXzO0200cD00gvyG5zts9ZRGAQBtoxHfUZ00Y/text/${trackid}.txt`
      // );
      // console.log(trackData);

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assertId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id!,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
