import AlertBar from "@/components/layout/alert-bar";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
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
