import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return(
    <ClerkProvider {...pageProps} >
      <Head>
        <title>Birber</title>
        <meta name="description" content="🦜" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            borderRadius: '10px', 
            background: '#333',
            color: '#fff',
          }
        }}
      />
      <Component {...pageProps} />
    </ClerkProvider>
  ); 
};

export default api.withTRPC(MyApp);
