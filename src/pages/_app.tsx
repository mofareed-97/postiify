import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { SiteHeader } from "~/components/Header";
import { ThemeProvider } from "~/components/Header/theme-provider";
import { cn } from "~/utils/cn";
import { fontSans } from "~/utils/fonts";
import Head from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextNProgress from "nextjs-progressbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Postify</title>
        <meta
          name="description"
          content="Postify is social media website for sharing your daily life all people around the world  "
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NextNProgress />
      <SessionProvider session={session}>
        <style jsx global>{`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}</style>
        <div
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
