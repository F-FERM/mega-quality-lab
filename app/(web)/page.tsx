import AboutLab from "@/components/home/AboutLab";
import GeotechnicalHero from "@/components/home/GeoTechnicalHero";
import GetInTouch from "@/components/home/GetInTouch";
import Hero from "@/components/home/Hero";
import MaterialTesting from "@/components/home/MaterialTesting";
import NonDestructiveTesting from "@/components/home/NonDestructiveTesting";
import QualitySystem from "@/components/home/QualitySystem";
import QualityVerify from "@/components/home/QualityVerify";
import TestingProcess from "@/components/home/TestingProcess";
import WhatWeTest from "@/components/home/WhatWeTest";
import WhyMega from "@/components/home/WhyMega";
import Footer from "@/components/layout/Footer";
import EhsSection from "@/components/home/EhsSection";
import ManagementSection from "@/components/home/ManagementSection";
export default function HomePage() {
  return (
    <main>
      <Hero />
      <QualityVerify />
      <AboutLab />
      <WhatWeTest/>
      <GeotechnicalHero/>
      <NonDestructiveTesting/>
      <MaterialTesting/>
      <QualitySystem/>
      <TestingProcess/>
      <WhyMega/>
      <EhsSection/>
      <ManagementSection/>
      <GetInTouch/>
      <Footer/>
    </main>
  );
}
