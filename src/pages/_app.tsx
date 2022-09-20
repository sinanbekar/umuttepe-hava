import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useCreateStore, Provider } from "../app/store";
import Head from "next/head";

interface WithZustandAppProps extends AppProps {
  pageProps: {
    initialZustandState: any;
  };
}

function UmuttepedeHava({ Component, pageProps }: WithZustandAppProps) {
  const createStore = useCreateStore(pageProps.initialZustandState);

  return (
    <Provider createStore={createStore}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default UmuttepedeHava;
