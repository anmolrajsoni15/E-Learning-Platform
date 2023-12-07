"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";

import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";

import { AiFillCheckCircle } from "react-icons/ai";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface Props {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
      </div>
      <div className="">
        <FileUpload
          endpoint="courseAttachment"
          onChange={(url) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
        <div className="text-xs text-muted-foreground mt-4">
          Add some resources to your course for your students to download
        </div>
      </div>

      {initialData.attachments.length === 0 ? (
        <p className="text-sm mt-2 text-slate-500 italic">
          No attachments added yet
        </p>
      ) : (
        <div className="space-y-2">
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex flex-col items-start justify-start p-4 w-full bg-white border border-solid border-[#0369A1] rounded-md"
            >
              <div className="w-full flex items-center">
                <div className="flex items-center gap-[6px] text-sm font-medium line-clamp-1 text-gray-900">
                  <span>{attachment.name}</span>
                  <AiFillCheckCircle className="text-[#0369A1] " />
                </div>
                {deletingId === attachment.id ? (
                  <div className="">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button
                    onClick={() => onDelete(attachment.id)}
                    className="ml-auto hover:opacity-75 transition"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {attachment.size || 0} MB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
