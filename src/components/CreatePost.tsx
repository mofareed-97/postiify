import React, { useRef, useState } from "react";
import AvatarUser from "./Header/Avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Image as ImageIcon, SmilePlus, X } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";

function CreatePost() {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const filePickerRef = useRef(null);

  const addImageToPost = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: any) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (e: any) => {
    const sym = e.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setContent(content + emoji);
  };

  const submitHandle = () => {
    console.log(content);
  };

  return (
    <div className="rounded-md border bg-popover p-4 shadow-sm outline-none">
      <h3 className="text-md mb-8 font-medium">Create Post</h3>
      <div className="flex gap-4">
        <AvatarUser className="h-8 w-8" />
        <Textarea
          placeholder="Write anything..."
          className="resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="">
        {selectedFile && (
          <div className="relative">
            <div
              className="absolute left-1 top-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15181c] bg-opacity-75 hover:bg-[#272c26]"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-5  text-white" />
            </div>
            <Image
              fill
              src={selectedFile}
              alt=""
              className="max-h-80 rounded-2xl object-contain"
            />
          </div>
        )}
      </div>

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
        <Button onClick={submitHandle}>Submit</Button>
      </div>
    </div>
  );
}

export default CreatePost;
