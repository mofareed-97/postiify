import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Login } from "~/components/Auth/Login";
import LoadingSpinner from "~/components/LoadingSpinner";
import About from "~/components/Profile/About";
import Banner from "~/components/Profile/Banner";
import ProfileFeed from "~/components/Profile/ProfileFeed";
import { api, RouterOutputs } from "~/utils/api";

// type PostType = RouterOutputs["posts"]["getAll"]["posts"][number];

export type UserType = RouterOutputs["profile"]["getUser"];

function Profile({ userId }: { userId: string }) {
  const { data, isLoading } = api.profile.getUser.useQuery({ userId });

  if (!data && !isLoading)
    return <h1 className="text-center">Page not found</h1>;

  if (isLoading)
    return (
      <div className="min-h-[90vh] w-full py-32">
        <LoadingSpinner big />
      </div>
    );

  return (
    <main className="container min-h-screen w-full py-4">
      <Banner profile={data} />

      <div className="flex w-full items-start gap-10 py-6">
        <About profile={data} />
        <ProfileFeed userId={userId} />
      </div>
      <Toaster />
    </main>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userId = context.params?.userId as string;

  return {
    props: {
      session,
      userId,
    },
  };
};
