"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ProcessStep {
  _id?: string;
  stepNumber: string;
  title: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ManagementProcessData {
  _id?: string;
  managementTitle: string;
  managementSubtitle: string;
  managementSubtitleTwo: string;
  managementSubtitleThree: string;
  managementDescription: string;
  managingDirectorName: string;
  managingDirectorTitle: string;
  managingDirectorImage: string;
  managingDirectorImageAlt: string;
  managementInlineLinks: InlineLink[];
  additionalInfo: string;
  additionalInfoInlineLinks: InlineLink[];
  processTitle: string;
  processSubtitle: string;
  processSteps: ProcessStep[];
  processInlineLinks: InlineLink[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Import fallback image
import MANAGER_FALLBACK_IMG from "../../../public/images/equipment3.jpg";

const defaultData: ManagementProcessData = {
  managementTitle: "Management",
  managementSubtitle: "EXPERIENCED",
  managementSubtitleTwo: "PEOPLE.",
  managementSubtitleThree: "RELIABLE RESULTS.",
  managementDescription: "Abdullah Mohammad Has Over 10 Years Of Experience In Geotechnical And Materials Testing Laboratory Operations, Including Quality-Control Activities Under ISO 17025:2017 And Management Of Major Projects In Dubai And Abu Dhabi.",
  managingDirectorName: "ABDULLAH MOHAMMAD",
  managingDirectorTitle: "MANAGING DIRECTOR",
  managingDirectorImage: "",
  managingDirectorImageAlt: "Abdullah Mohammad - Managing Director",
  managementInlineLinks: [],
  additionalInfo: "Additional Technical Personnel Profiles Available On Request.",
  additionalInfoInlineLinks: [],
  processTitle: "Testing Process",
  processSubtitle: "FROM FIELD INVESTIGATION TO FINAL REPORT",
  processSteps: [],
  processInlineLinks: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function ManagementSectionSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center lg:grid-cols-[574px_1fr]" style={{ gap: "20px" }}>
        {/* Left - Image Skeleton */}
        <div className="relative w-full overflow-hidden rounded-[30px]" style={{ maxWidth: "574px", height: "587px" }}>
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <div className="absolute inset-x-0 bottom-0 bg-[#7D7D7D] px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-300" />
            <div className="h-7 w-48 animate-pulse rounded bg-gray-300" />
          </div>
        </div>

        {/* Right - Content Skeleton */}
        <div className="flex w-full flex-col">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#67003E]" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
            <div className="mt-2 h-10 w-1/2 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
          </div>
          <div className="mb-2 space-y-2">
            <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

function ManagementSection() {
  const [data, setData] = useState<ManagementProcessData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManagementData = async () => {
      try {
        const res = await api.get("/home-management-process");

        if (res.data && typeof res.data === "object") {
          // Check if response is array or single object
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (responseData.managementProcess && Array.isArray(responseData.managementProcess) && responseData.managementProcess.length > 0) {
            responseData = responseData.managementProcess[0];
          }

          // Sort process steps by order
          const sortedSteps = (responseData.processSteps || [])
            .sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0));

          const managementData: ManagementProcessData = {
            _id: responseData._id,
            managementTitle: responseData.managementTitle || defaultData.managementTitle,
            managementSubtitle: responseData.managementSubtitle || defaultData.managementSubtitle,
            managementSubtitleTwo: responseData.managementSubtitleTwo || defaultData.managementSubtitleTwo,
            managementSubtitleThree: responseData.managementSubtitleThree || defaultData.managementSubtitleThree,
            managementDescription: responseData.managementDescription || defaultData.managementDescription,
            managingDirectorName: responseData.managingDirectorName || defaultData.managingDirectorName,
            managingDirectorTitle: responseData.managingDirectorTitle || defaultData.managingDirectorTitle,
            managingDirectorImage: responseData.managingDirectorImage || "",
            managingDirectorImageAlt: responseData.managingDirectorImageAlt || defaultData.managingDirectorImageAlt,
            managementInlineLinks: responseData.managementInlineLinks || [],
            additionalInfo: responseData.additionalInfo || defaultData.additionalInfo,
            additionalInfoInlineLinks: responseData.additionalInfoInlineLinks || [],
            processTitle: responseData.processTitle || defaultData.processTitle,
            processSubtitle: responseData.processSubtitle || defaultData.processSubtitle,
            processSteps: sortedSteps,
            processInlineLinks: responseData.processInlineLinks || [],
            isActive: responseData.isActive ?? true,
          };

          setData(managementData);
        }
      } catch (err) {
        console.error("Failed to fetch Management & Process section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagementData();
  }, []);

  if (isLoading) {
    return <ManagementSectionSkeleton />;
  }

  const {
    managementTitle,
    managementSubtitle,
    managementSubtitleTwo,
    managementSubtitleThree,
    managementDescription,
    managingDirectorName,
    managingDirectorTitle,
    managingDirectorImage,
    managingDirectorImageAlt,
    additionalInfo,
  } = data;

  // Determine which image to use
  const imageSrc = managingDirectorImage ? resolveImage(managingDirectorImage) : MANAGER_FALLBACK_IMG;

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div
        className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center lg:grid-cols-[574px_1fr]"
        style={{ gap: "20px" }}
      >
        {/* =====================================================
            LEFT — Photo card with overlay
            width: 574, height: 587, rounded-30
        ====================================================== */}
        <div
          className="relative w-full overflow-hidden rounded-[30px]"
          style={{
            maxWidth: "574px",
            height: "587px",
          }}
        >
          <Image
            src={imageSrc}
            alt={managingDirectorImageAlt || `${managingDirectorName} - ${managingDirectorTitle}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 574px"
            unoptimized={typeof imageSrc === 'string' && imageSrc.startsWith('http')}
          />

          {/* Bottom info bar — pinned flush to the card's bottom edge */}
          <div className="absolute inset-x-0 bottom-0 bg-[#7D7D7D] px-6 py-5 sm:px-8 sm:py-6">
            <span
              className="mb-1 block font-poppins font-semibold uppercase"
              style={{
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.5px",
                color: "#67003E",
              }}
            >
              {managingDirectorTitle}
            </span>
            <span
              className="block font-poppins font-bold uppercase text-white"
              style={{
                fontSize: "26px",
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              {managingDirectorName}
            </span>
          </div>
        </div>

        {/* =====================================================
            RIGHT — Content
        ====================================================== */}
        <div className="flex w-full flex-col">
          {/* Eyebrow */}
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize"
              style={{
                fontSize: "24px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#67003E",
              }}
            >
              {managementTitle}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="
              mb-2
              font-poppins
              font-bold
              uppercase
              leading-[112%]
              text-black
              text-[32px]
              sm:text-[40px]
              md:text-[48px]
              xl:text-[60px]
            "
            style={{ letterSpacing: "0px" }}
          >
            {managementSubtitle} <span className="text-[#FFA8D9]">{managementSubtitleTwo}</span>
            <br />
            {managementSubtitleThree}
          </h2>

          {/* Bio paragraph */}
          <p
            className="mb-2 font-poppins font-medium capitalize"
            style={{
              fontSize: "22px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#727272",
            }}
          >
            {managementDescription}
          </p>

          {/* Note */}
          <p
            className="font-poppins font-medium capitalize"
            style={{
              fontSize: "18px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#727272",
            }}
          >
            {additionalInfo}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ManagementSection;