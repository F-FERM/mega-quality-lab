"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import ACCREDITED_BADGE from "../../../public/images/certificationbadge1.png";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface AccreditationData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  badgeLabel: string;
  certificateNumber: string;
  certificateTitle: string;
  accreditationValidity: string;
  validityLabel: string;
  accreditationCenter: string;
  centerCertificateNumber: string;
  accreditedLabel: string;
  standardTitle: string;
  standardDescription: string;
  certificateNumberLabel: string;
  initialDate: string;
  validDate: string;
  initialDateLabel: string;
  validDateLabel: string;
  accreditationInlineLinks: InlineLink[];
  isActive: boolean;
}

// ================= FALLBACK =================

const defaultData: AccreditationData = {
  sectionTitle: "Accreditation & Certification",
  heroTitle: "PROVEN",
  heroTitleTwo: "QUALITY.",
  heroTitleThree: "RECOGNIZED STANDARDS.",
  heroDescription: "Mega Quality Laboratory Operates Within Recognized Accreditation And Registration Frameworks, Supporting Confidence In The Competence, Integrity And Quality Of Its Testing Activities.",
  heroImage: "",
  heroImageAlt: "Accreditation & Certification - Proven Quality",
  heroInlineLinks: [],
  badgeLabel: "CERTIFIED",
  certificateNumber: "LB-TEST-271",
  certificateTitle: "EIAC CERTIFICATE",
  accreditationValidity: "2028",
  validityLabel: "ACCREDITATION VALIDITY",
  accreditationCenter: "EMIRATES INTERNATIONAL ACCREDITATION CENTRE",
  centerCertificateNumber: "LB-TEST-271",
  accreditedLabel: "EIAC ACCREDITED",
  standardTitle: "ISO/IEC 17025:2017",
  standardDescription: "General Requirements For The Competence Of Testing And Calibration Laboratories",
  certificateNumberLabel: "CERTIFICATE NO. LB-TEST-271",
  initialDate: "19.02.2025",
  validDate: "18.02.2028",
  initialDateLabel: "INITIAL:",
  validDateLabel: "VALID:",
  accreditationInlineLinks: [],
  isActive: true,
};

const BOUNDS = { width: 1484, height: 817 };
const MAIN = { left: 0, top: 108, width: 1464, height: 709 };
const RIBBON = { left: 817, top: 0, width: 667, height: 156 };

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

// ================= SKELETON =================

function CertificationCardSkeleton() {
  return (
    <div className="flex justify-center px-4 py-10 sm:px-6">
      {/* Desktop/tablet skeleton — mirrors the fixed-ratio layout */}
      <div
        className="relative hidden w-full animate-pulse lg:block"
        style={{
          maxWidth: `${BOUNDS.width}px`,
          aspectRatio: `${BOUNDS.width} / ${BOUNDS.height}`,
        }}
      >
        <div
          className="absolute rounded-[30px] bg-gray-200"
          style={{
            left: pct(MAIN.left, BOUNDS.width),
            top: pct(MAIN.top, BOUNDS.height),
            width: pct(MAIN.width, BOUNDS.width),
            height: pct(MAIN.height, BOUNDS.height),
          }}
        />
        <div
          className="absolute rounded-[30px] bg-gray-300"
          style={{
            left: pct(RIBBON.left, BOUNDS.width),
            top: pct(RIBBON.top, BOUNDS.height),
            width: pct(RIBBON.width, BOUNDS.width),
            height: pct(RIBBON.height, BOUNDS.height),
          }}
        />
      </div>

      {/* Mobile/tablet skeleton — natural flow, no forced aspect ratio */}
      <div className="flex w-full max-w-[578px] animate-pulse flex-col gap-4 lg:hidden">
        <div className="h-24 w-full rounded-[24px] bg-gray-300 sm:h-28" />
        <div className="h-72 w-full rounded-[24px] bg-gray-200 sm:h-80" />
      </div>
    </div>
  );
}

// ================= MAIN =================

