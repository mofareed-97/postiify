import { z } from "zod";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CalendarIcon, ChevronsUpDown, Settings } from "lucide-react";
import { ProfileType } from "./Banner";
import { cn } from "~/utils/cn";
import countries from "~/utils/countries";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import LoadingSpinner from "../LoadingSpinner";

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  bio: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
  birthDate: z.date().or(z.null()).optional(),
});

type UpdateProfileSchema = z.infer<typeof formSchema>;

export function UpdateProfile({ profile }: { profile: ProfileType }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { mutate, isLoading } = api.profile.updateProfile.useMutation({});
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      country: profile?.country || "",
      website: profile?.website || "",
      birthDate: profile?.birthDate || null,
    },
  });
  const [countryOpen, setCountryOpen] = useState(false);
  const updateProfileHandler: SubmitHandler<UpdateProfileSchema> = (data) => {
    mutate(data);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateProfileHandler)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                placeholder="Write about yourself..."
                {...form.register("bio")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                {...form.register("website")}
                className="col-span-3"
              />
            </div>
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birthDate" className="text-right">
                    Birth Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("MMMM D, YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          // @ts-ignore
                          selected={field.value}
                          fromYear={1990}
                          toYear={2023}
                          captionLayout={"dropdown"}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">
                    Country
                  </Label>

                  <div className="col-span-3">
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value : "Select Country"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="h-96 w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandEmpty>No Country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                value={country}
                                className="cursor-pointer"
                                key={country}
                                onSelect={(value) => {
                                  form.setValue("country", country);
                                  setCountryOpen(false);
                                }}
                              >
                                {country}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className="mt-2 w-full md:w-32"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? <LoadingSpinner /> : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
