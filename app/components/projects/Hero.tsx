"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import BANNER_BG from "../../../public/images/servicehero.jpg";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ProjectExperienceData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  isActive: boolean;
}

// ================= FALLBACK =================

const defaultData: ProjectExperienceData = {
  sectionTitle: "Project Experience",
  heroTitle: "TRUSTED ACROSS MAJOR UAE PROJECTS",
  heroSubtitle: "PROJECTS",
  heroImage: "",
  heroImageAlt: "Project Experience - UAE Projects",
  heroInlineLinks: [],
  description:
    "Six Core Disciplines Covering The Full Lifecycle Of Construction Materials From Raw Aggregate To Finished Structure.",
  descriptionInlineLinks: [],
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

/**
 * Renders `text` as plain strings interleaved with <Link> elements for any
 * inline link whose `text` appears as a substring in it.
 */
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

function HeroProjectSkeleton() {
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
            <span className="h-px w-8 bg-[#67003E]" />
            <div className="h-6 w-32 animate-pulse rounded bg-white/15" />
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

// ================= MAIN =================

function HeroProject() {
  const [data, setData] = useState<ProjectExperienceData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get("/project-experience");
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
            heroSubtitle: responseData.heroSubtitle || defaultData.heroSubtitle,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            description: responseData.description || defaultData.description,
            descriptionInlineLinks: responseData.descriptionInlineLinks || [],
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Project Experience hero banner:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (isLoading) {
    return <HeroProjectSkeleton />;
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
            <span className="h-px w-8 bg-[#67003E]" />
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
            <span className="text-[#FFA8D9]">{data.heroSubtitle}</span>
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
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroProject;