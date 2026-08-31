import AboutLabSecondary from "@/components/about/HeroAbout";
import ProjectEnquirySection from "@/components/contact/ContactForm";
import ContactSection from "@/components/contact/ContactSection";
import EhsSection from "@/components/home/EhsSection";
import ManagementSection from "@/components/home/ManagementSection";
import Footer from "@/components/layout/Footer";
import WhatWeTestBanner from "@/components/services/WhatWeTest";
export default function ContactPage() {
  return (
    <main>
      <ContactSection />
     <ProjectEnquirySection/>
      <Footer/>
    </main>
  );
}
