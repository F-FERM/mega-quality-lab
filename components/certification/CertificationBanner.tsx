"use client";

import Image from "next/image";
import BANNER_BG from "../../public/images/certificationbanner.jpg";

function CertificationBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image fills the full section */}
      <div className="absolute inset-0">
        <Image
          src={BANNER_BG}
          alt="Inspecting documents with a magnifying glass"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Overlay + content — exact spec box: 1920x756 with asymmetric padding */}
      <div
        className="relative mx-auto flex w-full flex-col items-center justify-center text-center"
        style={{
          maxWidth: "1920px",
          minHeight: "756px",
          paddingTop: "246px",
          paddingRight: "478px",
          paddingBottom: "228px",
          paddingLeft: "479px",
          gap: "10px",
          background: "#00000080",
        }}
      >
        <div className="flex w-full max-w-[963px] flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize"
              style={{
                fontSize: "24px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#67003E",
              }}
            >
              Accreditation & Certification
            </span>
            <span className="h-px w-8 bg-[#67003E]" />
          </div>

          {/* Heading */}
          <h2
            className="mb-6 font-poppins font-bold uppercase text-white"
            style={{
              width: "963px",
              maxWidth: "100%",
              fontSize: "60px",
              lineHeight: "112%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
          >
            Proven <span className="text-[#FFA8D9]">quality</span>. Recognized
            standards.
          </h2>

          {/* Sub copy */}
          <p
            className="font-poppins font-medium capitalize"
            style={{
              fontSize: "22px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#E8E8E8",
              textAlign: "center",
            }}
          >
            Mega Quality Laboratory operates within recognized accreditation
            and registration frameworks, supporting confidence in the
            competence, integrity and quality of its testing activities
          </p>
        </div>
      </div>
    </section>
  );
}

export default CertificationBanner;