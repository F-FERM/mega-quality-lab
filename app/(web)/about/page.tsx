import AboutLabSecondary from "@/app/components/about/HeroAbout";
import EhsSection from "@/app/components/home/EhsSection";
import ManagementSection from "@/app/components/home/ManagementSection";
import Footer from "@/app/components/layout/Footer";
export default function AboutPage() {
  return (
    <main>
      <AboutLabSecondary />
     <EhsSection/>
      <ManagementSection/>
      <Footer/>
    </main>
  );
}
