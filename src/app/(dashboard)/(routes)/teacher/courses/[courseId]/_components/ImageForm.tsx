"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";

import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface Props {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: "image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )} 
          {!isEditing && !initialData.image && (
            <>
             <PlusCircle className="h-4 w-4 mr-2" />
              Add Image
            </>
          )}
           {!isEditing && initialData.image && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.image ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
        ) :(
            <div className="relative aspect-video mt-2">
                <Image
                    alt="Upload"
                    fill
                    className="object-cover rounded-md"
                    src={initialData.image}
                />
            </div>
        )
      )}
      {isEditing && (
         <div className="">
            <FileUpload
              endpoint="courseImage"
              onChange={(url)=>{
                if(url){
                    onSubmit({image: url});
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                16:9 aspect ratio recommended
            </div>
         </div>
      )}
    </div>
  );
};

export default ImageForm;
