"use client";

import Image from "next/image";
import CONTACT_IMAGE from "../../../public/images/contact.jpg";

interface ContactSectionProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  dubaiLabel?: string;
  dubaiValue?: string;
  rakLabel?: string;
  rakValue?: string;
  phoneLabel?: string;
  phoneValue?: string;
}

function ContactSection({
  eyebrow = "Contact Mega Quality Laboratory",
  headingLine1 = "Let's Talk About Your",
  headingLine2 = "Project.",
  description = "From soil investigation to construction material testing, connect with our technical team to discuss your project requirements and laboratory testing needs.",
  dubaiLabel = "Dubai",
  dubaiValue = "United Arab Emirates",
  rakLabel = "Ras Al Khaimah",
  rakValue = "United Arab Emirates",
  phoneLabel = "Direct Line",
  phoneValue = "+971 52 652 3220",
}: ContactSectionProps) {
  return (
    <section className="w-full bg-white px-4 pb-16 pt-[110px] sm:px-6 sm:pb-20 sm:pt-[150px] md:pb-24 md:pt-[180px] xl:pb-28 xl:pt-[250px]">
      <div
        className="mx-auto flex w-full flex-col items-start lg:flex-row"
        style={{ maxWidth: "1464px", minHeight: "494px", gap: "20px" }}
      >
        {/* Left column */}
        <div
          className="flex w-full flex-col justify-center"
          style={{ maxWidth: "722px", minHeight: "494px" }}
        >
          <div
            className="flex w-full flex-col"
            style={{ maxWidth: "722px", minHeight: "426px", gap: "26px" }}
          >
            {/* Eyebrow + heading block */}
            <div className="flex flex-col">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-12 bg-[#67003E]" />
                <span
                  className="font-poppins font-normal capitalize text-[#67003E]"
                  style={{ maxWidth: "400px", fontSize: "24px", lineHeight: "100%", letterSpacing: "0px" }}
                >
                  {eyebrow}
                </span>
              </div>

              <h2
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "60px", lineHeight: "112%", letterSpacing: "0px" }}
              >
                {headingLine1}
                <br />
                <span className="text-[#FFA8D9]">{headingLine2}</span>
              </h2>
            </div>

            {/* Description */}
            <p
              className="font-poppins font-medium capitalize text-[#727272]"
              style={{ maxWidth: "733px", fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
            >
              {description}
            </p>

            {/* Location / phone stats — always one line */}
            {/* Location / phone stats — always one line */}
<div className="flex flex-nowrap gap-x-12">
  <div className="flex shrink-0 flex-col" style={{ gap: "10px" }}>
    <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "18px", lineHeight: "100%", letterSpacing: "0px" }}
    >
      {dubaiLabel}
    </span>
    <span
      className="font-poppins font-semibold capitalize text-black"
      style={{
        width: "206px",
        height: "62px",
        fontSize: "26px",
        lineHeight: "120%",
        letterSpacing: "0px",
      }}
    >
      {dubaiValue}
    </span>
  </div>

  <div className="flex shrink-0 flex-col" style={{ gap: "10px" }}>
     <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "18px", lineHeight: "100%", letterSpacing: "0px" }}
    >
      {rakLabel}
    </span>
    <span
      className="font-poppins font-semibold capitalize text-black"
      style={{
        width: "206px",
        height: "62px",
        fontSize: "26px",
        lineHeight: "120%",
        letterSpacing: "0px",
      }}
    >
      {rakValue}
    </span>
  </div>

  <div className="flex shrink-0 flex-col" style={{ gap: "10px" }}>
     <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "18px", lineHeight: "100%", letterSpacing: "0px" }}
    >
      {phoneLabel}
    </span>
    
    <span
      className="font-poppins font-semibold capitalize text-black whitespace-nowrap"
      style={{ fontSize: "26px", lineHeight: "120%", letterSpacing: "0px" }}
    >
      {phoneValue}
    </span>
  </div>
</div>
          </div>
        </div>

        {/* Right column — image, explicit 722 x 494 */}
        <div className="relative w-full shrink-0" style={{ maxWidth: "722px" }}>
          <div
            className="relative w-full overflow-hidden rounded-[30px]"
            style={{ width: "100%", maxWidth: "722px", height: "494px" }}
          >
            <Image
              src={CONTACT_IMAGE}
              alt="Technical team member on a call"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 722px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
