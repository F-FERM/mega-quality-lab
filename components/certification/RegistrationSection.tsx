"use client";

import Image from "next/image";
import REGISTRATION_BADGE from "../../public/images/accredited-badge.png";


const ROW = { width: 1465, height: 449, gap: 20 };
const CARD = { width: 722, height: 449 };
const INSET = 12;
const INNER = {
  left: INSET,
  top: INSET,
  width: CARD.width - INSET * 2,
  height: CARD.height - INSET * 2,
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

interface RegistrationSectionProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingLine3?: string;
  certificateTitle?: string;
  certificateDescription?: string;
  registrationNo?: string;
  issuedDate?: string;
  validUntilDate?: string;
  ctaLabel?: string;
  ctaHref?: string;
  programName?: string;
  labScope?: string;
  badgeLabel?: string;
}

function RegistrationSection({
  eyebrow = "02 — Registration",
  headingLine1 = "Sharjah Laboratories",
  headingLine2 = "Registration",
  headingLine3 = "Program.",
  certificateTitle = "Certificate No. 14/2025",
  certificateDescription = "Mega Quality Laboratory is registered under the Sharjah Laboratories Registration Program.",
  registrationNo = "No. 14/2025",
  issuedDate = "23 Dec 2025",
  validUntilDate = "22 Dec 2026",
  ctaLabel = "View Full Certificate",
  ctaHref = "#",
  programName = "Sharjah Laboratories Registration Program",
  labScope = "Mega Quality Laboratory for Soil and Building Materials Testing",
  badgeLabel = "Sharjah Municipality",
}: RegistrationSectionProps) {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: `${ROW.width}px` }}>
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
          className="mb-10 font-poppins font-bold uppercase text-black"
          style={{ fontSize: "60px", lineHeight: "112%", letterSpacing: "0px" }}
        >
          {headingLine1}
          <br />
          <span className="text-[#FFA8D9]">{headingLine2}</span>
          <br />
          {headingLine3}
        </h2>

        {/* Row: card + content, exact 1465 x 449 with 20px gap */}
        <div
          className="flex flex-col lg:flex-row"
          style={{ gap: `${ROW.gap}px`, maxWidth: `${ROW.width}px` }}
        >
          {/* Left: registration preview card */}
          <div
            className="relative w-full shrink-0 rounded-[30px] bg-[#FFFCEB]"
            style={{
              maxWidth: `${CARD.width}px`,
              aspectRatio: `${CARD.width} / ${CARD.height}`,
              border: "1px solid #EAE0B8",
              boxShadow: "0px 0px 4px 0px #00000040",
            }}
          >
            <div
              className="absolute flex flex-col items-center justify-center rounded-[24px] bg-[#FFFCEB] text-center"
              style={{
                left: pct(INNER.left, CARD.width),
                top: pct(INNER.top, CARD.height),
                width: pct(INNER.width, CARD.width),
                height: pct(INNER.height, CARD.height),
                border: "1px solid #A9A9A9",
                paddingTop: "16px",
                paddingRight: "21px",
                paddingBottom: "15px",
                paddingLeft: "21px",
              }}
            >
              {/* Spinning registration badge */}
              <div className="relative h-[130px] w-[130px] animate-[spin_16s_linear_infinite] sm:h-[150px] sm:w-[150px]">
                <Image
                  src={REGISTRATION_BADGE}
                  alt={`${badgeLabel} badge`}
                  fill
                  className="object-contain"
                />
              </div>

              <h4
                className="mt-6 font-poppins font-bold uppercase text-black"
                style={{ fontSize: "24px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {programName}
              </h4>

              <p
                className="mt-2 font-poppins font-medium capitalize text-[#929292]"
                style={{ fontSize: "17px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {labScope}
              </p>

              <p
                className="mt-3 font-poppins font-semibold uppercase text-black"
                style={{ fontSize: "20px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateTitle}
              </p>

              <p
                className="mt-1 font-poppins font-medium text-[#929292]"
                style={{ fontSize: "15px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Issued {issuedDate} · Expiry {validUntilDate}
              </p>
            </div>
          </div>

          {/* Right: certificate details */}
          <div className="flex flex-1 flex-col justify-center">
            <h3
              className="mb-4 font-poppins font-bold uppercase text-black"
              style={{ fontSize: "42px", lineHeight: "120%", letterSpacing: "0px" }}
            >
              {certificateTitle}
            </h3>

            <p
              className="mb-8 font-poppins font-medium capitalize text-[#727272]"
              style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
            >
              {certificateDescription}
            </p>

            {/* Divider */}
            <div className="mb-8 border-t border-[#727272]" />

            {/* Stats row */}
            <div className="mb-10 flex flex-wrap items-start gap-x-10 gap-y-6">
              <div className="flex flex-col gap-2">
                <span
                  className="font-poppins font-medium uppercase text-[#474747]"
                  style={{ fontSize: "16px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  Registration Certificate
                </span>
                <span
                  className="font-poppins font-bold uppercase text-black"
                  style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  {registrationNo}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className="font-poppins font-medium uppercase text-[#474747]"
                  style={{ fontSize: "16px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  Issued
                </span>
                <span
                  className="font-poppins font-bold uppercase text-black"
                  style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  {issuedDate}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className="font-poppins font-medium uppercase text-[#474747]"
                  style={{ fontSize: "16px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  Valid Until
                </span>
                <span
                  className="font-poppins font-bold uppercase text-black"
                  style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  {validUntilDate}
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
        </div>
      </div>
    </section>
  );
}

export default RegistrationSection;