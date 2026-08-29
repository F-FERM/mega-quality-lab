"use client";

import Image from "next/image";
import ABOUT_IMG from "../../public/images/lab1.jpg";

function AboutLabSecondary() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div
        className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center lg:grid-cols-2"
        style={{ gap: "20px" }}
      >
        {/* =====================================================
            LEFT — Content
        ====================================================== */}
        <div className="flex w-full flex-col">
          {/* Eyebrow */}
         {/* Eyebrow */}
<div
  className="mb-6 flex items-center"
  style={{ width: "340px", height: "36px", gap: "10px" }}
>
  <span className="h-px w-8 shrink-0 bg-[#67003E]" />
  <span
    className="font-poppins font-normal capitalize"
    style={{
      fontSize: "24px",
      lineHeight: "100%",
      letterSpacing: "0px",
      color: "#67003E",
    }}
  >
    About The Laboratory
  </span>
</div>

          {/* Heading */}
          <h2
            className="mb-6 font-poppins font-bold text-black"
            style={{
              width: "722px",
              maxWidth: "100%",
              fontSize: "70px",
              lineHeight: "98px",
              letterSpacing: "-0.96px",
            }}
          >
            Testing that
            <br />
            <span className="text-[#FFA8D9]">Supports Better</span>
            <br />
            Construction
          </h2>

          {/* Paragraph */}
          <p
            className="font-poppins font-normal"
            style={{
              width: "722px",
              maxWidth: "100%",
              fontSize: "22px",
              lineHeight: "28px",
              letterSpacing: "0px",
              color: "#45464D",
            }}
          >
            Mega Quality Laboratory for Soil and Building Materials Testing
            is a professionally competent and independent laboratory
            serving construction and infrastructure requirements in the
            UAE.
          </p>
        </div>

        {/* =====================================================
            RIGHT — Image
        ====================================================== */}
        <div className="relative w-full">
          <div className="relative aspect-[930/610] w-full overflow-hidden rounded-[24px]">
            <Image
              src={ABOUT_IMG}
              alt="Reviewing construction blueprints on site"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutLabSecondary;