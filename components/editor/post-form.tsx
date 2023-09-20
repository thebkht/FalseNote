"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
/* import ReactMarkdown from "react-markdown" */

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import dynamic from "next/dynamic"
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // Set ssr to false to prevent server-side rendering
});
import 'react-quill/dist/quill.snow.css';

const postFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters long.",
    })
    .max(100, {
      message: "Username must not be longer than 100 characters.",
    }),
  visibility: z
    .string({
      required_error: "Please select a visibility option.",
    }),
  content: z.string().min(4),
  topics: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
})

type PostFormValues = z.infer<typeof postFormSchema>

// This can come from your database or API.
const defaultValues: Partial<PostFormValues> = {
  visibility: "public",
}

export function PostForm() {
  const [editorHtml, setEditorHtml] = useState<string>('');
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "topics",
    control: form.control,
  })

  function onSubmit(data: PostFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <div>
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
        <div className="mt-4">
        {/* <ReactMarkdown>{markdownContent}</ReactMarkdown> */}
      </div>
        </div>
      ),
    })
  }


  // Update markdownContent when the content field changes
  function handleContentChange(value: string) {
    setEditorHtml(value);
    form.setValue('content', value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title of the post" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
              <ReactQuill
                  value={editorHtml}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: [
                      [{ header: '1' }, { header: '2' }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image', 'blockquote', 'code-block'],
                      [{ 'script': 'sub' }, { 'script': 'super' }],
                      [{ 'indent': '-1' }, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }],
                      [{ 'align': [] }],
                      ['clean'],
                    ],
                  }}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}