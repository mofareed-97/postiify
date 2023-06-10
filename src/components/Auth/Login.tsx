import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "../Header/icons";
import { Separator } from "../ui/separator";

export function Login() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2 text-center">Login</DialogTitle>
          <DialogDescription>
            Please Login with your email and password or with google account
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input id="email" className="" />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input id="password" type="password" className="col-span-3" />
          </div>
          <Button className="bg-sky-600 text-white" type="submit">
            Login
          </Button>
          <div className="flex items-center gap-1">
            <p className="text-xs">Dont have an account?</p>
            <Link href="/" className="text-xs font-medium">
              register now
            </Link>
          </div>
        </div>
        <Separator />

        <DialogFooter>
          <Button
            onClick={() =>
              signIn("google", { callbackUrl: "http://localhost:3000" })
            }
            className="w-full font-bold"
          >
            <Icons.google className="mr-2 h-6 w-6" /> Countinue with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
