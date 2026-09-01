"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import ACCREDITED_BADGE from "../../../public/images/accredited-badge.png";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface TableRow {
  _id?: string;
  label: string;
  value: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EIACAccreditation {
  _id?: string;
  sectionNumber: string;
  sectionTitle: string;
  mainTitle: string;
  mainTitleTwo: string;
  standardTitle: string;
  description: string;
  inlineLinks: InlineLink[];
  tableHeaders: string[];
  tableRows: TableRow[];
  viewCertificateText: string;
  viewCertificateLink: string;
  footerDescription: string;
  labName: string;
  labSubtitle: string;
  labStandard: string;
  labCertificateNumber: string;
}

interface SharjahRegistration {
  _id?: string;
  sectionNumber: string;
  sectionTitle: string;
  mainTitle: string;
  mainTitleTwo: string;
  mainTitleThree: string;
  programName: string;
  labName: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
  issuedLabel: string;
  expiryLabel: string;
  description: string;
  inlineLinks: InlineLink[];
  tableHeaders: string[];
  tableRows: TableRow[];
  viewCertificateText: string;
  viewCertificateLink: string;
}

interface CertificatePageData {
  _id?: string;
  pageTitle: string;
  eiacAccreditation: EIACAccreditation;
  sharjahRegistration: SharjahRegistration;
  isActive: boolean;
}

// ================= FALLBACK =================

const defaultData: CertificatePageData = {
  pageTitle: "Certificates & Accreditations",
  eiacAccreditation: {
    sectionNumber: "01",
    sectionTitle: "EIAC Accreditation",
    mainTitle: "ACCREDITED FOR CONFIDENCE.",
    mainTitleTwo: "CONFIDENCE.",
    standardTitle: "ISO/IEC 17025:2017",
    description: "The Supplied Accreditation Documentation Identifies Certificate LB-TEST-271 And States Validity From 19 February 2025 To 18 February 2028.",
    inlineLinks: [],
    tableHeaders: ["CERTIFICATE", "INITIAL DATE", "VALID UNTIL"],
    tableRows: [
      { label: "CERTIFICATE", value: "LB-TEST-271", order: 0, inlineLinks: [] },
      { label: "INITIAL DATE", value: "19 FEB 2025", order: 1, inlineLinks: [] },
      { label: "VALID UNTIL", value: "18 FEB 2028", order: 2, inlineLinks: [] },
    ],
    viewCertificateText: "VIEW FULL CERTIFICATE →",
    viewCertificateLink: "/certificates/lb-test-271",
    footerDescription: "Mega Quality Laboratory For Soil And Building Materials Testing Is Accredited By The Emirates International Accreditation Centre In Accordance With ISO/IEC 17025:2017 For Activities Within Its Accredited Scope.",
    labName: "MEGA QUALITY LABORATORY",
    labSubtitle: "SOIL AND BUILDING MATERIALS TESTING",
    labStandard: "ISO/IEC 17025:2017",
    labCertificateNumber: "LB-TEST-271",
  },
  sharjahRegistration: {
    sectionNumber: "02",
    sectionTitle: "Registration",
    mainTitle: "SHARJAH LABORATORIES",
    mainTitleTwo: "REGISTRATION",
    mainTitleThree: "PROGRAM.",
    programName: "SHARJAH LABORATORIES REGISTRATION PROGRAM",
    labName: "MEGA QUALITY LABORATORY FOR SOIL AND BUILDING MATERIALS TESTING",
    certificateNumber: "NO. 14/2025",
    issuedDate: "23/12/2025",
    expiryDate: "22/12/2026",
    issuedLabel: "Issued",
    expiryLabel: "Expiry",
    description: "Mega Quality Laboratory Is Registered Under The Sharjah Laboratories Registration Program.",
    inlineLinks: [],
    tableHeaders: ["REGISTRATION CERTIFICATE", "ISSUED", "VALID UNTIL"],
    tableRows: [
      { label: "REGISTRATION CERTIFICATE", value: "NO. 14/2025", order: 0, inlineLinks: [] },
      { label: "ISSUED", value: "23 DEC 2025", order: 1, inlineLinks: [] },
      { label: "VALID UNTIL", value: "22 DEC 2026", order: 2, inlineLinks: [] },
    ],
    viewCertificateText: "VIEW FULL CERTIFICATE →",
    viewCertificateLink: "/certificates/sharjah-14-2025",
  },
  isActive: true,
};

