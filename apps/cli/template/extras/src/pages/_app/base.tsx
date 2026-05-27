import "@/styles/globals.css";

import { type AppType } from "next/dist/shared/lib/utils";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={geist.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
