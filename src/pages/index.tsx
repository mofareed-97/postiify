import { GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import CreatePost from "~/components/CreatePost";
import AvatarUser from "~/components/Header/Avatar";
import AppPost from "~/components/Post";


const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <main className="py-6">
        <div className="container flex min-h-screen w-full gap-10">
          {sessionData?.user !== undefined ? <AboutCard /> : null}
          <div className="mx-auto flex max-w-xl flex-1 flex-col gap-6">
            {sessionData?.user !== undefined ? <CreatePost /> : null}
            <AppPost />
          </div>
          {sessionData?.user !== undefined ? (
            <div className="hidden w-80 lg:block">box 3</div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default Home;

const AboutCard = () => {
  const { data: sessionData } = useSession();
  return (
    // <div className="hidden h-fit w-80 rounded-md border bg-popover  text-popover-foreground shadow-sm outline-none md:block">
    <div className="hidden h-fit w-80 overflow-hidden rounded-md border  bg-popover shadow-sm outline-none md:block">
      <div className="relative h-32 w-full">
        <Image src={"/imgs/v-card.jpg"} alt="bg-card" fill />
      </div>
      <div className="relative flex w-full flex-col items-center gap-4 p-4">
        {sessionData?.user ? (
          <div className="absolute -top-8 rounded-full border-4 ">
            <AvatarUser className="h-14 w-14" />
          </div>
        ) : null}

        <Link href={"/"} className="pt-5">
          {sessionData?.user.name}
        </Link>

        <p className="text-xs text-popover-foreground">New York, USA</p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