// ================= HELPER =================

function getTableValue(rows: TableRow[], label: string): string {
  const row = rows.find((r) => r.label === label);
  return row?.value || "";
}

// ================= SKELETON =================

function AccreditationSectionSkeleton() {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: "1465px" }}>
        <div className="mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-5">
          {/* Left column skeleton */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#67003E]" />
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mb-8">
              <div className="h-14 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-14 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-10 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-8 border-t border-[#727272]" />
            <div className="mt-8 flex flex-wrap gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
            <div className="mt-10 h-14 w-48 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Right column skeleton */}
          <div className="flex flex-col">
            <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-10 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
            {/* sm+ preview shape */}
            <div className="mt-4 hidden aspect-[722/449] w-full max-w-[722px] animate-pulse rounded-[30px] bg-gray-200 sm:block" />
            {/* mobile preview shape — natural height, not tied to the 722/449 ratio */}
            <div className="mt-4 h-[360px] w-full animate-pulse rounded-[30px] bg-gray-200 sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= CERTIFICATE MODAL =================

interface CertificateModalProps {
  onClose: () => void;
  labName: string;
  labSubtitle: string;
  labStandard: string;
  labCertificateNumber: string;
}

function CertificateModal({ onClose, labName, labSubtitle, labStandard, labCertificateNumber }: CertificateModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ============================================================ */}
      {/* sm and up — exact spec: 923 x 573, radius 30px, padding 16/21/15/21 */}
      {/* ============================================================ */}
      <div
        className="relative hidden w-full bg-[#FFFCEB] sm:block"
        style={{
          maxWidth: "923px",
          aspectRatio: "923 / 573",
          borderRadius: "30px",
          paddingTop: "16px",
          paddingRight: "21px",
          paddingBottom: "15px",
          paddingLeft: "21px",
          border: "1px solid #EAE0B8",
          boxShadow: "0px 0px 4px 0px #00000040",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L14 14M14 2L2 14" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-[24px] text-center"
          style={{ border: "1px solid #A9A9A9" }}
        >
          <div className="relative h-[180px] w-[180px] animate-[spin_16s_linear_infinite]">
            <Image src={ACCREDITED_BADGE} alt="EIAC Accredited badge" fill className="object-contain" />
          </div>

          <h4 className="mt-8 font-poppins text-3xl font-bold uppercase text-black">
            {labName || "MEGA QUALITY LABORATORY"}
          </h4>

          <p className="mt-3 font-poppins text-xl font-medium capitalize text-[#929292]">
            {labSubtitle || "SOIL AND BUILDING MATERIALS TESTING"}
          </p>

          <p className="mt-2 font-poppins text-base font-medium uppercase text-[#929292]">
            {labStandard || "ISO/IEC 17025:2017"}
          </p>

          <p className="mt-4 font-poppins text-2xl font-semibold uppercase text-black">
            {labCertificateNumber}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Below sm (phones) — same content, sized to fit instead of the  */}
      {/* 923:573 ratio, which would clip the badge/text stack this      */}
      {/* narrow (same reasoning as the mini preview card).              */}
      {/* ============================================================ */}
      <div
        className="relative w-full max-w-[420px] bg-[#FFFCEB] sm:hidden"
        style={{
          borderRadius: "30px",
          padding: "16px 21px",
          border: "1px solid #EAE0B8",
          boxShadow: "0px 0px 4px 0px #00000040",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L14 14M14 2L2 14" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className="flex w-full flex-col items-center justify-center rounded-[24px] px-5 py-10 text-center"
          style={{ border: "1px solid #A9A9A9" }}
        >
          <div className="relative h-[120px] w-[120px] animate-[spin_16s_linear_infinite]">
            <Image src={ACCREDITED_BADGE} alt="EIAC Accredited badge" fill className="object-contain" />
          </div>

          <h4 className="mt-6 font-poppins text-lg font-bold uppercase text-black">
            {labName || "MEGA QUALITY LABORATORY"}
          </h4>

          <p className="mt-2 font-poppins text-xs font-medium capitalize text-[#929292]">
            {labSubtitle || "SOIL AND BUILDING MATERIALS TESTING"}
          </p>

          <p className="mt-2 font-poppins text-[11px] font-medium uppercase text-[#929292]">
            {labStandard || "ISO/IEC 17025:2017"}
          </p>

          <p className="mt-3 font-poppins text-base font-semibold uppercase text-black">
            {labCertificateNumber}
          </p>
        </div>
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================

function AccreditationSection() {
  const [data, setData] = useState<CertificatePageData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/certificate-page");
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
            pageTitle: responseData.pageTitle || defaultData.pageTitle,
            eiacAccreditation: responseData.eiacAccreditation || defaultData.eiacAccreditation,
            sharjahRegistration: responseData.sharjahRegistration || defaultData.sharjahRegistration,
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Certificate Page:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isCertModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCertModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isCertModalOpen]);

  if (isLoading) {
    return <AccreditationSectionSkeleton />;
  }

  const { eiacAccreditation } = data;

  // Get values from table rows
  const certificateNo = getTableValue(eiacAccreditation.tableRows, "CERTIFICATE") || eiacAccreditation.labCertificateNumber;
  const initialDate = getTableValue(eiacAccreditation.tableRows, "INITIAL DATE") || "19 FEB 2025";
  const validDate = getTableValue(eiacAccreditation.tableRows, "VALID UNTIL") || "18 FEB 2028";

  return (
    <>
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
                  {eiacAccreditation.sectionNumber}  {eiacAccreditation.sectionTitle}
                </span>
              </div>

              {/* Heading */}
              <h2
                className="mb-8 font-poppins font-bold uppercase text-black"
                style={{
                  maxWidth: "725px",
                  fontSize: "clamp(32px, 4vw + 12px, 60px)",
                  lineHeight: "112%",
                  letterSpacing: "0px",
                }}
              >
                {eiacAccreditation.mainTitle}
                <br />
                <span className="text-[#FFA8D9]">{eiacAccreditation.mainTitleTwo}</span>
              </h2>

              {/* Standard */}
              <h3
                className="mb-4 font-poppins font-bold uppercase text-black"
                style={{
                  maxWidth: "724px",
                  fontSize: "clamp(24px, 2.5vw + 10px, 42px)",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {eiacAccreditation.standardTitle}
              </h3>

              <p
                className="mb-8 font-poppins font-medium capitalize text-[#727272]"
                style={{
                  maxWidth: "724px",
                  fontSize: "clamp(16px, 1.2vw + 10px, 22px)",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {eiacAccreditation.description}
              </p>

              {/* Divider */}
              <div
                className="mb-8 border-t border-[#727272]"
                style={{ maxWidth: "724px" }}
              />

              {/* Stats row — gap now scales down on narrow screens instead of a
                  fixed 142px gap that overflowed phone widths */}
              <div className="mb-10 flex flex-wrap items-start gap-x-8 gap-y-6 sm:gap-x-16 lg:gap-x-[142px]">
                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(14px, 1vw + 8px, 18px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Certificate
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(18px, 1.5vw + 10px, 24px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {certificateNo}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(14px, 1vw + 8px, 18px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Initial Date
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(18px, 1.5vw + 10px, 24px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {initialDate}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(14px, 1vw + 8px, 18px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Valid Until
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(18px, 1.5vw + 10px, 24px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {validDate}
                  </span>
                </div>
              </div>

              {/* CTA button — now opens the certificate modal instead of navigating */}
              <button
                type="button"
                onClick={() => setIsCertModalOpen(true)}
                className="inline-flex w-fit items-center justify-center gap-[10px] rounded-[20px] bg-[#67003E] text-white transition-opacity hover:opacity-90"
                style={{
                  paddingTop: "clamp(12px, 1vw + 8px, 15px)",
                  paddingRight: "clamp(24px, 2.5vw + 10px, 42px)",
                  paddingBottom: "clamp(12px, 1vw + 8px, 16px)",
                  paddingLeft: "clamp(24px, 2.5vw + 10px, 42px)",
                }}
              >
                <span
                  className="font-poppins font-medium uppercase"
                  style={{ fontSize: "clamp(16px, 1.2vw + 10px, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
                >
                  {eiacAccreditation.viewCertificateText || "View Full Certificate"}
                </span>
              </button>
            </div>

            {/* Right column */}
            <div className="flex flex-col">
              <p
                className="mb-10 font-poppins font-medium capitalize text-[#727272]"
                style={{
                  maxWidth: "741px",
                  fontSize: "clamp(16px, 1.2vw + 10px, 22px)",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {eiacAccreditation.footerDescription}
              </p>

              {/* ============================================================ */}
              {/* sm and up — original fixed-ratio mini certificate card, unchanged */}
              {/* ============================================================ */}
              <div
                className="relative hidden w-full rounded-[30px] bg-[#FFFCEB] sm:block"
                style={{
                  maxWidth: "722px",
                  aspectRatio: "722 / 449",
                  border: "1px solid #EAE0B8",
                  boxShadow: "0px 0px 4px 0px #00000040",
                }}
              >
                <div
                  className="absolute flex flex-col items-center justify-center rounded-[24px] bg-[#FFFCEB] text-center"
                  style={{
                    left: "1.66%",
                    top: "2.67%",
                    width: "96.68%",
                    height: "94.65%",
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
                    style={{
                      fontSize: "clamp(18px, 1.5vw + 10px, 26px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {eiacAccreditation.labName || "MEGA QUALITY LABORATORY"}
                  </h4>

                  <p
                    className="mt-2 font-poppins font-medium capitalize text-[#929292]"
                    style={{
                      fontSize: "clamp(12px, 1vw + 8px, 18px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {eiacAccreditation.labSubtitle || "SOIL AND BUILDING MATERIALS TESTING"}
                  </p>

                  <p
                    className="mt-2 font-poppins font-medium uppercase text-[#929292]"
                    style={{
                      fontSize: "clamp(11px, 0.8vw + 8px, 16px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {eiacAccreditation.labStandard || "ISO/IEC 17025:2017"}
                  </p>

                  <p
                    className="mt-3 font-poppins font-semibold uppercase text-black"
                    style={{
                      fontSize: "clamp(16px, 1.2vw + 10px, 22px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {eiacAccreditation.labCertificateNumber || certificateNo}
                  </p>
                </div>
              </div>

              {/* ============================================================ */}
              {/* Below sm (phones) — same colors, badge, and copy, but natural  */}
              {/* height instead of the 722:449 ratio. Below ~600px container    */}
              {/* width that ratio leaves less vertical room than the badge +    */}
              {/* four text lines need, so content would clip; this variant      */}
              {/* just lets the card grow to fit its content instead.            */}
              {/* ============================================================ */}
              <div
                className="w-full rounded-[30px] bg-[#FFFCEB] sm:hidden"
                style={{
                  border: "1px solid #EAE0B8",
                  boxShadow: "0px 0px 4px 0px #00000040",
                }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-[24px] bg-[#FFFCEB] px-5 py-8 text-center"
                  style={{ border: "1px solid #A9A9A9" }}
                >
                  <div className="relative h-[110px] w-[110px] animate-[spin_16s_linear_infinite]">
                    <Image
                      src={ACCREDITED_BADGE}
                      alt="EIAC Accredited badge"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <h4 className="mt-6 font-poppins text-lg font-bold uppercase text-black">
                    {eiacAccreditation.labName || "MEGA QUALITY LABORATORY"}
                  </h4>

                  <p className="mt-2 font-poppins text-xs font-medium capitalize text-[#929292]">
                    {eiacAccreditation.labSubtitle || "SOIL AND BUILDING MATERIALS TESTING"}
                  </p>

                  <p className="mt-2 font-poppins text-[11px] font-medium uppercase text-[#929292]">
                    {eiacAccreditation.labStandard || "ISO/IEC 17025:2017"}
                  </p>

                  <p className="mt-3 font-poppins text-base font-semibold uppercase text-black">
                    {eiacAccreditation.labCertificateNumber || certificateNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isCertModalOpen && (
        <CertificateModal
          onClose={() => setIsCertModalOpen(false)}
          labName={eiacAccreditation.labName}
          labSubtitle={eiacAccreditation.labSubtitle}
          labStandard={eiacAccreditation.labStandard}
          labCertificateNumber={eiacAccreditation.labCertificateNumber || certificateNo}
        />
      )}
    </>
  );
}

export default AccreditationSection;