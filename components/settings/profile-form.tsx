"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

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
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "lucide-react"
import { Icons } from "../icon"
import { useRouter } from "next/navigation"
import { ToastAction } from "../ui/toast"

const profileFormSchema = z.object({
  id: z.string(),
  username: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  name: z.string().nullable().optional(),
  bio: z.string().max(160).nullable().optional(),
  location: z.string().max(30).nullable().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>


export function ProfileForm({ data }: { data: Partial<ProfileFormValues>}) {
  const router = useRouter()
  // This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    id: data.id,
    username: data.username,
    name: data.name,
    email: data.email ?? "",
    bio: data.bio ?? "",
    location: data.location,
}
  const { toast } = useToast()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })


  async function onSubmit(data: ProfileFormValues) {
    const response = await fetch(`/api/user/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your name was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Profile updated successfully.",
      action: (
        <ToastAction
          altText="View profile"
          onClick={() => router.push(`/@${data.username}`)}
          className="hover:text-secondary-foreground"
        >
          View profile
        </ToastAction>
      ),
    })

    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full justify-between gap-8 flex flex-col items-start">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field}
                  value={field.value ?? ''}
                   />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='w-96'>
                  {field.value && (
                    <SelectItem value={field.value}>
                      {field.value}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Your public email address on GitHub.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  {...field}
                  value={field.value ?? ''}
                  className="resize-none w-96"
                />
              </FormControl>
              <FormDescription>
                Briefly describe yourself in 160 characters or less.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field}
                  value={field.value ?? ''} className='w-96'
                   />
              </FormControl>
              <FormDescription>
                Add your location to your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
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
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}