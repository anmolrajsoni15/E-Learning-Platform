"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface Props {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "description is required",
  }),
  price: z.coerce.number(),
  image: z.string().min(1, {
    message: "image is required",
  }),
  categoryId: z.string().min(1),
});

const imageSchema = z.object({
  image: z.string().min(1, {
    message: "image is required",
  }),
});

const TitleForm = ({ initialData, courseId, options }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [imageEditing, setImageEditing] = React.useState(false);

  const toggleEdit = async() => await setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      price: initialData.price || 0,
      image: initialData.image || "",
      categoryId: initialData.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated successfully.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const onImageUpload = async (values: z.infer<typeof imageSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image updated");
      setImageEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div
      className={`relative border bg-[#FCFCFD] rounded-lg transition-all delay-300 hover:shadow-lg w-full ${
        isSubmitting ? "opacity-70" : "opacity-100"
      }`}
    >
      {isSubmitting && (
        <div className="absolute h-full w-full z-50 bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-20 w-20 font-bold text-sky-600" />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex flex-col items-start justify-start gap-6 w-full p-6">
            <div className="flex items-center justify-center gap-6 w-full">
              <div className="flex flex-col items-start justify-start gap-[6px] w-1/2">
                <div className="text-gray-700 text-sm font-medium">
                  Course Title
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          onClick={() => setIsEditing(true)}
                          placeholder="e.g. 'New Course on Machine Learning'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-[6px] w-1/2">
                <div className="text-gray-700 text-sm font-medium">
                  Course Price
                </div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          onClick={() => setIsEditing(true)}
                          placeholder="Set a price for your course"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[6px] w-full">
              <div className="text-gray-700 text-sm font-medium">
                Course Discription
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        onClick={() => setIsEditing(true)}
                        placeholder="e.g. This course is about..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-[6px] w-full">
              <div className="w-full flex justify-between items-center">
                <div className="text-gray-700 text-sm font-medium">
                  Course Image
                </div>
                {!imageEditing && initialData.image && (
                  <div>
                    <Pencil
                      className="h-4 w-4 mr-2"
                      onClick={() => setImageEditing(true)}
                    />
                  </div>
                )}
              </div>
              <div className="w-full">
                {!imageEditing &&
                  (!initialData.image ? (
                    <div
                      onClick={() => setImageEditing(true)}
                      className="flex flex-col gap-1 items-center justify-center text-slate-500 cursor-pointer h-60 bg-slate-200 rounded-md"
                    >
                      <ImageIcon className="h-10 w-10 text-slate-500" />
                      Click to add image
                    </div>
                  ) : (
                    <div className="relative aspect-video mt-2 max-w-[700px]">
                      <Image
                        alt="Upload"
                        fill
                        className="object-cover rounded-md"
                        src={initialData.image}
                      />
                    </div>
                  ))}
                {imageEditing && (
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="">
                        <FileUpload
                          endpoint="courseImage"
                          onChange={async(url) => {
                            if (url) {
                              const splittedData = await url.split("@");
                              const imageUrl = splittedData[0];
                              field.value = imageUrl;
                              await onImageUpload({ image: imageUrl });
                            }
                          }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                          16:9 aspect ratio recommended
                        </div>
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[6px] w-full">
              <div className="text-gray-700 text-sm font-medium">
                Course Category
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <FormControl>
                      <Combobox options={options} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {(isEditing || imageEditing) && (
            <div className="flex border-t border-solid border-gray-200 items-center py-4 px-6 w-full justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (imageEditing) setImageEditing(false);
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

export default TitleForm;
