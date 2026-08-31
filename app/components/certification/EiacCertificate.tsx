"use client";

import Image from "next/image";
import ACCREDITED_BADGE from "../../../public/images/accredited-badge.png";

const BOUNDS = { width: 1484, height: 817 };
const MAIN = { left: 0, top: 108, width: 1464, height: 709 };
const RIBBON = { left: 817, top: 0, width: 667, height: 156 };

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

interface CertificationCardProps {
  issuer?: string;
  certificateNo?: string;
  standard?: string;
  standardDescription?: string;
  initialDate?: string;
  validDate?: string;
  validityYear?: string;
}

function CertificationCard({
  issuer = "Emirates International Accreditation Centre",
  certificateNo = "LB-TEST-271",
  standard = "ISO/IEC 17025:2017",
  standardDescription = "General requirements for the competence of testing and calibration laboratories",
  initialDate = "19.02.2025",
  validDate = "18.02.2028",
  validityYear = "2028",
}: CertificationCardProps) {
  return (
    <div className="flex justify-center px-4 py-10 sm:px-6">
      <div
        className="relative w-full"
        style={{
          maxWidth: `${BOUNDS.width}px`,
          aspectRatio: `${BOUNDS.width} / ${BOUNDS.height}`,
        }}
      >
        {/* Outer thin frame + inner filled card */}
        <div
          className="absolute rounded-[30px] bg-[#FFFCEB]  border shadow-md p-3 sm:p-4"
          style={{
            left: pct(MAIN.left, BOUNDS.width),
            top: pct(MAIN.top, BOUNDS.height),
            width: pct(MAIN.width, BOUNDS.width),
            height: pct(MAIN.height, BOUNDS.height),
          }}
        >
          <div
            className="relative flex h-full w-full flex-col rounded-[24px] border border-[#A9A9A9] bg-[#FFFCEB]"
            style={{
              paddingTop: "34px",
              paddingRight: "47px",
              paddingBottom: "33px",
              paddingLeft: "48px",
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {issuer}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNo}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {/* Accredited badge — imported image, spinning continuously */}
              <div className="relative h-[190px] w-[190px] animate-[spin_16s_linear_infinite] sm:h-[210px] sm:w-[210px]">
                <Image
                  src={ACCREDITED_BADGE}
                  alt="EIAC Accredited badge"
                  fill
                  className="object-contain"
                />
              </div>

              <h3
                className="mt-8 font-poppins font-bold uppercase text-black"
                style={{ fontSize: "42px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {standard}
              </h3>

              <p
                className="mt-4 max-w-2xl font-poppins font-medium capitalize text-[#929292]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {standardDescription}
              </p>

              <p
                className="mt-6 font-poppins font-semibold capitalize text-[#363636]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Certificate No. {certificateNo}
              </p>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Initial: {initialDate}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "22px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Valid: {validDate}
              </span>
            </div>
          </div>
        </div>

        {/* Floating pink ribbon — exact Figma placement */}
        <div
          className="absolute flex items-center rounded-[30px]"
          style={{
            left: pct(RIBBON.left, BOUNDS.width),
            top: pct(RIBBON.top, BOUNDS.height),
            width: pct(RIBBON.width, BOUNDS.width),
            height: pct(RIBBON.height, BOUNDS.height),
            background: "#FFA7DC73",
            border: "1px solid transparent",
            paddingTop: "46px",
            paddingRight: "47px",
            paddingBottom: "46px",
            paddingLeft: "47px",
          }}
        >
          <div className="flex w-full max-w-[578px] items-center gap-[108px]">
            <div className="flex flex-col">
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "30px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNo}
              </span>
              <span
                className="font-poppins font-medium uppercase text-black"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                EIAC Certificate
              </span>
            </div>

            <div className="flex flex-col">
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "30px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {validityYear}
              </span>
              <span
                className="font-poppins font-medium uppercase text-black"
                style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
              >
                Accreditation Validity
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificationCard;
