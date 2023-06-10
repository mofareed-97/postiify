import { useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import CreatePost from "~/components/CreatePost";
import AvatarUser from "~/components/Header/Avatar";
import LoadingSpinner from "~/components/LoadingSpinner";
import AppPost from "~/components/Post";
import PostLoading from "~/components/Post/PostLoading";
import useScrollPostition from "~/components/useScrollPostition";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const scrollPosition = useScrollPostition();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    api.posts.getAll.useInfiniteQuery(
      {
        limit: 10,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const client = useQueryClient();

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPosition, fetchNextPage, hasNextPage, isFetching]);
  return (
    <>
      <main className="py-6">
        <div className="container flex min-h-screen w-full gap-10">
          {sessionData?.user !== undefined ? <AboutCard /> : null}
          <div className="mx-auto mb-10 flex max-w-xl flex-1 flex-col gap-6">
            {sessionData?.user !== undefined ? <CreatePost /> : null}
            {posts.map((el) => {
              return (
                <AppPost
                  key={el.id}
                  post={el}
                  client={client}
                  input={{
                    limit: 10,
                  }}
                />
              );
            })}
            {isLoading ? <PostLoading /> : null}

            {isFetching ? <LoadingSpinner /> : null}
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
    <div className="sticky top-20 hidden h-fit w-80 overflow-hidden rounded-md border  bg-popover shadow-sm outline-none md:block">
      <div className="relative h-32 w-full">
        <Image src={"/imgs/v-card.jpg"} alt="bg-card" fill />
      </div>
      <div className="relative flex w-full flex-col items-center gap-4 p-4">
        {sessionData?.user ? (
          <Link
            href={sessionData?.user.id}
            className="absolute -top-8 rounded-full border-4 "
          >
            <AvatarUser
              className="h-14 w-14"
              name={sessionData.user.name}
              src={sessionData.user.image}
            />
          </Link>
        ) : null}
        {sessionData?.user ? (
          <Link href={sessionData?.user.id} className="pt-5">
            {sessionData?.user.name}
          </Link>
        ) : null}
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
