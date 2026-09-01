import AboutLabSecondary from "@/app/components/about/HeroAbout";
import EhsSection from "@/app/components/home/EhsSection";
import ManagementSection from "@/app/components/home/ManagementSection";
import Footer from "@/app/components/layout/Footer";
import HeroProject from "@/app/components/projects/Hero";
import ProjectOverlayCards from "@/app/components/projects/Projects";
import ServiceOverlayCards from "@/app/components/services/Services";
import WhatWeTestBanner from "@/app/components/services/WhatWeTest";
export default function AboutPage() {
  return (
    <main>
      <HeroProject />
     <ProjectOverlayCards/>
     
    </main>
  );
}
