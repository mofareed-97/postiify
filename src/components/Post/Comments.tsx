import { Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";
import AvatarUser from "../Header/Avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type CommentType = RouterOutputs["posts"]["getAll"]["posts"][0]["comments"][0];

dayjs.extend(relativeTime);

function Comments({
  comment,
  postId,
}: {
  comment: CommentType[];
  postId: string;
}) {
  return (
    <>
      <CreateComment id={postId} />
      <Separator />
      {comment.length > 0 ? (
        <h3 className="mb-1 p-4 pt-8 text-sm font-medium">Comments</h3>
      ) : null}
      {comment.length > 0
        ? comment.map((el) => (
            <div key={el.id} className="px-4 py-2">
              <div className="flex gap-4">
                <AvatarUser
                  className="h-7  w-7"
                  src={el.user.image}
                  name={el.user.name}
                />
                <div className="">
                  <div className="min-w-[80px] overflow-hidden rounded-lg rounded-bl-none border bg-popover px-4 py-2 shadow-sm">
                    <p className="text-xs ">{el.content}</p>
                  </div>
                  <div className="mt-1 flex justify-end">
                    <span className="text-[8px]">
                      {dayjs(el.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  );
}

export default Comments;

function CreateComment({ id }: { id: string }) {
  const { data: sessionData } = useSession();
  const [input, setInput] = useState("");

  if (sessionData?.user === undefined) return null;

  const ctx = api.useContext();
  const { mutate, isLoading } = api.posts.newComment.useMutation({
    onSuccess: () => {
      void ctx.posts.invalidate();
      toast.success("New Comment added successfully!");
      setInput("");
    },
    onError: () => {
      toast.error("Failed to add comment!");
    },
  });

  const handleNewComment = (event: FormEvent) => {
    event.preventDefault();
    if (!input) {
      toast.error("Write anything");
      return;
    }
    mutate({
      content: input,
      postId: id,
    });
  };
  return (
    <form
      onSubmit={handleNewComment}
      className={`flex gap-2 px-4 py-8 ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <AvatarUser
        className="h-8 w-8"
        src={sessionData.user.image}
        name={sessionData.user.name}
      />
      <Input
        placeholder="Write a Comment..."
        className=""
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        variant="outline"
        className="flex items-center justify-center gap-1 bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Send
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
