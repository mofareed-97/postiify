import React from "react";
import AvatarUser from "./Header/Avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Image } from "lucide-react";

function CreatePost() {
  return (
    <div className="overflow-hidden rounded-md border bg-popover p-4 shadow-sm outline-none">
      <h3 className="text-md mb-8 font-medium">Create Post</h3>
      <div className="flex gap-4">
        <AvatarUser className="h-8 w-8" />
        {/* <Input placeholder="Write anything..." /> */}
        <Textarea placeholder="Write anything..." className="resize-none" />
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8"></div>
          <div className="">
            <Image size={16} />
          </div>
        </div>
        <Button>Submit</Button>
      </div>
    </div>
  );
}

export default CreatePost;
