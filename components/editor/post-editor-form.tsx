"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

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
import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowUp, Check, Eye, Hash, Pencil, RefreshCcw, Trash, Trash2 } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextareaAutosize from 'react-textarea-autosize';
import { Icons } from "../icon"
import { useRouter } from "next/navigation"
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Textarea } from "../ui/textarea"
import { ToastAction } from "../ui/toast"
import { toast } from "../ui/use-toast"
import { dateFormat } from "@/lib/format-date"
import TagBadge from "../tags/tag"
import { Cross2Icon } from "@radix-ui/react-icons"
import PostDeleteDialog from "../blog/post-delete-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "use-debounce"

const components = {
  code({ className, children, }: { className: string, children: any }) {
    let lang = 'text'; // default monospaced text
    if (className && className.startsWith('lang-')) {
      lang = className.replace('lang-', '');
    }
    return (
      <SyntaxHighlighter style={oneDark} language={lang} >
        {children}
      </SyntaxHighlighter>
    )
  }
}

async function fetchSuggestions(query: string) {
  const tagResponse = await fetch(`/api/tags/search?search=${encodeURIComponent(query)}&limit=5`);

  if (!tagResponse.ok) {
    throw new Error(`Tag API request failed: ${tagResponse.status}`);
  }
  const { tags } = await tagResponse.json();

  return tags;
}

