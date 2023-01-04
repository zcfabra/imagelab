import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <>
  <Head>
    <title>IMAGELAB</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
  </Head>
    <Component {...pageProps} />;
  </>
};

export default api.withTRPC(MyApp);
