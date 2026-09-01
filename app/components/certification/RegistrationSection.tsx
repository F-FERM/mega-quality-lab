"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import REGISTRATION_BADGE from "../../../public/images/accredited-badge.png";

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
    tableRows: [],
    viewCertificateText: "VIEW FULL CERTIFICATE →",
    viewCertificateLink: "/certificates/lb-test-271",
    footerDescription: "",
    labName: "",
    labSubtitle: "",
    labStandard: "",
    labCertificateNumber: "",
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
    tableRows: [],
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

function RegistrationSectionSkeleton() {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: "1465px" }}>
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mb-10">
          <div className="h-14 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-14 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-14 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex flex-col lg:flex-row" style={{ gap: "20px", maxWidth: "1465px" }}>
          {/* sm+ card shape */}
          <div className="hidden w-full max-w-[722px] aspect-[722/449] animate-pulse rounded-[30px] bg-gray-200 sm:block" />
          {/* mobile card shape — natural height, not tied to the 722/449 ratio */}
          <div className="h-[400px] w-full animate-pulse rounded-[30px] bg-gray-200 sm:hidden" />
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="border-t border-[#727272]" />
            <div className="flex flex-wrap gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
            <div className="h-14 w-48 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= REGISTRATION CERTIFICATE MODAL =================

interface RegistrationCertificateModalProps {
  onClose: () => void;
  programName: string;
  labName: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
}

