import AboutLabSecondary from "@/components/about/HeroAbout";
import EhsSection from "@/components/home/EhsSection";
import ManagementSection from "@/components/home/ManagementSection";
import Footer from "@/components/layout/Footer";
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
