import { useStore } from "../app/store";

const Footer = () => {
  const { kbbUrl } = useStore();

  return (
    <footer className="mx-auto mb-8 flex w-full max-w-xl flex-col items-center justify-center px-8 text-center md:p-0">
      <div className="mb-6">
        <a
          target="_blank"
          rel="noreferrer nofollow"
          href="https://twitter.com/umuttepedehava"
          className="flex items-center gap-x-2 rounded bg-black bg-opacity-10 py-2 px-4 font-bold hover:ring-2"
        >
          <svg
            className="h-5 w-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg>
          <span className="text-sm">@umuttepedehava</span>
        </a>
      </div>
      <div className="flex flex-col">
        <span className="text-xs md:text-sm">
          Arka plandaki canlı yayın&nbsp;
          <b>kocaeliyiseyret.com</b>&#39;dan sağlanmaktadır. Eğitim amaçlı
          kullanım söz konusu olup hakları <b>Kocaeli BB</b>&#39;ye aittir.
        </span>

        <a
          className="p-1 text-sm md:p-2"
          href={kbbUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          <b>kocaeliyiseyret.com</b> canlı yayını için <b>tıkla</b>.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