function RegistrationCertificateModal({
  onClose,
  programName,
  labName,
  certificateNumber,
  issuedDate,
  expiryDate,
}: RegistrationCertificateModalProps) {
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
            <Image src={REGISTRATION_BADGE} alt="Registration badge" fill className="object-contain" />
          </div>

          <h4 className="mt-8 font-poppins text-2xl font-bold uppercase text-black">
            {programName}
          </h4>

          <p className="mt-3 font-poppins text-lg font-medium capitalize text-[#929292]">
            {labName}
          </p>

          <p className="mt-3 font-poppins text-xl font-semibold uppercase text-black">
            {certificateNumber}
          </p>

          <p className="mt-2 font-poppins text-base font-medium text-[#929292]">
            Issued {issuedDate} · Expiry {expiryDate}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Below sm (phones) — same content, sized to fit instead of the  */}
      {/* 923:573 ratio, which would clip this card's five text lines    */}
      {/* this narrow (same reasoning as the mini registration card).    */}
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
            <Image src={REGISTRATION_BADGE} alt="Registration badge" fill className="object-contain" />
          </div>

          <h4 className="mt-6 font-poppins text-base font-bold uppercase text-black">
            {programName}
          </h4>

          <p className="mt-2 font-poppins text-xs font-medium capitalize text-[#929292]">
            {labName}
          </p>

          <p className="mt-3 font-poppins text-sm font-semibold uppercase text-black">
            {certificateNumber}
          </p>

          <p className="mt-1 font-poppins text-xs font-medium text-[#929292]">
            Issued {issuedDate} · Expiry {expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================

function RegistrationSection() {
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
    return <RegistrationSectionSkeleton />;
  }

  const { sharjahRegistration } = data;

  // Get values from table rows
  const registrationNo = getTableValue(sharjahRegistration.tableRows, "REGISTRATION CERTIFICATE") || sharjahRegistration.certificateNumber;
  const issuedDate = getTableValue(sharjahRegistration.tableRows, "ISSUED") || sharjahRegistration.issuedDate;
  const validUntilDate = getTableValue(sharjahRegistration.tableRows, "VALID UNTIL") || sharjahRegistration.expiryDate;

  // Format dates for display (convert from DD/MM/YYYY to DD MMM YYYY if needed)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // If already in "DD MMM YYYY" format, return as is
    if (dateStr.includes(" ")) return dateStr;
    // Convert "DD/MM/YYYY" to "DD MMM YYYY"
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = months[parseInt(parts[1]) - 1] || parts[1];
      return `${parts[0]} ${month} ${parts[2]}`;
    }
    return dateStr;
  };

  const formattedIssuedDate = formatDate(issuedDate);
  const formattedValidDate = formatDate(validUntilDate);

  return (
    <>
      <section className="w-full px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto w-full" style={{ maxWidth: "1465px" }}>
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize text-[#67003E]"
              style={{ fontSize: "24px", lineHeight: "100%", letterSpacing: "0px" }}
            >
              {sharjahRegistration.sectionNumber} — {sharjahRegistration.sectionTitle}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-10 font-poppins font-bold uppercase text-black"
            style={{
              fontSize: "clamp(32px, 4vw + 12px, 60px)",
              lineHeight: "112%",
              letterSpacing: "0px",
            }}
          >
            {sharjahRegistration.mainTitle}
            <br />
            <span className="text-[#FFA8D9]">{sharjahRegistration.mainTitleTwo}</span>
            <br />
            {sharjahRegistration.mainTitleThree}
          </h2>

          {/* Row: card + content */}
          <div
            className="flex flex-col lg:flex-row"
            style={{ gap: "20px", maxWidth: "1465px" }}
          >
            {/* ============================================================ */}
            {/* sm and up — original fixed-ratio registration card, unchanged */}
            {/* ============================================================ */}
            <div
              className="relative hidden w-full shrink-0 rounded-[30px] bg-[#FFFCEB] sm:block"
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
                    alt="Registration badge"
                    fill
                    className="object-contain"
                  />
                </div>

                <h4
                  className="mt-6 font-poppins font-bold uppercase text-black"
                  style={{
                    fontSize: "clamp(16px, 1.2vw + 10px, 24px)",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                  }}
                >
                  {sharjahRegistration.programName}
                </h4>

                <p
                  className="mt-2 font-poppins font-medium capitalize text-[#929292]"
                  style={{
                    fontSize: "clamp(12px, 0.8vw + 8px, 17px)",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                  }}
                >
                  {sharjahRegistration.labName}
                </p>

                <p
                  className="mt-3 font-poppins font-semibold uppercase text-black"
                  style={{
                    fontSize: "clamp(14px, 1vw + 8px, 20px)",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                  }}
                >
                  {sharjahRegistration.certificateNumber}
                </p>

                <p
                  className="mt-1 font-poppins font-medium text-[#929292]"
                  style={{
                    fontSize: "clamp(11px, 0.7vw + 8px, 15px)",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                  }}
                >
                  Issued {formattedIssuedDate} · Expiry {formattedValidDate}
                </p>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Below sm (phones) — same badge, colors, and copy, sized to its  */}
            {/* content instead of the 722:449 ratio. This card packs five     */}
            {/* text lines under the badge, so it's the most overflow-prone    */}
            {/* of these cards below ~600px container width; forcing the      */}
            {/* fixed ratio there would clip the bottom lines.                 */}
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
                <div className="relative h-[120px] w-[120px] animate-[spin_16s_linear_infinite]">
                  <Image
                    src={REGISTRATION_BADGE}
                    alt="Registration badge"
                    fill
                    className="object-contain"
                  />
                </div>

                <h4 className="mt-6 font-poppins text-base font-bold uppercase text-black">
                  {sharjahRegistration.programName}
                </h4>

                <p className="mt-2 font-poppins text-xs font-medium capitalize text-[#929292]">
                  {sharjahRegistration.labName}
                </p>

                <p className="mt-3 font-poppins text-sm font-semibold uppercase text-black">
                  {sharjahRegistration.certificateNumber}
                </p>

                <p className="mt-1 font-poppins text-xs font-medium text-[#929292]">
                  Issued {formattedIssuedDate} · Expiry {formattedValidDate}
                </p>
              </div>
            </div>

            {/* Right: certificate details */}
            <div className="flex flex-1 flex-col justify-center">
              <h3
                className="mb-4 font-poppins font-bold uppercase text-black"
                style={{
                  fontSize: "clamp(24px, 2.5vw + 10px, 42px)",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {sharjahRegistration.certificateNumber}
              </h3>

              <p
                className="mb-8 font-poppins font-medium capitalize text-[#727272]"
                style={{
                  fontSize: "clamp(16px, 1.2vw + 10px, 22px)",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {sharjahRegistration.description}
              </p>

              {/* Divider */}
              <div className="mb-8 border-t border-[#727272]" />

              {/* Stats row */}
              <div className="mb-10 flex flex-wrap items-start gap-x-10 gap-y-6">
                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(12px, 0.8vw + 8px, 16px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Registration Certificate
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(16px, 1.2vw + 10px, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {registrationNo}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(12px, 0.8vw + 8px, 16px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Issued
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(16px, 1.2vw + 10px, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {formattedIssuedDate}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className="font-poppins font-medium uppercase text-[#474747]"
                    style={{ fontSize: "clamp(12px, 0.8vw + 8px, 16px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    Valid Until
                  </span>
                  <span
                    className="font-poppins font-bold uppercase text-black"
                    style={{ fontSize: "clamp(16px, 1.2vw + 10px, 22px)", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {formattedValidDate}
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
                  {sharjahRegistration.viewCertificateText || "View Full Certificate"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {isCertModalOpen && (
        <RegistrationCertificateModal
          onClose={() => setIsCertModalOpen(false)}
          programName={sharjahRegistration.programName}
          labName={sharjahRegistration.labName}
          certificateNumber={sharjahRegistration.certificateNumber}
          issuedDate={formattedIssuedDate}
          expiryDate={formattedValidDate}
        />
      )}
    </>
  );
}

export default RegistrationSection;