"use client";

import Editor from "@/components/editor";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface Props {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  videoUrl: z.string().min(1),
  isFree: z.boolean().default(false),
});

const videoSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterTitleForm = ({ initialData, courseId, chapterId }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [videoEditing, setVideoEditing] = React.useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description!,
      videoUrl: initialData.videoUrl!,
      isFree: !!initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated successfully.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const videoSubmit = async (values: z.infer<typeof videoSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Video uploaded successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={`relative border border-solid border-gray-200 hover:shadow-lg transition-all delay-300 bg-[#FCFCFD] rounded-xl w-full ${
      isSubmitting ? "opacity-70" : "opacity-100"
    }`}>
      {isSubmitting && (
        <div className="absolute h-full w-full z-50 bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-20 w-20 font-bold text-sky-600" />
        </div>
      )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            <div className="flex flex-col items-start justify-start gap-6 w-full p-6">
              <div className="flex flex-col items-start justify-start gap-[6px] w-full">
                <div className="text-gray-700 text-sm font-medium">
                  Chapter Title
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          onClick={() => setIsEditing(true)}
                          disabled={isSubmitting}
                          placeholder="e.g. 'Introduction to the course'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-start justify-start gap-[6px] w-full">
                <div className="text-gray-700 text-sm font-medium">
                  Chapter Discription
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem
                    className="w-full"
                      onClick={() => setIsEditing(true)}
                    >
                      <FormControl>
                        <Editor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-[6px] w-full">
                <div className="w-full flex justify-between items-center">
                  <div className="text-gray-700 text-sm font-medium">
                    Chapter Video
                  </div>
                  {!videoEditing && initialData.videoUrl && (
                    <div 
                      onClick={() => setVideoEditing(true)}
                    className="flex items-center cursor-pointer justify-between gap-1">
                      
                    <Image src="/upload.svg" alt="upload" width={20} height={20} />
                    <div className="text-sm font-semibold text-[#0E3C58]">Upload Again</div>
                  </div>
                    
                  )}
                </div>
                <div className="w-full">
                  {!videoEditing &&
                    (!initialData.videoUrl ? (
                      <div 
                      onClick={() => setVideoEditing(true)}
                        className="flex flex-col gap-1 items-center text-slate-400 font-medium cursor-pointer justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                        click to add video
                      </div>
                    ) : (
                      <div className="relative aspect-video mt-2 max-w-4xl">
                        <MuxPlayer
                          playbackId={initialData?.muxData?.playbackId || ""}
                        />
                      </div>
                    ))}
                  {videoEditing && (
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <div className="">
                          <FileUpload
                            endpoint="chapterVideo"
                            onChange={async (url) => {
                              if (url) {
                                const splittedData = await url.split("@");
                                const videoUrl = splittedData[0];
                                field.value = videoUrl;
                                videoSubmit({ videoUrl: videoUrl });
                              }
                            }}
                          />
                          <div className="text-xs text-muted-foreground mt-4">
                            Upload this chapte&apos;s video
                          </div>
                        </div>
                      )}
                    />
                  )}
                  {initialData.videoUrl && !isEditing && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Video can take a few minutes to process. Refresh the page
                      if video does not appear.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-[6px] w-full">
                <div className="text-gray-700 text-sm font-medium">
                  Chapter Access
                </div>
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem 
                    onClick={() => setIsEditing(true)}
                    className="flex w-full flex-row items-start space-x-3 space-y-0 p-4"
                    >
                      <FormControl>
                        <Switch
                        className="mt-1"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0">
                        <FormDescription
                          className="text-sm font-medium text-gray-700"
                        >
                        Toggle to Allow free preview of this chapter
                        </FormDescription>
                        <FormDescription>
                        Check the box to provide a free preview of this chapter, enticing learners with a glimpse of the valuable content within.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {(isEditing || videoEditing) && (
            <div className="flex border-t border-solid border-gray-200 items-center py-4 px-6 w-full justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (videoEditing) setVideoEditing(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="enroll"
                disabled={!isValid || isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          )}
          </form>
        </Form>
    </div>
  );
};

export default ChapterTitleForm;
