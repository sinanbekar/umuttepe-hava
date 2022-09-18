import React from "react";
import Head from "next/head";
import type { NextPage } from "next";
import cn from "classnames";
import { initializeStore, useStore } from "../app/store";
import useInterval from "../app/useInterval";
import { getKocaeliyiSeyretData } from "../lib/kocaeliyiseyret";
import SwitchButton from "../components/SwitchButton";
import Video from "../components/Video";
import Loading from "../components/Loading";

const Home: NextPage = () => {
  const { weather, isFocusedToStream, updateWeatherData, resetWeatherData } =
    useStore();

  const getWeatherData = React.useCallback(async () => {
    resetWeatherData();
    const response = await fetch("/api/weather");
    const data = await response.json();
    updateWeatherData(data);
    updateWeatherData({ isLoading: false });
  }, [resetWeatherData, updateWeatherData]);

  useInterval(() => {
    getWeatherData();
  }, 10 * 60 * 1000); // 10 mins

  React.useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  return (
    <>
      <Head>
        <title>Umuttepe&#39;de Hava</title>
      </Head>

      <SwitchButton />

      {/*
       // we are not using next/image because of lazy loading,
       // we need to render it in initial load */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/umuttepe.jpg"
        alt="umuttepe"
        className="absolute left-0 top-0 -z-50 h-full w-full object-cover brightness-50"
      />

      <Video />

      <div
        className={cn(
          "container mx-auto h-full max-w-full text-center font-semibold md:max-w-2xl",
          { invisible: isFocusedToStream }
        )}
      >
        {weather.isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-16 flex flex-col justify-center">
              <h1 className="text-3xl font-semibold">Umuttepe</h1>
              <div className="mt-6">
                <h2 className="flex justify-center">
                  <span className="ml-8 text-9xl">
                    {weather.current.tempValue}
                  </span>
                  <span className="text-3xl">°{weather.degreesUnit}</span>
                </h2>
                <h3 className="ml-2 mt-2 text-2xl">
                  {weather.current.phraseValue}
                </h3>
              </div>
            </div>

            <div className="flex h-20">
              {weather.days.slice(1, 4).map(
                // 3 days
                (daily, id) => (
                  <div key={id} className="flex-1 text-center">
                    <span className="block">{daily.day}</span>
                    <div className="flex justify-center">
                      <span className="ml-2 text-xl font-bold">
                        {daily.highTempValue}
                      </span>
                      <span className="font-bold">°</span>
                    </div>
                    <span className="ml-2 block text-xs">
                      {daily.phraseValue}
                    </span>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const zustandStore = initializeStore();

  const kocaeliyiseyretData = await getKocaeliyiSeyretData();
  const umuttepeData = kocaeliyiseyretData.find(
    (data) => data.headline === "İzmit Umuttepe"
  );

  zustandStore.setState({
    kbbUrl: umuttepeData?.url.toString() as string,
    umuttepeM3U8Url: umuttepeData?.m3u8Url as string,
  });

  return {
    props: {
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  };
};

export default Home;
