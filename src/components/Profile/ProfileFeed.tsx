import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import LoadingSpinner from "../LoadingSpinner";
import AppPost from "../Post";
import PostLoading from "../Post/PostLoading";
import useScrollPostition from "../useScrollPostition";

function ProfileFeed({ userId }: { userId: string }) {
  const scrollPosition = useScrollPostition();
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
    api.posts.getAll.useInfiniteQuery(
      {
        limit: 10,
        where: {
          user: {
            id: userId,
          },
        },
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
    <div className="mb-10 flex max-w-xl flex-1 flex-col gap-6">
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
  );
}

export default ProfileFeed;
