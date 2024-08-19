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
import { createRumour } from "@/lib/actions/rumour.actions";

interface Props {
    rumourId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({rumourId, currentUserImg, currentUserId}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            rumour: '',
        }
    })

    const onSubmit = async (values : z.infer<typeof CommentValidation>) => {
    //   await createRumour({
    //     text : values.rumour,
    //     author : userId,
    //     communityId : null,
    //     path : pathname,

    //   });

      router.push("/");
    };
    
    return (
        <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10">


        <FormField
          control={form.control}
          name="rumour"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                fixing here
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3  text-light-1">
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

        <Button type = "submit" className="bg-primary-500">
          Spread Rumour
        </Button>
      </form>
      </Form>
    )
}

export default Comment;