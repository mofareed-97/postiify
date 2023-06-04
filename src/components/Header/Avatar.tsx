import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";

interface IProps {
  className: string;
}
function AvatarUser(props: IProps) {
  const { data: sessionData } = useSession();
  if (!sessionData?.user) return null;
  return (
    <Avatar className={`outline-none ${props.className}`}>
      <AvatarImage src={sessionData.user.image || ""} />
      <AvatarFallback className="">
        {sessionData.user.name ? sessionData.user.name[0] : null}
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarUser;
