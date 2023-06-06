import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import AvatarUser from "../Header/Avatar";
import {
  Bookmark,
  CalendarDays,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Comments from "./Comments";

type PostType = RouterOutputs["posts"]["getAll"][0];

const AppPost = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  console.log(post);
  let toastPostID: string;

  const { mutate, isLoading } = api.posts.deletePost.useMutation({
    onSuccess: () => {
      setOpen(false);
      void ctx.posts.getAll.invalidate();
      toast.dismiss(toastPostID);
      toast.success("Post deleted Successfully!");
    },
    onError: () => {
      toast.error("Something Went Wrong");
      setOpen(false);
    },
  });

  return (
    <div
      className={`overflow-hidden rounded-md border bg-popover shadow-sm outline-none ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex justify-between p-4">
        <div className="">
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex cursor-pointer gap-4">
                <AvatarUser
                  name={post.user.name}
                  src={post.user.image}
                  className="h-9 w-9"
                />
                <div className="">
                  <p className="text-sm font-medium">{post.user.name}</p>
                  <span className="text-xs">
                    {dayjs(post.createdAt).format("MMM D, YYYY  h:mm A")}
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex gap-4">
                <AvatarUser
                  name={post.user.name}
                  src={post.user.image}
                  className="h-9 w-9"
                />
                <div className="">
                  <p className="text-sm font-medium">@{post.user.name}</p>
                  <span className="text-xs">Software Engineering @vercel</span>
                  <div className="flex items-center gap-2 pt-1">
                    <CalendarDays className="h4 w-4" />
                    <span className="text-xs">
                      joined {dayjs(post.user.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="h-5 outline-none"
          >
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Copy Url</DropdownMenuItem>
            {sessionData?.user.id === post.userId ? (
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the post permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500"
              disabled={isLoading}
              onClick={() => {
                toastPostID = toast.loading("Deleting Your Post...", {
                  id: toastPostID,
                });

                mutate({ id: post.id });
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="whitespace-pre-line p-4">
        <p>{post.content}</p>
      </div>

      {post.image ? (
        <div className="relative h-80 max-h-80  w-full bg-gray-800">
          <Image
            src={post.image}
            alt="image post"
            fill
            className="object-contain"
          />
        </div>
      ) : // <Separator />
      null}

      <div className="flex items-center justify-around p-4">
        <Button variant="ghost">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="ghost">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      {/* {post.comments && post.comments.length > 0
        ? post.comments.map((el) => <Comments comment={el} key={el.id} />)
        : null} */}
      <Comments comment={post.comments} postId={post.id} />

      <Toaster />
    </div>
  );
};

export default AppPost;
