"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface Pillar {
  _id?: string;
  pillarNumber: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EHSCategory {
  _id?: string;
  category: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface QualityEHSData {
  _id?: string;
  qualityTitle: string;
  qualityDescription: string;
  qualityInlineLinks: InlineLink[];
  pillars: Pillar[];
  ehsTitle: string;
  ehsDescription: string;
  ehsInlineLinks: InlineLink[];
  ehsCategories: EHSCategory[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const defaultData: QualityEHSData = {
  qualityTitle: "Quality Is Not A Claim. It's A System.",
  qualityDescription:
    "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  qualityInlineLinks: [],
  pillars: [
    {
      pillarNumber: "PILLAR 01",
      title: "Accuracy",
      description:
        "Testing Performed According To Applicable Standards And Documented Methods.",
      order: 0,
      inlineLinks: [],
    },
    {
      pillarNumber: "PILLAR 02",
      title: "Impartiality",
      description:
        "Independent And Objective Testing Practices, Free From Undue Influence.",
      order: 1,
      inlineLinks: [],
    },
    {
      pillarNumber: "PILLAR 03",
      title: "Continuous Improvement",
      description:
        "Ongoing Review Of Processes, Technical Competence And Customer Requirements.",
      order: 2,
      inlineLinks: [],
    },
  ],
  ehsTitle: "SAFETY. RESPONSIBILITY. SUSTAINABILITY.",
  ehsDescription:
    "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  ehsInlineLinks: [],
  ehsCategories: [],
  isActive: true,
};

/**
 * Highlights the word "System" (optionally followed by punctuation) in pink.
 * Case-insensitive, works regardless of where the word falls or whether the
 * CMS text includes a trailing period.
 */
function renderHighlightedTitle(title: string) {
  const regex = /(system\.?)/i;
  const match = title.match(regex);

  if (!match) {
    // No "System" found — render as plain text, no crash, no silent blank
    return title;
  }

  const index = match.index ?? 0;
  const before = title.slice(0, index);
  const matched = match[0];
  const after = title.slice(index + matched.length);

  return (
    <>
      {before}
      <span className="text-[#FFA8D9]">{matched}</span>
      {after}
    </>
  );
}

function QualitySystemSkeleton() {
  return (
    <section className="w-full bg-white px-4 pt-16 pb-32 sm:px-6 sm:pt-20 sm:pb-40 md:pt-24 md:pb-48 xl:pt-28 xl:pb-56">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center justify-center gap-3 px-2">
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
          <span className="h-6 w-40 max-w-[50%] animate-pulse rounded bg-gray-200" />
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
        </div>

        {/* Heading Skeleton */}
        <div className="mx-auto mb-6 max-w-[1000px] px-2 text-center">
          <div className="mx-auto h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        {/* Sub copy Skeleton */}
        <div className="mx-auto mb-16 max-w-[820px] px-2 text-center">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-2 h-6 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 md:grid-cols-3 xl:gap-y-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex min-w-0 flex-col justify-start rounded-[40px] border border-[#D9D9D9] bg-white p-6 sm:p-8 xl:p-10"
            >
              <div className="mb-6 h-6 w-24 animate-pulse rounded bg-gray-200 sm:mb-7 xl:mb-8" />
              <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-gray-200 sm:mb-3" />
              <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QualitySystem() {
  const [data, setData] = useState<QualityEHSData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQualityEHSData = async () => {
      try {
        const res = await api.get("/home-quality-ehs");

        if (res.data && typeof res.data === "object") {
          // Check if response is array or single object
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (
            responseData.qualityEHS &&
            Array.isArray(responseData.qualityEHS) &&
            responseData.qualityEHS.length > 0
          ) {
            responseData = responseData.qualityEHS[0];
          }

          // Sort pillars by order
          const sortedPillars = (responseData.pillars || []).sort(
            (a: Pillar, b: Pillar) => (a.order || 0) - (b.order || 0)
          );

          const qualityData: QualityEHSData = {
            _id: responseData._id,
            qualityTitle: responseData.qualityTitle || defaultData.qualityTitle,
            qualityDescription:
              responseData.qualityDescription || defaultData.qualityDescription,
            qualityInlineLinks: responseData.qualityInlineLinks || [],
            pillars: sortedPillars,
            ehsTitle: responseData.ehsTitle || defaultData.ehsTitle,
            ehsDescription: responseData.ehsDescription || defaultData.ehsDescription,
            ehsInlineLinks: responseData.ehsInlineLinks || [],
            ehsCategories: (responseData.ehsCategories || []).sort(
              (a: EHSCategory, b: EHSCategory) => (a.order || 0) - (b.order || 0)
            ),
            isActive: responseData.isActive ?? true,
          };

          setData(qualityData);
        }
      } catch (err) {
        console.error("Failed to fetch Quality & EHS section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQualityEHSData();
  }, []);

  if (isLoading) {
    return <QualitySystemSkeleton />;
  }

  const { qualityTitle, qualityDescription, pillars } = data;

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 pt-16 pb-32 sm:px-6 sm:pt-20 sm:pb-40 md:pt-24 md:pb-48 xl:pt-28 xl:pb-56">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3 px-2">
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
          <span
            className="
              font-poppins font-normal capitalize
              break-words text-center
              text-base sm:text-lg md:text-xl lg:text-2xl
            "
            style={{
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            Quality System
          </span>
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
        </div>

        {/* Heading */}
        <h2
          className="
            mx-auto mb-6 max-w-[1000px] px-2
            text-center font-poppins font-bold uppercase text-black
            leading-[120%] sm:leading-[116%] md:leading-[112%]
            break-words [overflow-wrap:anywhere]
            text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[60px]
          "
          style={{ letterSpacing: "0px" }}
        >
          {renderHighlightedTitle(qualityTitle)}
        </h2>

        {/* Sub copy */}
        <p
          className="
            mx-auto mb-16 max-w-[820px] px-2
            text-center font-poppins font-medium capitalize
            break-words [overflow-wrap:anywhere]
            text-sm sm:text-lg md:text-xl xl:text-[22px]
          "
          style={{
            lineHeight: "140%",
            letterSpacing: "0px",
            color: "#727272",
          }}
        >
          {qualityDescription}
        </p>

        {/* Cards */}
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 md:grid-cols-3 xl:gap-y-12">
          {pillars.map((pillar) => (
            <div
              key={pillar._id || pillar.pillarNumber}
              className="
                flex min-w-0 flex-col justify-start
                rounded-[24px] border border-[#D9D9D9] bg-white
                p-5 sm:rounded-[32px] sm:p-8 xl:rounded-[40px] xl:p-10
                transition-all duration-300 ease-out cursor-pointer
                hover:-translate-y-6 hover:border hover:border-[#D9D9D9] hover:shadow-2xl hover:shadow-black/15
              "
            >
              <span
                className="
                  mb-4 font-poppins font-normal capitalize
                  whitespace-nowrap sm:mb-7 xl:mb-8
                  text-sm sm:text-base
                "
                style={{
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#67003E",
                }}
              >
                {pillar.pillarNumber}
              </span>

              <h3
                className="
                  mb-2 font-poppins font-semibold capitalize text-black
                  break-words [overflow-wrap:anywhere]
                  sm:mb-3
                  text-xl sm:text-2xl md:text-[28px] xl:text-[32px]
                "
                style={{
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {pillar.title}
              </h3>

              <p
                className="
                  font-poppins font-normal capitalize
                  break-words [overflow-wrap:anywhere]
                  text-sm sm:text-base md:text-lg
                "
                style={{
                  lineHeight: "130%",
                  letterSpacing: "0px",
                  color: "#686868",
                }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QualitySystem;