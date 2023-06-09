import React, { FormEvent, useRef, useState } from "react";
import AvatarUser from "./Header/Avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Image as ImageIcon, Loader2, SmilePlus, X } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

function CreatePost() {
  const { data: sessionData } = useSession();

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const [loading, setLoading] = useState(false);
  const ctx = api.useContext();
  const { mutate, isLoading } = api.posts.createPost.useMutation({
    onError: () => {
      setLoading(false);
      toast.error("Failed To send the post!");
    },
    onSuccess: () => {
      setLoading(false);
      setContent("");
      setSelectedFile(null);
      setUploadedImage(null);
      toast.success("Post Sent Successfully!");
      void ctx.posts.getAll.invalidate();
    },
  });

  const filePickerRef = useRef(null);

  const addImageToPost = (e: any) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file && file.size > maxSize) {
      toast.error("Ops, Maximum size is 5!");
      return;
    }
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setUploadedImage(file);
    }
  };

  const addEmoji = (e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setContent(content + emoji);
  };

  async function submitHandle(event: FormEvent) {
    event.preventDefault();
    if (!content && !uploadedImage) {
      toast.error("There is no content to send!");
      return;
    }

    setLoading(true);

    if (!uploadedImage) {
      mutate({
        content,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedImage);
    formData.append("upload_preset", "postify");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/mofareed/image/upload",
        formData
      );
      mutate({
        content,
        image: data.secure_url,
      });
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }

  return (
    <div className={`card p-4 ${isLoading ? "opacity-70" : "opacity-100"}`}>
      <h3 className="text-md mb-8 font-medium">Create Post</h3>
      <form onSubmit={submitHandle}>
        <div className="flex gap-4">
          <AvatarUser
            className="h-8 w-8"
            name={sessionData?.user.name}
            src={sessionData?.user.image}
          />
          <Textarea
            placeholder="Write anything..."
            className="resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {selectedFile && (
          <div className="relative py-4 pl-12">
            <div
              className="absolute left-14 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15181c] bg-opacity-75 hover:bg-[#272c26]"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-5  text-white" />
            </div>
            <img
              src={selectedFile}
              alt=""
              className="max-h-80 rounded-2xl object-contain"
            />
          </div>
        )}

        <div className="mt-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8"></div>
            <div className="flex gap-4">
              <div className="cursor-pointer">
                <ImageIcon
                  className="w-5 text-gray-500" // @ts-ignore
                  onClick={() => filePickerRef.current.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={filePickerRef}
                  hidden
                  onChange={addImageToPost}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <SmilePlus className="w-5 text-gray-500" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="absolute">
                {showEmojis ? (
                  <Picker
                    // onSelect={addEmoji}
                    data={data}
                    onEmojiSelect={addEmoji}
                    emojiSize={16}
                    // onClickOutside={() => {
                    //   if (showEmojis) {
                    //     setShowEmojis(false);
                    //   }
                    // }}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}

export default CreatePost;
