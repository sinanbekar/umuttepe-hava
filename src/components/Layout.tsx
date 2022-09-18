import Footer from "../components/Footer";

type Props = { children?: React.ReactNode };

export default function Layout({ children }: Props) {
  return (
    <>
      <main className="my-auto px-8">{children}</main>
      <Footer />
    </>
  );
}
