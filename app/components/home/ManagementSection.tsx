"use client";

import Image from "next/image";
import MANAGER_IMG from "../../../public/images/equipment3.jpg";

function ManagementSection() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div
  className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center lg:grid-cols-[574px_1fr]"
  style={{ gap: "20px" }}
>
  {/* =====================================================
      LEFT — Photo card with overlay
      width: 574, height: 587, rounded-30
  ====================================================== */}
  <div
    className="relative w-full overflow-hidden rounded-[30px]"
    style={{
      maxWidth: "574px",
      height: "587px",
    }}
  >
    <Image
      src={MANAGER_IMG}
      alt="Abdullah Mohammad, Managing Director"
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 90vw, 574px"
    />

    {/* Bottom info bar — pinned flush to the card's bottom edge */}
    <div className="absolute inset-x-0 bottom-0 bg-[#7D7D7D] px-6 py-5 sm:px-8 sm:py-6">
      <span
        className="mb-1 block font-poppins font-semibold uppercase"
        style={{
          fontSize: "14px",
          lineHeight: "100%",
          letterSpacing: "0.5px",
          color: "#67003E",
        }}
      >
        Managing Director
      </span>
      <span
        className="block font-poppins font-bold uppercase text-white"
        style={{
          fontSize: "26px",
          lineHeight: "120%",
          letterSpacing: "0px",
        }}
      >
        Abdullah Mohammad
      </span>
    </div>
  </div>

  {/* =====================================================
      RIGHT — Content
  ====================================================== */}
  <div className="flex w-full flex-col">
    {/* Eyebrow */}
    <div className="mb-3 flex items-center gap-3">
      <span className="h-px w-8 bg-[#67003E]" />
      <span
        className="font-poppins font-normal capitalize"
        style={{
          fontSize: "24px",
          lineHeight: "100%",
          letterSpacing: "0px",
          color: "#67003E",
        }}
      >
        Management
      </span>
    </div>

    {/* Heading */}
    <h2
      className="
        mb-2
        font-poppins
        font-bold
        uppercase
        leading-[112%]
        text-black
        text-[32px]
        sm:text-[40px]
        md:text-[48px]
        xl:text-[60px]
      "
      style={{ letterSpacing: "0px" }}
    >
      Experienced <span className="text-[#FFA8D9]">People.</span>
      <br />
      Reliable Results.
    </h2>

    {/* Bio paragraph */}
    <p
      className="mb-2 font-poppins font-medium capitalize"
      style={{
        fontSize: "22px",
        lineHeight: "120%",
        letterSpacing: "0px",
        color: "#727272",
      }}
    >
      Abdullah Mohammad Has Over 10 Years Of Experience In
      Geotechnical And Materials Testing Laboratory Operations,
      Including Quality-Control Activities Under ISO 17025:2017 And
      Management Of Major Projects In Dubai And Abu Dhabi.
    </p>

    {/* Note */}
    <p
      className="font-poppins font-medium capitalize"
      style={{
        fontSize: "18px",
        lineHeight: "120%",
        letterSpacing: "0px",
        color: "#727272",
      }}
    >
      Additional Technical Personnel Profiles Available On Request.
    </p>
  </div>
</div>
    </section>
  );
}

export default ManagementSection;
