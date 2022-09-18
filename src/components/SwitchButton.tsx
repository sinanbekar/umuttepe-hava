import { useStore } from "../app/store";

const SwitchButton = () => {
  const { isFocusedToStream, toggleFocusedToStream } = useStore();

  return (
    <div className="fixed top-4 right-4 md:top-auto md:bottom-8 md:right-8">
      <div className="group flex items-center">
        <div className="invisible -mr-12 rounded-full bg-slate-600 bg-opacity-70 py-3 px-6 opacity-0 shadow-xl transition-[opacity,visibility] group-hover:visible group-hover:opacity-100">
          <div className="mr-12">
            <span className="text-slate-200/8 text-sm">
              Hava durumu bilgisini {!isFocusedToStream ? "kapat" : "göster"}
            </span>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={isFocusedToStream}
          aria-label="Hava Durumunu Gizle, Göster"
          onClick={toggleFocusedToStream}
          className="z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 shadow-xl"
        >
          {!isFocusedToStream ? (
            <svg
              width={24}
              height={24}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x={2} y={7} width={20} height={15} rx={2} ry={2} />
              <path d="m17 2-5 5-5-5" />
            </svg>
          ) : (
            <svg
              className="fill-slate-300"
              width={32}
              height={32}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6v3.094a4.995 4.995 0 0 0-1.75.75L5.062 7.625 3.625 9.063l2.219 2.187a4.995 4.995 0 0 0-.75 1.75H2v2h3.125c.129.629.383 1.2.719 1.719l-2.219 2.218.625.625C4.113 20.02 4 20.5 4 21c0 2.758 2.242 5 5 5h16c2.758 0 5-2.242 5-5 0-2.02-1.21-3.82-3.031-4.594-.282-2.418-2.313-4.308-4.782-4.406A5.968 5.968 0 0 0 17 9c-.227 0-.438.008-.656.031l-1.407-1.406-2.187 2.219A5.195 5.195 0 0 0 11 9.125V6Zm1 5c.766 0 1.445.285 1.969.75a6.064 6.064 0 0 0-.656 1.313 4.022 4.022 0 0 0-3.22 3.03c-.054.009-.105.02-.155.032C7.377 15.582 7 14.848 7 14c0-1.668 1.332-3 3-3Zm7 0c1.605 0 3.055.96 3.688 2.438l.28.687.907-.094c.043-.008.078-.031.125-.031 1.652 0 2.996 1.352 3 2.938l-.031.968.781.188A2.996 2.996 0 0 1 28 21c0 1.652-1.348 3-3 3H9c-1.652 0-3-1.348-3-3s1.348-3 3-3h1v-1c0-1.102.895-1.996 1.906-2l1 .063.188-.844C13.469 12.359 15.102 11 17 11Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default SwitchButton;