function CertificationCard() {
  const [data, setData] = useState<AccreditationData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/accreditation-certification");
        const raw = res.data;

        let responseData: any = null;
        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          setData({
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroTitleThree: responseData.heroTitleThree || defaultData.heroTitleThree,
            heroDescription: responseData.heroDescription || defaultData.heroDescription,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            badgeLabel: responseData.badgeLabel || defaultData.badgeLabel,
            certificateNumber: responseData.certificateNumber || defaultData.certificateNumber,
            certificateTitle: responseData.certificateTitle || defaultData.certificateTitle,
            accreditationValidity: responseData.accreditationValidity || defaultData.accreditationValidity,
            validityLabel: responseData.validityLabel || defaultData.validityLabel,
            accreditationCenter: responseData.accreditationCenter || defaultData.accreditationCenter,
            centerCertificateNumber: responseData.centerCertificateNumber || defaultData.centerCertificateNumber,
            accreditedLabel: responseData.accreditedLabel || defaultData.accreditedLabel,
            standardTitle: responseData.standardTitle || defaultData.standardTitle,
            standardDescription: responseData.standardDescription || defaultData.standardDescription,
            certificateNumberLabel: responseData.certificateNumberLabel || defaultData.certificateNumberLabel,
            initialDate: responseData.initialDate || defaultData.initialDate,
            validDate: responseData.validDate || defaultData.validDate,
            initialDateLabel: responseData.initialDateLabel || defaultData.initialDateLabel,
            validDateLabel: responseData.validDateLabel || defaultData.validDateLabel,
            accreditationInlineLinks: responseData.accreditationInlineLinks || [],
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Accreditation & Certification:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <CertificationCardSkeleton />;
  }

  const {
    accreditationCenter,
    certificateNumber,
    standardTitle,
    standardDescription,
    initialDate,
    validDate,
    accreditationValidity,
    certificateTitle,
    certificateNumberLabel,
    initialDateLabel,
    validDateLabel,
    validityLabel,
    accreditedLabel,
  } = data;

  return (
    <div className="flex justify-center px-4 py-10 sm:px-6">
      {/* ============================================================ */}
      {/* DESKTOP / LARGE TABLET (lg and up) — original layout, unchanged */}
      {/* ============================================================ */}
      <div
        className="relative hidden w-full lg:block"
        style={{
          maxWidth: `${BOUNDS.width}px`,
          aspectRatio: `${BOUNDS.width} / ${BOUNDS.height}`,
        }}
      >
        {/* Outer thin frame + inner filled card */}
        <div
          className="absolute rounded-[30px] bg-[#FFFCEB] border shadow-md p-3 sm:p-4"
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
              paddingTop: "clamp(20px, 2.5vw, 34px)",
              paddingRight: "clamp(20px, 3.5vw, 47px)",
              paddingBottom: "clamp(20px, 2.5vw, 33px)",
              paddingLeft: "clamp(20px, 3.5vw, 48px)",
            }}
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(14px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {accreditationCenter}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(14px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNumber}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {/* Accredited badge — imported image, spinning continuously */}
              <div className="relative h-[150px] w-[150px] animate-[spin_16s_linear_infinite] sm:h-[190px] sm:w-[190px] md:h-[210px] md:w-[210px]">
                <Image
                  src={ACCREDITED_BADGE}
                  alt={accreditedLabel || "EIAC Accredited badge"}
                  fill
                  className="object-contain"
                />
              </div>

              <h3
                className="mt-4 sm:mt-6 md:mt-8 font-poppins font-bold uppercase text-black"
                style={{ fontSize: "clamp(24px, 3vw, 42px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {standardTitle}
              </h3>

              <p
                className="mt-2 max-w-2xl font-poppins font-medium capitalize text-[#929292] sm:mt-3 md:mt-4"
                style={{ fontSize: "clamp(14px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {standardDescription}
              </p>

              <p
                className="mt-3 font-poppins font-semibold capitalize text-[#363636] sm:mt-4 md:mt-6"
                style={{ fontSize: "clamp(14px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNumberLabel || `Certificate No. ${certificateNumber}`}
              </p>
            </div>

            {/* Footer row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(12px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {initialDateLabel || "Initial:"} {initialDate}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(12px, 1.5vw, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {validDateLabel || "Valid:"} {validDate}
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
            paddingTop: "clamp(20px, 3.5vw, 46px)",
            paddingRight: "clamp(20px, 3.5vw, 47px)",
            paddingBottom: "clamp(20px, 3.5vw, 46px)",
            paddingLeft: "clamp(20px, 3.5vw, 47px)",
          }}
        >
          <div className="flex w-full max-w-[578px] flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-[108px]">
            <div className="flex flex-col items-center sm:items-start">
              <span
                className="font-poppins font-bold uppercase text-black text-center sm:text-left"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateNumber}
              </span>
              <span
                className="font-poppins font-medium uppercase text-black text-center sm:text-left"
                style={{ fontSize: "clamp(12px, 1.2vw, 18px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {certificateTitle || "EIAC CERTIFICATE"}
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <span
                className="font-poppins font-bold uppercase text-black text-center sm:text-left"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {accreditationValidity}
              </span>
              <span
                className="font-poppins font-medium uppercase text-black text-center sm:text-left"
                style={{ fontSize: "clamp(12px, 1.2vw, 18px)", lineHeight: "120%", letterSpacing: "0px" }}
              >
                {validityLabel || "ACCREDITATION VALIDITY"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE / TABLET (below lg) — same colors, type, badge image,  */}
      {/* and copy, but natural document flow instead of a fixed-ratio  */}
      {/* overlap, so nothing clips as the screen narrows.              */}
      {/* ============================================================ */}
      <div className="flex w-full max-w-[578px] flex-col gap-4 lg:hidden">
        {/* Pink ribbon — now a normal block above the card instead of an
            absolutely-positioned overlap (that overlap math only works
            once the container is wide enough for the ratio to hold). */}
        <div
          className="flex w-full flex-col items-center justify-center gap-4 rounded-[24px] px-5 py-5 sm:flex-row sm:gap-10 sm:px-8 sm:py-6"
          style={{ background: "#FFA7DC73" }}
        >
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-poppins text-xl font-bold uppercase text-black text-center sm:text-left sm:text-2xl">
              {certificateNumber}
            </span>
            <span className="font-poppins text-xs font-medium uppercase text-black text-center sm:text-left sm:text-sm">
              {certificateTitle || "EIAC CERTIFICATE"}
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="font-poppins text-xl font-bold uppercase text-black text-center sm:text-left sm:text-2xl">
              {accreditationValidity}
            </span>
            <span className="font-poppins text-xs font-medium uppercase text-black text-center sm:text-left sm:text-sm">
              {validityLabel || "ACCREDITATION VALIDITY"}
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="w-full rounded-[30px] border bg-[#FFFCEB] p-3 shadow-md sm:p-4">
          <div className="flex w-full flex-col rounded-[24px] border border-[#A9A9A9] bg-[#FFFCEB] px-5 py-6 sm:px-8 sm:py-8">
            {/* Header row */}
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-left">
              <span className="font-poppins text-xs font-medium uppercase text-[#929292] sm:text-sm">
                {accreditationCenter}
              </span>
              <span className="font-poppins text-xs font-medium uppercase text-[#929292] sm:text-sm">
                {certificateNumber}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <div className="relative h-[130px] w-[130px] animate-[spin_16s_linear_infinite] sm:h-[170px] sm:w-[170px]">
                <Image
                  src={ACCREDITED_BADGE}
                  alt={accreditedLabel || "EIAC Accredited badge"}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="mt-6 font-poppins text-xl font-bold uppercase text-black sm:text-2xl">
                {standardTitle}
              </h3>

              <p className="mt-3 max-w-md font-poppins text-sm font-medium capitalize text-[#929292] sm:text-base">
                {standardDescription}
              </p>

              <p className="mt-3 font-poppins text-sm font-semibold capitalize text-[#363636] sm:text-base">
                {certificateNumberLabel || `Certificate No. ${certificateNumber}`}
              </p>
            </div>

            {/* Footer row */}
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-left">
              <span className="font-poppins text-xs font-medium uppercase text-[#929292]">
                {initialDateLabel || "Initial:"} {initialDate}
              </span>
              <span className="font-poppins text-xs font-medium uppercase text-[#929292]">
                {validDateLabel || "Valid:"} {validDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificationCard;