import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

function Profile() {
  return (
    <main className="py-4">
      <div className="container min-h-screen w-full">Profile</div>
    </main>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const userId = context?.params?.userId;

  console.log(userId);
  if (!userId) {
    return {
      props: {},
    };
  }

  //   @ts-ignore
  //   const user = api.profile.getUser.useQuery({ userId: context.params });

  return {
    props: {
      session,
    },
  };
};
