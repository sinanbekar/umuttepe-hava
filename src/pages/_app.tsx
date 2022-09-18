import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useCreateStore, Provider } from "../app/store";

interface WithZustandAppProps extends AppProps {
  pageProps: {
    initialZustandState: any;
  };
}

function UmuttepedeHava({ Component, pageProps }: WithZustandAppProps) {
  const createStore = useCreateStore(pageProps.initialZustandState);

  return (
    <Provider createStore={createStore}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default UmuttepedeHava;
