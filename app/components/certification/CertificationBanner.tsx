"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import BANNER_BG from "../../../public/images/certificationbanner.jpg";

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

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function renderInlineLinks(text: string, links: InlineLink[]): ReactNode {
  if (!text || !links || links.length === 0) return text;

  type Match = { start: number; end: number; link: InlineLink };
  const matches: Match[] = [];

  for (const link of links) {
    if (!link.text) continue;
    const idx = text.indexOf(link.text);
    if (idx === -1) continue;
    matches.push({ start: idx, end: idx + link.text.length, link });
  }

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);
  const clean: Match[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      clean.push(m);
      lastEnd = m.end;
    }
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;
  clean.forEach((m, i) => {
    if (m.start > cursor) {
      nodes.push(text.slice(cursor, m.start));
    }
    nodes.push(
      <Link
        key={`${m.link.url}-${i}`}
        href={m.link.url}
        target={m.link.openInNewTab ? "_blank" : undefined}
        rel={m.link.openInNewTab ? "noopener noreferrer" : undefined}
        className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80"
      >
        {text.slice(m.start, m.end)}
      </Link>,
    );
    cursor = m.end;
  });
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

// ================= SKELETON =================

function CertificationBannerSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#1a1a1a]"
      style={{ minHeight: "756px" }}
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center justify-center text-center"
        style={{
          maxWidth: "1920px",
          minHeight: "756px",
          paddingTop: "246px",
          paddingRight: "478px",
          paddingBottom: "228px",
          paddingLeft: "479px",
          gap: "10px",
        }}
      >
        <div className="flex w-full max-w-[963px] flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <div className="h-6 w-48 animate-pulse rounded bg-white/15" />
            <span className="h-px w-8 bg-[#67003E]" />
          </div>
          <div className="mb-6 w-full">
            <div className="h-14 w-full animate-pulse rounded bg-white/15" />
          </div>
          <div className="w-full">
            <div className="h-6 w-full animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= MAIN BANNER =================

function CertificationBanner() {
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
    return <CertificationBannerSkeleton />;
  }

  const resolvedImage = resolveImage(data.heroImage);
  const isRemoteImage = resolvedImage.startsWith("http");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image fills the full section */}
      <div className="absolute inset-0">
        <Image
          src={resolvedImage || BANNER_BG}
          alt={data.heroImageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized={isRemoteImage}
          priority
        />
      </div>

      {/* Overlay + content — exact spec box with responsive adjustments */}
      <div
        className="relative mx-auto flex w-full flex-col items-center justify-center text-center"
        style={{
          maxWidth: "1920px",
          minHeight: "756px",
          paddingTop: "clamp(100px, 12vw + 40px, 246px)",
          paddingRight: "clamp(20px, 10vw - 20px, 478px)",
          paddingBottom: "clamp(80px, 10vw + 20px, 228px)",
          paddingLeft: "clamp(20px, 10vw - 20px, 479px)",
          gap: "10px",
          background: "#00000080",
        }}
      >
        <div className="flex w-full max-w-[963px] flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize"
              style={{
                fontSize: "clamp(16px, 1.5vw + 10px, 24px)",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#67003E",
              }}
            >
              {data.sectionTitle}
            </span>
            <span className="h-px w-8 bg-[#67003E]" />
          </div>

          {/* Heading */}
          <h2
            className="mb-6 font-poppins font-bold uppercase text-white"
            style={{
              width: "100%",
              maxWidth: "963px",
              fontSize: "clamp(28px, 4vw + 12px, 60px)",
              lineHeight: "112%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
          >
            {data.heroTitle}{" "}
            <span className="text-[#FFA8D9]">{data.heroTitleTwo}</span>{" "}
            {data.heroTitleThree}
          </h2>

          {/* Sub copy */}
          <p
            className="font-poppins font-medium capitalize"
            style={{
              width: "100%",
              maxWidth: "963px",
              fontSize: "clamp(16px, 1.2vw + 10px, 22px)",
              lineHeight: "160%",
              letterSpacing: "0px",
              color: "#E8E8E8",
              textAlign: "center",
            }}
          >
            {data.heroDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CertificationBanner;