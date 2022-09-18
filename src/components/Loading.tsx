const Loading = () => {
  return (
    <div
      className="flex animate-[pulse_1s_ease-in-out_infinite] flex-col items-center justify-center"
      role="status"
    >
      <div className="mb-16 flex flex-col items-center justify-center">
        <div className="h-9 w-44 bg-gray-300 bg-opacity-50"></div>
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="h-28 w-44 bg-gray-300 bg-opacity-50"></div>
          <div className="mt-6 h-8 w-52 bg-gray-300 bg-opacity-50"></div>
        </div>
      </div>

      <div className="h-20 w-full">
        <div className="h-full w-full bg-gray-300 bg-opacity-50"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
