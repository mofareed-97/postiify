import dayjs from "dayjs";
import { Cake, Globe, Mail, Map } from "lucide-react";
import React from "react";
import { UserType } from "~/pages/[userId]";

function About({ profile }: { profile: UserType }) {
  return (
    <div className="card flex flex-col  justify-center gap-6 p-10 pl-4 pr-20 ">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span className="text-xs">{profile?.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Cake className="h-4 w-4" />
        <span className="text-xs">
          {profile?.birthDate
            ? dayjs(profile?.birthDate).format("MMM, D, YYYY")
            : "Not Available"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="text-xs">{profile?.website || "Not Available"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Map className="h-4 w-4" />
        <span className="text-xs">{profile?.country || "Not Available"}</span>
      </div>
    </div>
  );
}

export default About;