export function PostEditorForm(props: { post: any, user: any }) {
  const router = useRouter();
  const [markdownContent, setMarkdownContent] = useState<string>(props.post?.content);

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
    content: z.string(),
    coverImage: z.string().optional(),
    tags: z
      .array(
        z.object({
          value: z.string(),
        })
      ).max(5, {
        message: "You can select up to 5 tags.",
      })
      .optional(),
    url: z.string(),
    subtitle: z.string().max(280).optional(),
  })

  type PostFormValues = z.infer<typeof postFormSchema>
  // This can come from your database or API.
  const defaultValues: Partial<PostFormValues> = {
    title: props.post?.title,
    content: props.post?.content,
    visibility: props.post?.visibility,
    coverImage: props.post?.cover || '',
    url: props.post?.url,
    subtitle: props.post?.subtitle || '',
    tags: props.post?.tags?.map((tag: any) => ({
      value: tag.tag?.name,
    })),
  }

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  })


  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  })

  const [open, setOpen] = useState<boolean>(false);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string | undefined>(undefined);
  const [query] = useDebounce(newTag, 1000)
  const [suggestions, setSuggestions] = useState<any>([])

  useEffect(() => {
    if (newTag !== undefined) {
      fetchSuggestions(newTag).then((result) => setSuggestions(result));
      setCommandOpen(true)
    } else {
      setSuggestions([]);
    }
  }, [query]);

  async function onSubmit(data: PostFormValues) {
    try {
      await saveDraft();
      setIsPublishing(true);

      if (file) {
        const dataForm = new FormData();
        dataForm.set('file', file);

        const postId = form.getValues('url');
        const requestBody = {
          postId,
          userId: props.user?.id,
        };

        dataForm.set('body', JSON.stringify(requestBody));

        const res = await fetch(`/api/upload?postId=${postId}&authorId=${props.user?.username}`, {
          method: 'POST',
          body: dataForm,
        });

        const { data: coverUrl } = await res.json();
        data.coverImage = coverUrl.url;
      }

      const result = await fetch(`/api/post/${props.post?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data }),
      });

      if (!result.ok) {
        throw new Error('Failed to update post');
      }

      await fetch(`/api/revalidate?path=/${props.user?.username}`);
      if (data.visibility === 'public') {
        await fetch(`/api/revalidate?path=/${props.user?.username}/${form.getValues('url')}`);
        router.push(`/${props.user?.username}/${form.getValues('url')}?published=true`);
        toast({ description: "Post Published!" });
      } else {
        router.push(`/${props.user?.username}/`);
      }
      
    } catch (error) {
      console.error(error);
      setIsPublishing(false);
      toast({
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
    } finally {
      setOpen(false);
    }
  }
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [cover, setCover] = useState<string>('');
  const [file, setFile] = useState<File>(); // State for the uploaded file

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const saveDraft = async () => {
    if (!isPublishing) {
      setIsSaving(true);
      if (file) {
        try {
          const dataForm = new FormData()
          dataForm.set('file', file)
          // Construct the request body with postId and authorId
          const requestBody = {
            postId: form.getValues('url'),
            userId: props.user?.id,
          };

          dataForm.set('body', JSON.stringify(requestBody));

          const res = await fetch(`/api/upload?postId=${form.getValues('url')}&authorId=${props.user?.username}`, {
            method: 'POST',
            body: dataForm,
          });
          // get the image url
          const { data: coverUrl } = await res.json()
          form.setValue('coverImage', coverUrl.url);

        } catch (e: any) {
          // Handle errors here
          console.error(e);
        }
      }
      if (form.getValues('title') && form.getValues('content')) {
        form.setValue('visibility', 'draft');
        try {
          // Submit the form
          const result = await fetch(`/api/post/${props.post?.id}/drafts`, {
            method: "PATCH",
            body: JSON.stringify({ ...form.getValues() }),
          })
          if (!result.ok) {
            toast({
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
              action: <ToastAction altText="Try again">Try again</ToastAction>
            })
            setIsSaving(false);
          }
          setLastSavedTime(Date.now());
          toast({
            description: "Draft Saved!",
          })
        } catch (error) {
          console.error(error)
        }
      }
      setIsSaving(false);
    }
  }

  // when value changes, wait 750ms than save it as a draft
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  useEffect(() => {
    const timeout = setTimeout(saveDraft, 15000);
    return () => clearTimeout(timeout);
  }, [form, file, props.user, props.post, open])


  useEffect(() => {
    const newCoverImage = form.getValues('coverImage') as string;

    if (newCoverImage && newCoverImage !== cover) {
      setCover(newCoverImage);
    }

    if (file) {
      const newCoverUrl = URL.createObjectURL(file);

      if (newCoverUrl !== cover) {
        setCover(newCoverUrl);
      }
    }
  }, [file, form]);

  async function validateUrl(value: string) {
    try {
      const result = await fetch(`/api/posts/validate-url?url=${value}&authorId=${props.user?.id}`, {
        method: 'GET',
      });

      setIsValidUrl(result.ok);
    } catch (error) {
      console.error(error);
      setIsValidUrl(false);
      // Consider showing an error message to the user here
    }
    return isValidUrl;
  }

  // URL-friendly link validation
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const words = value.split(' ');
    const url = words.length > 1 ? `${words[0].toLowerCase()}-${words[1].toLowerCase()}` : value.toLowerCase();

    validateUrl(url);

    if (isValidUrl) {
      form.setValue('url', url);
    } else {
      setIsValidUrl(null);
    }
  }

  async function handleContentChange(value: string) {
    form.setValue('content', value);
    setMarkdownContent(value);
  }

  //Set url value from title value
  async function handleTitleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    form.setValue('title', value);
    // Replace spaces with dashes and make lowercase, if the title has more than 2 words, less than 100 characters and don't have any special characters if it has any special characters remove them, if less than 2 words, change the url to random string
    //if title has less than 2 words, change the url to random string
    if (value.length < 100) {
      if (value.split(' ').length < 2) {
        const url = Math.random().toString(36).substring(2, 15)
        if(await validateUrl(url)) form.setValue('url', url);
      } else {
        // Replace spaces with dashes and make lowercase of 2 words only and remove special characters
        const url = value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-').toLowerCase().split(' ').slice(0, 2).join('-')
        if(await validateUrl(url)) form.setValue('url', url);
      }
    }
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    form.setValue('subtitle', e.target.value);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full lg:w-[800px]" id="PostForm">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Title of the post" className="font-bold text-3xl md:text-4xl md:leading-snug bg-popover" {...field} onChange={handleTitleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Tabs defaultValue={"editor"} className="min-h-[250px]">
            <TabsList className="mb-2 absolute z-20 my-3 top-0 right-36">
              <TabsTrigger value="editor" ><Pencil className="h-[1.2rem] w-[1.2rem]" /><span className="sr-only">Editor</span></TabsTrigger>
              <TabsTrigger value="preview"><Eye className="h-[1.2rem] w-[1.2rem]" /> <span className="sr-only">Preview</span></TabsTrigger>
            </TabsList>
            <TabsContent value="editor"> <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      className="flex rounded-md border border-input bg-popover px-3 py-2 text-sm md:text-base text-foreground ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                      placeholder="Write your post here..."
                      {...field}
                      onChange={(e) => handleContentChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /></TabsContent>
            <TabsContent value="preview" className="pb-5 px-3 bg-popover text-sm rounded-md">
              <article className="article__content markdown-body w-full !m-0">
                <Markdown options={{
                  overrides: {
                    code: {
                      component: components.code,
                    },
                  },
                }}>{markdownContent}</Markdown>
                {/* <div dangerouslySetInnerHTML={{ __html: post?.content }} className="markdown-body" /> */}
              </article>
            </TabsContent>
          </Tabs>

          <Dialog onOpenChange={setOpen} open={open}>
            <DialogContent className="h-full max-h-[405px] md:max-h-[540px] !p-0">
              <ScrollArea className="h-full w-full px-6">
                <DialogHeader className="py-6">
                  <DialogTitle className="font-bold">Post Settings for publishing</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pb-4 m-1">
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
                          {`falsenotes.app/${props.user?.username}/`}
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="URL" {...field} onChange={handleUrlChange} />
                        </FormControl>
                        {isValidUrl !== null && (
                          isValidUrl ? (
                            <FormMessage className="text-green-500">
                              This URL is available.
                            </FormMessage>
                          ) : (
                            <FormMessage className="text-red-500">
                              This URL is unavailable. Please try another one.
                            </FormMessage>
                          )
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Preview</FormLabel>
                        <FormControl>
                          <>
                            {
                              cover && (
                                <AspectRatio ratio={16 / 9} className="bg-muted">
                                  <Image
                                    src={file ? URL.createObjectURL(file) as string : field.value as string}
                                    alt="Cover Image"
                                    fill
                                    className="rounded-md object-cover"
                                  />
                                </AspectRatio>
                              )
                            }
                            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />

                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <TextareaAutosize {...field} className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]" rows={1}
                            onChange={handleDescriptionChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormDescription>
                          Add tags (up to 5) to help readers find your post easier.
                        </FormDescription>
                        <div className="flex-wrap">
                          {fields.map((field, index) => (
                            <TagBadge key={field.id} className="pr-1.5 text-sm font-medium my-1.5 mr-1.5">
                              {field.value}
                              <Button variant={'ghost'} onClick={() => remove(index)} className="h-fit w-fit !p-0 ml-2.5 hover:bg-transparent"><Cross2Icon className="h-3 w-3" /></Button>
                            </TagBadge>
                          ))}
                        </div>
                        {fields.length !== 5 && (
                          <FormControl>
                            <>

                              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                <PopoverTrigger className="w-full">
                                  <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                  <Command className="w-full">
                                    {suggestions?.length === 0 && (
                                      <CommandEmpty>No results found.</CommandEmpty>
                                    )}
                                    {
                                      suggestions.length > 0 && (
                                        <CommandGroup>

                                          {suggestions?.map((tag: any) => (
                                            <CommandItem key={tag.id} value={tag.name} >
                                              <Button variant="ghost" className="h-fit w-fit !p-0" onClick={() => {
                                                if (tag.name?.trim() !== '' && tag.name !== undefined) {
                                                  append({ value: tag.name });
                                                  setNewTag(undefined);
                                                  setCommandOpen(false);
                                                }
                                              }}>
                                                <Hash className="mr-2 h-4 w-4" />
                                                <span>{tag.name.replace(/-/g, " ")}</span>
                                              </Button>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      )
                                    }
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </>
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length < 5 && (
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        if (newTag?.trim() !== '' && newTag !== undefined) {
                          append({ value: newTag });
                          setNewTag('');
                        }
                      }}
                    >
                      Add Topic
                    </Button>
                  )}

                </div>
              </ScrollArea>
              <DialogFooter className="p-6 border-t">
                <Button
                  type="submit"
                  className="ml-auto w-full"
                  size={"lg"}
                  form="PostForm"
                  disabled={isPublishing}
                >
                  {
                    isPublishing ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Publishing
                      </>
                    ) : (
                      <>Publish</>
                    )
                  }
                </Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>

        </form>
      </Form>
      <div className="flex absolute right-3.5 top-0 z-50 gap-1.5">
        <Dialog>
          <DialogTrigger><Button size={"icon"} variant={"outline"} className="!mt-3" disabled={isSaving}>{isSaving ? <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" /> : <Check className="h-[1.2rem] w-[1.2rem]" />}</Button></DialogTrigger>
          <DialogContent className="flex flex-col justify-center md:w-72">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <RefreshCcw className={"h-10 w-10"} strokeWidth={1.25} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Auto Saved, {dateFormat(lastSavedTime)}</h1>
              <p className="text-sm text-muted-foreground text-center">
                FalseNotes automatically saves your post as a draft every 15 seconds. You can also save it manually by clicking the save button.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => saveDraft()} className="m-auto" size={"lg"} variant="outline" disabled={isSaving}>{
                  isSaving ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving
                    </>
                  ) : (
                    <>Save</>
                  )

                }</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button size={"icon"} variant={"outline"} className="!mt-3" disabled={isSaving} onClick={() => setShowDeleteAlert(true)}>{isSaving ? <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" /> : <Trash2 className="h-[1.2rem] w-[1.2rem]" />}</Button>
        <PostDeleteDialog post={props.post} user={props.user} open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />


        <Button size={"icon"} variant={"secondary"} disabled={isSaving} onClick={
          () => {
            if (form.getValues('title') === undefined) {
              toast({
                description: "Please enter a title for your post!",
                variant: "destructive",
              })
            }
            if (form.getValues('content') === undefined) {
              toast({
                description: "Please enter a content for your post!",
                variant: "destructive",
              })
            }
            if (form.getValues('content') == undefined && form.getValues('title') == undefined) {
              toast({
                description: "Please enter a title and content for your post!",
                variant: "destructive",
              })
            }
            if (form.getValues('content') !== undefined && form.getValues('title') !== undefined) {
              form.setValue('visibility', 'public');
              setOpen(true);
            }
          }
        } className="!mt-3">{isPublishing ? <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" /> : <ArrowUp className="h-[1.2rem] w-[1.2rem]" />}</Button></div>
    </>
  )
}