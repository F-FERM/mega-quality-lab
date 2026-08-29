import Navbar from "@/components/layout/Navbar";


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
      {/* <FooterDarkSection /> */}
    </>
  );
}
