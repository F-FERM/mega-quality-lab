"use client";

import Image from "next/image";
import ICON_INDEPENDENT from "../../../public/images/why1.png";
import ICON_ACCREDITED from "../../../public/images/why2.png";
import ICON_EXPERTISE from "../../../public/images/why3.png";
import ICON_WIDE from "../../../public/images/why4.png";
import ICON_CONFIDENTIAL from "../../../public/images/why5.png";

const FEATURES = [
  { title: "Independent Testing", icon: ICON_INDEPENDENT },
  { title: "Accredited Quality System", icon: ICON_ACCREDITED },
  { title: "Technical Expertise", icon: ICON_EXPERTISE },
  { title: "Wide Testing Capability", icon: ICON_WIDE },
  { title: "Confidential & Impartial", icon: ICON_CONFIDENTIAL },
];

function WhyMega() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
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
            Why Mega
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-14
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
          style={{
            letterSpacing: "0px",
            width: "863px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          Why Engineering Teams Choose{" "}
          <span className="text-[#FFA8D9]">Mega</span>
        </h2>

        {/* Cards */}
        <div
          className="mx-auto flex justify-between"
          style={{
            width: "1464px",
            maxWidth: "100%",
            height: "196px",
            opacity: 1,
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex shrink-0 flex-col  rounded-[30px] border border-[#E4E4E4] bg-white"
              style={{
                width: "286px",
                height: "196px",
                paddingTop: "45px",
                paddingRight: "33px",
                paddingBottom: "45px",
                paddingLeft: "33px",
                gap: "10px",
              }}
            >
              {/* Icon */}
              <div
                className="relative flex shrink-0 items-center justify-center rounded-full border border-dashed border-[#D4A017]"
                style={{
                  width: "63px",
                  height: "63px",
                  
                  borderWidth: "1px",
                }}
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="rounded-full object-contain "
                  sizes="63px"
                />
              </div>

              {/* Title */}
              <h3
                className="font-poppins font-semibold uppercase text-black mt-2 "
                style={{
                  fontSize: "16px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyMega;
