"use client"

import{ useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
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
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation";

// import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidation } from "@/lib/validations/rumour";
import { addCommentToRumour, createRumour } from "@/lib/actions/rumour.actions";
import Image from "next/image";

interface Props {
    rumourId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({rumourId, currentUserImg, currentUserId} : Props) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            rumour: '',
        }
    })

    const onSubmit = async (values : z.infer<typeof CommentValidation>) => {
      await addCommentToRumour(rumourId, values.rumour, JSON.parse(currentUserId), pathname)

      form.reset();
    };
    
    return (
        <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="comment-form">


        <FormField
          control={form.control}
          name="rumour"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-3">
              <FormLabel>
                <Image 
                src = {currentUserImg}
                alt = "profile image"
                width = {28}
                height = {28}
                className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input 
                type = "text"
                placeholder="Comment..."
                className="no-focus text-light-1 outline-none"
                {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type = "submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
      </Form>
    )
}

export default Comment;