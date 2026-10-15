import AboutLab from "@/app/components/home/AboutLab";
import EhsSection from "@/app/components/home/EhsSection";
import GeotechnicalHero from "@/app/components/home/GeoTechnicalHero";
import GetInTouch from "@/app/components/home/GetInTouch";
import Hero from "@/app/components/home/Hero";
import ManagementSection from "@/app/components/home/ManagementSection";
import MaterialTesting from "@/app/components/home/MaterialTesting";
import NonDestructiveTesting from "@/app/components/home/NonDestructiveTesting";
import QualitySystem from "@/app/components/home/QualitySystem";
import QualityVerify from "@/app/components/home/QualityVerify";
import TestingProcess from "@/app/components/home/TestingProcess";
import WhatWeTest from "@/app/components/home/WhatWeTest";
import WhyMega from "@/app/components/home/WhyMega";
import AnimateOnScroll from "@/app/components/common/AnimateOnScroll";

export default function HomePage() {
  return (
    <main>
      {/* Hero animates immediately on load */}
      <AnimateOnScroll duration={800} translateY={60} threshold={0}>
        <Hero />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <QualityVerify />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <AboutLab />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <WhatWeTest />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <GeotechnicalHero />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <NonDestructiveTesting />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <MaterialTesting />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <QualitySystem />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <EhsSection />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <ManagementSection />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <TestingProcess />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <WhyMega />
      </AnimateOnScroll>

      <AnimateOnScroll duration={700} translateY={50}>
        <GetInTouch />
      </AnimateOnScroll>
    </main>
  );
}

