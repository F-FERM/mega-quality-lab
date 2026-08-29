"use client";

import Image from "next/image";
import BANNER_BG from "../../public/images/servicehero.jpg";

function WhatWeTestBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[420px] w-full sm:h-[480px] md:h-[560px]">
        <Image
          src={BANNER_BG}
          alt="Inspecting documents with a magnifying glass"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-[963px] flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
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
              What We Test
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
            Our Testing & Investigation{" "}
            <span className="text-[#FFA8D9]">Services</span>
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
            Six Core Disciplines Covering The Full Lifecycle Of
            Construction Materials — From Raw Aggregate To Finished
            Structure.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatWeTestBanner;