'use client'

import React from 'react'
import * as z from "zod";
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';

import {
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormMessage,
    FormDescription,
    FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';    
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
    })


const CreatePage = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            toast.success("Course created successfully.")
            router.push(`/teacher/courses/${response.data.id}`)
        } catch {
            toast.error("Something went wrong.")
        }
    }

  return (
    <div className='max-w-5xl mx-auto flex items-center justify-center h-full p-6'>
        <div className="">
            <h1 className="text-2xl">Name your course</h1>
            <p className="text-sm text-slate-600">What would you like to mane your courrse? Don&apos;t worry, you can change this later.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 mt-8'
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>
                                    Course Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'New Course on Machine Learning'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href="/">
                            <Button
                                type='button'
                                variant="ghost"
                                >Cancel</Button>
                        </Link>
                        <Button
                          type='submit'
                          disabled={!isValid || isSubmitting }
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default CreatePage