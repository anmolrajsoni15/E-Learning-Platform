"use client";

import React from "react";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormMessage,
  FormDescription,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      toast.success("Course created successfully.");
      router.push(`/teacher/courses/${response.data.id}`);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center h-full p-6 ">
      <div className="shadow-lg p-6 hover:shadow-2xl rounded-[12px]">
        <Image src="/thunder.svg" alt="new" width={48} height={48} />
        <h1 className="text-2xl mt-5 mb-2">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to mane your courrse? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-[#101828]">Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'New Course on Machine Learning'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm font-normal text-[#475467]">
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 w-full justify-between">
              <Link href="/teacher/courses" className="w-1/2">
                <Button type="button" variant="outline" className="w-full text-base font-semibold" >
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting} variant="enroll" className="w-1/2 text-base font-semibold">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
