import React from "react";
import dynamic from "next/dynamic";
import cn from "classnames";
import { useStore } from "../app/store";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const Video = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { umuttepeM3U8Url: url, isFocusedToStream } = useStore();

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 -z-10 h-full w-full overflow-hidden",
        { "brightness-50": !isFocusedToStream }
      )}
    >
      {isLoading && (
        <div className="flex h-full justify-center opacity-20">
          <svg
            version="1.1"
            id="L9"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 0 0"
            xmlSpace="preserve"
          >
            <path
              fill="#fff"
              d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1s"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      )}
      <ReactPlayer
        /* Given a 16:9 aspect ratio, 16/9*100 = 177.77 */
        className="absolute top-1/2 left-1/2 min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
        config={{
          file: {
            forceHLS: true,
          },
        }}
        volume={0}
        muted={true}
        playing={true}
        width={"100vw"}
        height={"56.25vw"} /* Given a 16:9 aspect ratio, 9/16*100 = 56.25 */
        url={url}
        onStart={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Video;
