import dayjs from "dayjs";
import { CalendarDays, MapPin, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { RouterOutputs } from "~/utils/api";
import AvatarUser from "../Header/Avatar";
import { Button } from "../ui/button";
import { UpdateProfile } from "./UpdateProfile";

export type ProfileType = RouterOutputs["profile"]["getUser"];
function Banner({ profile }: { profile: ProfileType }) {
  const { data: sessionData } = useSession();

  return (
    <div className="card relative overflow-hidden">
      <div className="h-40 w-full bg-gradient-to-r from-gray-700 via-gray-900 to-black" />
      <div className="relative p-4">
        <AvatarUser
          src={profile?.image}
          name={profile?.name}
          className="absolute -top-14 left-14  z-20 h-24 w-24 rounded-full border-2"
        />
        <div className="flex justify-between px-10 pt-10">
          <div className="">
            <h1 className="text-gray-500 dark:text-gray-400">
              @{profile?.name}
            </h1>
            <p className="my-4 text-sm ">{profile?.bio} Software Engineering</p>

            <div className="mb-4 flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className=" text-xs">
                  {profile?.country || "Not Available"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs">
                  Joined {dayjs(profile?.createdAt).format("MMMM YYYY")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                <span className="cursor-pointer">
                  {profile?.follows.length}
                </span>
                <span className=" text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </Button>

              <Button
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                <span className="">{profile?.follows.length}</span>
                <span className=" text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </Button>
            </div>
          </div>

          {profile?.id === sessionData?.user.id ? (
            <UpdateProfile profile={profile} />
          ) : (
            <Button>Follow</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
