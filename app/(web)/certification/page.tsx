import AccreditationSection from "@/app/components/certification/AccrediationSection";
import CertificationBanner from "@/app/components/certification/CertificationBanner";
import CertificationCard from "@/app/components/certification/EiacCertificate";
import RegistrationSection from "@/app/components/certification/RegistrationSection";
import Footer from "@/app/components/layout/Footer";
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
