"use client";

import Image from "next/image";
import ACCREDITED_BADGE from "../../../public/images/accredited-badge.png";

/**
 * Mini certificate preview card — matches the CertificationCard treatment,
 * using explicit start/end coordinates instead of padding utilities:
 *
 *   OUTER frame: start (0, 0)   → end (722, 449)   size 722 x 449
 *                border 1px solid #EAE0B8, shadow 0px 0px 4px #00000040
 *
 *   INNER card:  start (12, 12) → end (710, 437)   size 698 x 425
 *                border 1px solid #A9A9A9, border-radius 24
 */
const OUTER = { width: 722, height: 449 };
const INSET = 12;
const INNER = {
  left: INSET,
  top: INSET,
  width: OUTER.width - INSET * 2,
  height: OUTER.height - INSET * 2,
};

const cardPct = (value: number, total: number) => `${(value / total) * 100}%`;

interface AccreditationSectionProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  standard?: string;
  standardDescription?: string;
  certificateNo?: string;
  initialDate?: string;
  validDate?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sideDescription?: string;
  labName?: string;
  labScope?: string;
}

function AccreditationSection({
  eyebrow = "01  EIAC Accreditation",
  headingLine1 = "Accredited For",
  headingLine2 = "Confidence.",
  standard = "ISO/IEC 17025:2017",
  standardDescription = "The supplied accreditation documentation identifies certificate LB-TEST-271 and states validity from 19 February 2025 to 18 February 2028.",
  certificateNo = "LB-TEST-271",
  initialDate = "19 Feb 2025",
  validDate = "18 Feb 2028",
  ctaLabel = "View Full Certificate",
  ctaHref = "#",
  sideDescription = "Mega Quality Laboratory for Soil and Building Materials Testing is accredited by the Emirates International Accreditation Centre in accordance with ISO/IEC 17025:2017 for activities within its accredited scope.",
  labName = "Mega Quality Laboratory",
  labScope = "Soil and Building Materials Testing",
}: AccreditationSectionProps) {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: "1465px" }}>
      <div className="mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-5">
        {/* Left column */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize text-[#67003E]"
              style={{ fontSize: "24px", lineHeight: "100%", letterSpacing: "0px" }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-8 font-poppins font-bold uppercase text-black"
            style={{
              maxWidth: "725px",
              fontSize: "60px",
              lineHeight: "112%",
              letterSpacing: "0px",
            }}
          >
            {headingLine1}
            <br />
            <span className="text-[#FFA8D9]">{headingLine2}</span>
          </h2>

          {/* Standard */}
          <h3
            className="mb-4 font-poppins font-bold uppercase text-black"
            style={{ maxWidth: "724px", fontSize: "42px", lineHeight: "120%", letterSpacing: "0px" }}
          >
            {standard}
          </h3>

          <p
            className="mb-8 font-poppins font-medium capitalize text-[#727272]"
            style={{ maxWidth: "724px", fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
          >
            {standardDescription}
          </p>

          {/* Divider */}
          <div
            className="mb-8 border-t border-[#727272]"
            style={{ maxWidth: "724px" }}
          />

          {/* Stats row */}
          <div className="mb-10 flex flex-wrap items-start gap-x-[142px] gap-y-6">
            <div className="flex flex-col gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#474747]"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Certificate
              </span>
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "24px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNo}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#474747]"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Initial Date
              </span>
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "24px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {initialDate}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#474747]"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Valid Until
              </span>
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "24px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {validDate}
              </span>
            </div>
          </div>

          {/* CTA button */}
          <a
            href={ctaHref}
            className="inline-flex w-fit items-center justify-center gap-[10px] rounded-[20px] bg-[#67003E] text-white transition-opacity hover:opacity-90"
            style={{
              paddingTop: "15px",
              paddingRight: "42px",
              paddingBottom: "16px",
              paddingLeft: "42px",
            }}
          >
            <span
              className="font-poppins font-medium uppercase"
              style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
            >
              {ctaLabel}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          <p
            className="mb-10 font-poppins font-medium capitalize text-[#727272]"
            style={{ maxWidth: "741px", fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
          >
            {sideDescription}
          </p>

          {/* Mini certificate preview card — outer tan frame + inner filled card,
              positioned via explicit start/end coordinates (see constants above). */}
          <div
            className="relative w-full rounded-[30px] bg-[#FFFCEB]"
            style={{
              maxWidth: `${OUTER.width}px`,
              aspectRatio: `${OUTER.width} / ${OUTER.height}`,
              border: "1px solid #EAE0B8",
              boxShadow: "0px 0px 4px 0px #00000040",
            }}
          >
            <div
              className="absolute flex flex-col items-center justify-center rounded-[24px] bg-[#FFFCEB] text-center"
              style={{
                left: cardPct(INNER.left, OUTER.width),
                top: cardPct(INNER.top, OUTER.height),
                width: cardPct(INNER.width, OUTER.width),
                height: cardPct(INNER.height, OUTER.height),
                border: "1px solid #A9A9A9",
                padding: "16px 21px",
              }}
            >
              {/* Spinning accredited badge */}
              <div className="relative h-[140px] w-[140px] animate-[spin_16s_linear_infinite]">
                <Image
                  src={ACCREDITED_BADGE}
                  alt="EIAC Accredited badge"
                  fill
                  className="object-contain"
                />
              </div>

              <h4
                className="mt-6 font-poppins font-bold uppercase text-black"
                style={{ fontSize: "26px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {labName}
              </h4>

              <p
                className="mt-2 font-poppins font-medium capitalize text-[#929292]"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {labScope}
              </p>

              <p
                className="mt-2 font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "16px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {standard}
              </p>

              <p
                className="mt-3 font-poppins font-semibold uppercase text-black"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNo}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default AccreditationSection;
