import React from "react";
import { Skeleton } from "../ui/skeleton";

function PostLoading() {
  return (
    <>
      {Array.from({ length: 10 }, (post, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-md border bg-popover shadow-sm outline-none"
        >
          <div className="flex justify-between p-4">
            <div className="">
              <div>
                <div className="flex gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="h-4 w-20 " />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-6 " />
          </div>

          <div className="whitespace-pre-line p-4">
            <Skeleton className="mb-2 h-4 w-64 " />
            <Skeleton className="h-4 w-48 " />
          </div>

          <div className="relative h-80 max-h-80  w-full">
            <Skeleton className="h-80 w-full " />
          </div>
        </div>
      ))}
    </>
  );
}

export default PostLoading;
