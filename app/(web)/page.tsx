import AboutLab from "@/app/components/home/AboutLab";
import GeotechnicalHero from "@/app/components/home/GeoTechnicalHero";
import GetInTouch from "@/app/components/home/GetInTouch";
import Hero from "@/app/components/home/Hero";
import MaterialTesting from "@/app/components/home/MaterialTesting";
import NonDestructiveTesting from "@/app/components/home/NonDestructiveTesting";
import QualitySystem from "@/app/components/home/QualitySystem";
import QualityVerify from "@/app/components/home/QualityVerify";
import TestingProcess from "@/app/components/home/TestingProcess";
import WhatWeTest from "@/app/components/home/WhatWeTest";
import WhyMega from "@/app/components/home/WhyMega";
import Footer from "@/app/components/layout/Footer";
import EhsSection from "@/app/components/home/EhsSection";
import ManagementSection from "@/app/components/home/ManagementSection";
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
