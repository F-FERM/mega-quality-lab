import Navbar from "@/app/components/layout/Navbar";
import Footer from "../components/layout/Footer";


export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar
      
      />
      <div className="w-full">{children}</div>
      <Footer/>
    </>
  );
}
