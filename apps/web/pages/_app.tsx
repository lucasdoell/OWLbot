import NavigationMenu from "@/components/ui/NavigationMenu";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavigationMenu />
      <Component {...pageProps} />
    </>
  );
}
