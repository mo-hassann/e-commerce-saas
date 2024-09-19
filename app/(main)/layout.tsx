import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import AlertBar from "@/components/layout/header/alert-bar";
import Navbar from "@/components/layout/header/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AlertBar />
      <Header />
      <Navbar />
      <div className="container py-12">{children}</div>
      <Footer />
    </>
  );
}
