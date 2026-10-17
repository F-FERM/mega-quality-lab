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
  heroDescription:
    "Mega Quality Laboratory Operates Within Recognized Accreditation And Registration Frameworks, Supporting Confidence In The Competence, Integrity And Quality Of Its Testing Activities.",
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
  standardDescription:
    "General Requirements For The Competence Of Testing And Calibration Laboratories",
  certificateNumberLabel: "CERTIFICATE NO. LB-TEST-271",
  initialDate: "19.02.2025",
  validDate: "18.02.2028",
  initialDateLabel: "INITIAL:",
  validDateLabel: "VALID:",
  accreditationInlineLinks: [],
  isActive: true,
};

// ================= SKELETON =================

function CertificationCardSkeleton() {
  return (
    <div className="flex justify-center px-4 py-10 sm:px-6">
      {/* lg and up */}
      <div className="hidden w-full max-w-[1484px] animate-pulse lg:block">
        <div className="ml-auto h-[110px] w-[55%] min-w-[480px] max-w-[667px] rounded-[30px] bg-gray-300" />
        <div className="-mt-10 min-h-[560px] w-full rounded-[30px] bg-gray-200 xl:min-h-[640px] 2xl:min-h-[709px]" />
      </div>

      {/* below lg */}
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
            accreditationValidity:
              responseData.accreditationValidity || defaultData.accreditationValidity,
            validityLabel: responseData.validityLabel || defaultData.validityLabel,
            accreditationCenter:
              responseData.accreditationCenter || defaultData.accreditationCenter,
            centerCertificateNumber:
              responseData.centerCertificateNumber || defaultData.centerCertificateNumber,
            accreditedLabel: responseData.accreditedLabel || defaultData.accreditedLabel,
            standardTitle: responseData.standardTitle || defaultData.standardTitle,
            standardDescription:
              responseData.standardDescription || defaultData.standardDescription,
            certificateNumberLabel:
              responseData.certificateNumberLabel || defaultData.certificateNumberLabel,
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
      {/* DESKTOP / LARGE TABLET (lg and up) — flow layout, no fixed    */}
      {/* aspect ratio, so it adapts to MacBook and every other width.  */}
      {/* ============================================================ */}
      <div className="hidden w-full max-w-[1484px] lg:block">
        {/* Ribbon — sits on top, aligned right */}
        <div
          className="relative z-10 ml-auto flex w-[55%] min-w-[480px] max-w-[667px] items-center justify-center rounded-[30px] px-6 py-5 xl:px-10 xl:py-7"
          style={{ background: "#FFA7DC73" }}
        >
          <div className="flex w-full flex-nowrap items-center justify-center gap-8 xl:gap-16 2xl:gap-[108px]">
            <div className="flex flex-col items-start">
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "clamp(20px, 2vw, 30px)", lineHeight: "120%" }}
              >
                {certificateNumber}
              </span>
              <span
                className="whitespace-nowrap font-poppins font-medium uppercase text-black"
                style={{ fontSize: "clamp(12px, 1.1vw, 18px)", lineHeight: "120%" }}
              >
                {certificateTitle || "EIAC CERTIFICATE"}
              </span>
            </div>

            <div className="flex flex-col items-start">
              <span
                className="font-poppins font-bold uppercase text-black"
                style={{ fontSize: "clamp(20px, 2vw, 30px)", lineHeight: "120%" }}
              >
                {accreditationValidity}
              </span>
              <span
                className="whitespace-nowrap font-poppins font-medium uppercase text-black"
                style={{ fontSize: "clamp(12px, 1.1vw, 18px)", lineHeight: "120%" }}
              >
                {validityLabel || "ACCREDITATION VALIDITY"}
              </span>
            </div>
          </div>
        </div>

        {/* Main card — pulled up under the ribbon */}
        <div className="-mt-10 flex min-h-[560px] w-full flex-col rounded-[30px] border bg-[#FFFCEB] p-3 shadow-md sm:p-4 xl:min-h-[640px] 2xl:min-h-[709px]">
          <div className="relative flex w-full flex-1 flex-col rounded-[24px] border border-[#A9A9A9] bg-[#FFFCEB] px-8 pb-8 pt-16 xl:px-12 xl:pb-9 xl:pt-[72px]">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", lineHeight: "120%" }}
              >
                {accreditationCenter}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", lineHeight: "120%" }}
              >
                {certificateNumber}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <div className="relative h-[150px] w-[150px] animate-[spin_16s_linear_infinite] xl:h-[190px] xl:w-[190px] 2xl:h-[210px] 2xl:w-[210px]">
                <Image
                  src={ACCREDITED_BADGE}
                  alt={accreditedLabel || "EIAC Accredited badge"}
                  fill
                  className="object-contain"
                />
              </div>

              <h3
                className="mt-6 font-poppins font-bold uppercase text-black xl:mt-8"
                style={{ fontSize: "clamp(24px, 2.8vw, 42px)", lineHeight: "120%" }}
              >
                {standardTitle}
              </h3>

              <p
                className="mt-3 max-w-2xl font-poppins font-medium capitalize text-[#929292] xl:mt-4"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", lineHeight: "120%" }}
              >
                {standardDescription}
              </p>

              <p
                className="mt-4 font-poppins font-semibold capitalize text-[#363636] xl:mt-6"
                style={{ fontSize: "clamp(14px, 1.4vw, 22px)", lineHeight: "120%" }}
              >
                {certificateNumberLabel || `Certificate No. ${certificateNumber}`}
              </p>
            </div>

            {/* Footer row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(12px, 1.3vw, 22px)", lineHeight: "120%" }}
              >
                {initialDateLabel || "Initial:"} {initialDate}
              </span>
              <span
                className="font-poppins font-medium uppercase text-[#929292]"
                style={{ fontSize: "clamp(12px, 1.3vw, 22px)", lineHeight: "120%" }}
              >
                {validDateLabel || "Valid:"} {validDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE / TABLET (below lg) — natural document flow            */}
      {/* ============================================================ */}
      <div className="flex w-full max-w-[578px] flex-col gap-4 lg:hidden">
        {/* Pink ribbon */}
        <div
          className="flex w-full flex-col items-center justify-center gap-4 rounded-[24px] px-5 py-5 sm:flex-row sm:gap-10 sm:px-8 sm:py-6"
          style={{ background: "#FFA7DC73" }}
        >
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-center font-poppins text-xl font-bold uppercase text-black sm:text-left sm:text-2xl">
              {certificateNumber}
            </span>
            <span className="text-center font-poppins text-xs font-medium uppercase text-black sm:text-left sm:text-sm">
              {certificateTitle || "EIAC CERTIFICATE"}
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-center font-poppins text-xl font-bold uppercase text-black sm:text-left sm:text-2xl">
              {accreditationValidity}
            </span>
            <span className="text-center font-poppins text-xs font-medium uppercase text-black sm:text-left sm:text-sm">
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