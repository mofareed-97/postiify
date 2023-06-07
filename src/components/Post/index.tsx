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
} from "~/components/ui/alert-dialog";

import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Comments from "./Comments";
import { QueryClient } from "@tanstack/react-query";

type PostType = RouterOutputs["posts"]["getAll"]["posts"][number];

const AppPost = ({ post }: { post: PostType }) => {
  const [open, setOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
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

  const { mutate: likeToggle } = api.posts.toggleLike.useMutation({
    onSuccess: (data) => {
      if (data.addLike) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      void ctx.posts.getAll.invalidate();
    },
    onError: () => {
      toast.error("Ops, Failed to like the post");
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
      <Separator />
      <div className="flex items-center justify-around p-4">
        <Button variant="ghost" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="h-4 w-4" />
          <span className="ml-1 text-xs">{post.comments.length}</span>
        </Button>
        <Button
          onClick={() => {
            setIsLiked(!isLiked);
            likeToggle({
              id: post.id,
            });
          }}
          variant="ghost"
        >
          {/* {sessionData?.user !== undefined && */}
          {isLiked ? (
            <Heart className="h-4 w-4 fill-red-500 stroke-red-500" />
          ) : (
            <Heart className="h-4 w-4" />
          )}

          <span className="ml-1 text-xs">{post.likes.length}</span>

          {/* ) : null} */}
        </Button>
        <Button variant="ghost">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      {showComments ? (
        <Comments comment={post.comments} postId={post.id} />
      ) : null}

      <Toaster />
    </div>
  );
};

export default AppPost;

// function updateCache({
//   client,
//   variables,
//   data,
//   action,
// }: {
//   client: QueryClient;
//   variables: { postId: string };
//   data: {
//     userId: string;
//   };
//   action: "like" | "unlike";
// }) {
//   client.setQueriesData([["posts", "getAll"],{

//   }]);
// }
