import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Login } from "../Auth/Login";

export function SiteHeader() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {sessionData?.user !== undefined ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-7 w-7 outline-none">
                    <AvatarImage src={sessionData.user.image || ""} />
                    <AvatarFallback className="">
                      {sessionData.user.name ? sessionData.user.name[0] : null}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/${sessionData.user.id}`)}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void signOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            <ThemeToggle />
            {sessionData?.user === undefined ? (
              // <Button onClick={() => void signIn()}>Login</Button>
              <Login />
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
