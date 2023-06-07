import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";

interface IProps {
  className: string;
  src?: string | null;
  name?: string | null;
}
function AvatarUser(props: IProps) {
  return (
    <Avatar className={`outline-none ${props.className}`}>
      <AvatarImage src={props.src || ""} />
      <AvatarFallback className="">
        {props.name ? props.name[0] : null}
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarUser;
