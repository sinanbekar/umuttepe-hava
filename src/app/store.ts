import { useLayoutEffect } from "react";
import create, { UseBoundStore } from "zustand";
import createContext from "zustand/context";
import { combine } from "zustand/middleware";
import { WeatherAPIResponse } from "../lib/weather";

let store: any;

type InitialState = ReturnType<typeof getDefaultInitialState>;
type UseStoreState = typeof initializeStore extends (
  ...args: never
) => UseBoundStore<infer T>
  ? T
  : never;

export type InitalState = {
  kbbUrl?: string;
  umuttepeM3U8Url?: string;
  isFocusedToStream: boolean;
  weather: {
    isLoading: boolean;
  } & WeatherAPIResponse;
};

const getDefaultInitialState = () =>
  ({
    kbbUrl: undefined,
    umuttepeM3U8Url: undefined,
    isFocusedToStream: false,
    weather: {
      isLoading: true,
      degreesUnit: "C",
      current: {
        tempValue: 0,
        phraseValue: "...",
      },
      days: [],
    },
  } as unknown as InitalState);

const zustandContext = createContext<UseStoreState>();
export const Provider = zustandContext.Provider;
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
  return create(
    combine(
      { ...getDefaultInitialState(), ...preloadedState },
      (set, _get) => ({
        setKbbUrl: (url: string) => {
          set({
            kbbUrl: url,
          });
        },
        setUmuttepeM3U8Url: (url: string) => {
          set({
            umuttepeM3U8Url: url,
          });
        },
        toggleFocusedToStream: () =>
          set((state) => ({ isFocusedToStream: !state.isFocusedToStream })),
        updateWeatherData: (data: Partial<InitalState["weather"]>) => {
          set((state) => ({ weather: { ...state.weather, ...data } }));
        },
        resetWeatherData: () => {
          set({
            weather: getDefaultInitialState().weather,
          });
        },
      })
    )
  );
};

export const useCreateStore = (serverInitialState: InitialState) => {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(serverInitialState);
  }

  const isReusingStore = Boolean(store);
  // For CSR, always re-use same store.
  store = store ?? initializeStore(serverInitialState);
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    // serverInitialState is undefined for CSR pages. It is up to you if you want to reset
    // states on CSR page navigation or not. I have chosen not to, but if you choose to,
    // then add `serverInitialState = getDefaultInitialState()` here.
    if (serverInitialState && isReusingStore) {
      store.setState(
        {
          // re-use functions from existing store
          ...store.getState(),
          // but reset all other properties.
          ...serverInitialState,
        },
        true // replace states, rather than shallow merging
      );
    }
  });

  return () => store;
};
