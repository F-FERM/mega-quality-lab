import AccreditationSection from "@/components/certification/AccrediationSection";
import CertificationBanner from "@/components/certification/CertificationBanner";
import CertificationCard from "@/components/certification/EiacCertificate";
import RegistrationSection from "@/components/certification/RegistrationSection";
import Footer from "@/components/layout/Footer";
export default function CertificationPage() {
  return (
    <main>
      <CertificationBanner />
      <CertificationCard/>
     <AccreditationSection/>
     <RegistrationSection/>
      <Footer/>
    </main>
  );
}
