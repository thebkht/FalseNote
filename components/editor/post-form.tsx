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
import ReactMarkdown from "react-markdown"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const postFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters long.",
    })
    .max(100, {
      message: "Username must not be longer than 100 characters.",
    }),
  visibility: z.enum(["public", "private", "draft"], {
    required_error: "Please select a visibility option",
  }),
  content: z.string().max(1200).min(4),
  topics: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  url : z.string(),
})

type PostFormValues = z.infer<typeof postFormSchema>

// This can come from your database or API.
const defaultValues: Partial<PostFormValues> = {
  visibility: "public",
}

export function PostForm() {
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
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
        </div>
      ),
    })
  }


  const [markdownContent, setMarkdownContent] = useState<string>(''); // State for Markdown content

  function handleContentChange(value: string) {
    setMarkdownContent(value);
    form.setValue('content', value); // Update the form field value
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
                <Textarea
                  placeholder="Your post goes here"
                  className="w-full min-h-[500px]"
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    field.onChange(e); // Let React Hook Form handle the value change
                    handleContentChange(e.target.value); // Update the Markdown content
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
        <Dialog>
  <DialogTrigger><Button size={"lg"} className="w-full">Submit</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Post Settings for publishing</DialogTitle>
      <DialogDescription>
      <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Privacy</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="public" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Public
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="private" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Private
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="draft" />
                    </FormControl>
                    <FormLabel className="font-normal">Draft</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL-friendly Link</FormLabel>
              <FormDescription>
                teletype.in/@bkhtdev/
              </FormDescription>
              <FormControl>
                <Input placeholder="URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 grid-cols-5">
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`topics.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  {/* <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription> */}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 col-span-5"
            onClick={() => append({ value: "" })}
          >
            Add Topic
          </Button>
        </div>
      <Button size={"lg"} className="w-full" type="submit">Submit</Button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
        
      </form>
    </Form>
  )
}