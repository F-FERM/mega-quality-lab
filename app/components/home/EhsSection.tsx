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
  pillars: any[];
  ehsTitle: string;
  ehsDescription: string;
  ehsInlineLinks: InlineLink[];
  ehsCategories: EHSCategory[];
  isActive: boolean;
}

const defaultData: QualityEHSData = {
  qualityTitle: "QUALITY IS NOT A CLAIM. IT'S A SYSTEM.",
  qualityDescription: "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  qualityInlineLinks: [],
  pillars: [],
  ehsTitle: "SAFETY. RESPONSIBILITY. SUSTAINABILITY.",
  ehsDescription: "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  ehsInlineLinks: [],
  ehsCategories: [
    {
      category: "People",
      title: "Occupational Health & Safety",
      description: "Protocols Supporting The Safety Of Laboratory And Field Personnel.",
      order: 0,
      inlineLinks: [],
    },
    {
      category: "Environment",
      title: "Responsible Practices",
      description: "Environmentally Responsible Handling Of Samples And Laboratory Operations.",
      order: 1,
      inlineLinks: [],
    },
    {
      category: "Process",
      title: "Controlled Operations",
      description: "Safe, Controlled Laboratory Processes From Intake Through Disposal.",
      order: 2,
      inlineLinks: [],
    },
  ],
  isActive: true,
};

function EhsSectionSkeleton() {
  return (
    <section className="w-full bg-[#FDE1F0] px-4 py-16 sm:px-8 sm:py-20 md:px-16 md:py-24 lg:px-20 xl:px-[228px] xl:py-28">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-2.5">
        {/* Eyebrow Skeleton */}
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px w-8 shrink-0 bg-[#67003E]" />
          <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-2">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14" />
        </div>

        {/* Sub copy Skeleton */}
        <div className="mb-10 md:mb-16">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-6 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Pillars Skeleton */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex min-w-0 flex-col">
              <div className="mb-6 h-px w-full bg-[#989898]" />
              <div className="mb-2 h-5 w-20 animate-pulse rounded bg-gray-200" />
              <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EhsSection() {
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
          } else if (responseData.qualityEHS && Array.isArray(responseData.qualityEHS) && responseData.qualityEHS.length > 0) {
            responseData = responseData.qualityEHS[0];
          }

          // Sort EHS categories by order
          const sortedCategories = (responseData.ehsCategories || [])
            .sort((a: EHSCategory, b: EHSCategory) => (a.order || 0) - (b.order || 0));

          const qualityData: QualityEHSData = {
            _id: responseData._id,
            qualityTitle: responseData.qualityTitle || defaultData.qualityTitle,
            qualityDescription: responseData.qualityDescription || defaultData.qualityDescription,
            qualityInlineLinks: responseData.qualityInlineLinks || [],
            pillars: responseData.pillars || [],
            ehsTitle: responseData.ehsTitle || defaultData.ehsTitle,
            ehsDescription: responseData.ehsDescription || defaultData.ehsDescription,
            ehsInlineLinks: responseData.ehsInlineLinks || [],
            ehsCategories: sortedCategories,
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
    return <EhsSectionSkeleton />;
  }

  const { ehsTitle, ehsDescription, ehsCategories } = data;

  return (
    <section className="w-full overflow-x-hidden bg-[#FDE1F0] px-4 py-16 sm:px-8 sm:py-20 md:px-16 md:py-24 lg:px-20 xl:px-[228px] xl:py-28 2xl:px-[260px]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-2.5">
        {/* Eyebrow */}
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px w-8 shrink-0 bg-[#67003E]" />
          <span
            className="font-poppins font-normal capitalize text-[#67003E] break-words"
            style={{
              fontSize: "clamp(16px, 1.5vw + 10px, 24px)",
              lineHeight: "100%",
              letterSpacing: "0px",
            }}
          >
            EHS
          </span>
        </div>

        {/* Heading */}
        <h2
          className="mb-2 w-full max-w-[1012px] break-words [overflow-wrap:anywhere] font-poppins font-bold uppercase text-black"
          style={{
            fontSize: "clamp(28px, 3.6vw + 10px, 60px)",
            lineHeight: "1.12",
            letterSpacing: "0px",
          }}
        >
          {ehsTitle}
        </h2>

        {/* Sub copy */}
        <p
          className="mb-10 w-full max-w-[870px] break-words [overflow-wrap:anywhere] font-poppins font-medium capitalize text-[#727272] md:mb-16"
          style={{
            fontSize: "clamp(16px, 0.6vw + 14px, 22px)",
            lineHeight: "1.3",
            letterSpacing: "0px",
          }}
        >
          {ehsDescription}
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {ehsCategories.map((category) => (
            <div key={category._id || category.category} className="flex min-w-0 flex-col">
              <span className="mb-6 h-px w-full bg-[#989898]" />
              <span
                className="mb-2 break-words font-poppins font-normal capitalize text-[#67003E]"
                style={{
                  fontSize: "clamp(15px, 0.4vw + 13px, 18px)",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                }}
              >
                {category.category}
              </span>
              <h3
                className="mb-3 break-words [overflow-wrap:anywhere] font-poppins font-semibold capitalize text-black"
                style={{
                  fontSize: "clamp(20px, 1vw + 16px, 26px)",
                  lineHeight: "1.2",
                  letterSpacing: "0px",
                }}
              >
                {category.title}
              </h3>
              <p
                className="break-words [overflow-wrap:anywhere] font-poppins font-normal capitalize text-[#656565]"
                style={{
                  fontSize: "clamp(15px, 0.4vw + 13px, 18px)",
                  lineHeight: "1.2",
                  letterSpacing: "0px",
                }}
              >
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EhsSection;