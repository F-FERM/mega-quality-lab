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

interface StatItem {
  _id?: string;
  value: string;
  label: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface AboutData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  aboutImage: string;
  imageOne: string;
  imageOneAlt: string;
  imageTwo: string;
  imageTwoAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  featureOne: string;
  featureTwo: string;
  featureThree: string;
  featureInlineLinks: InlineLink[];
  stats: StatItem[];
  isActive: boolean;
}

// Import fallback image
import ABOUT_IMG from "../../../public/images/lab1.jpg";

const defaultData: AboutData = {
  sectionTitle: "About The Laboratory",
  heroTitle: "TESTING THAT",
  heroTitleTwo: "SUPPORTS BETTER",
  heroTitleThree: "CONSTRUCTION",
  aboutImage: "",
  imageOne: "",
  imageOneAlt: "Mega Quality Laboratory - Testing Equipment",
  imageTwo: "",
  imageTwoAlt: "Mega Quality Laboratory - Soil Testing",
  heroInlineLinks: [],
  description: "Mega Quality Laboratory For Soil And Building Materials Testing Is A Professionally Competent And Independent Laboratory Serving Construction And Infrastructure Requirements In The UAE.",
  descriptionInlineLinks: [],
  featureOne: "",
  featureTwo: "",
  featureThree: "",
  featureInlineLinks: [],
  stats: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function AboutLabSecondarySkeleton() {
  return (
    <section className="w-full bg-white px-4 pb-16 pt-[100px] sm:px-6 sm:pb-20 sm:pt-[130px] md:pb-24 md:pt-[150px] xl:pb-28 xl:pt-[250px]">
      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-5">
        {/* Left - Content Skeleton */}
        <div className="flex w-full flex-col">
          <div className="mb-6 flex w-full max-w-[340px] items-center gap-2.5" style={{ height: "36px" }}>
            <span className="h-px w-8 shrink-0 bg-[#67003E]" />
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mb-6">
            <div className="h-14 w-3/4 animate-pulse rounded bg-gray-200 sm:h-16 md:h-20" />
            <div className="mt-2 h-14 w-2/3 animate-pulse rounded bg-gray-200 sm:h-16 md:h-20" />
            <div className="mt-2 h-14 w-1/2 animate-pulse rounded bg-gray-200 sm:h-16 md:h-20" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Right - Image Skeleton */}
        <div className="relative w-full max-w-[721px] p-2.5">
          <div
            className="relative w-full overflow-hidden bg-gray-200 animate-pulse"
            style={{ aspectRatio: "701 / 550", borderRadius: "30px" }}
          />
        </div>
      </div>
    </section>
  );
}

function AboutLabSecondary() {
  const [data, setData] = useState<AboutData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await api.get("/home-about");

        if (res.data && typeof res.data === "object") {
          // Check if response is array or single object
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (responseData.about && Array.isArray(responseData.about) && responseData.about.length > 0) {
            responseData = responseData.about[0];
          }

          const aboutData: AboutData = {
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroTitleThree: responseData.heroTitleThree || defaultData.heroTitleThree,
            aboutImage: responseData.aboutImage || "",
            imageOne: responseData.imageOne || "",
            imageOneAlt: responseData.imageOneAlt || defaultData.imageOneAlt,
            imageTwo: responseData.imageTwo || "",
            imageTwoAlt: responseData.imageTwoAlt || defaultData.imageTwoAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            description: responseData.description || defaultData.description,
            descriptionInlineLinks: responseData.descriptionInlineLinks || [],
            featureOne: responseData.featureOne || "",
            featureTwo: responseData.featureTwo || "",
            featureThree: responseData.featureThree || "",
            featureInlineLinks: responseData.featureInlineLinks || [],
            stats: (responseData.stats || [])
              .sort((a: StatItem, b: StatItem) => (a.order || 0) - (b.order || 0)),
            isActive: responseData.isActive ?? true,
          };

          setData(aboutData);
        }
      } catch (err) {
        console.error("Failed to fetch About section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return <AboutLabSecondarySkeleton />;
  }

  const {
    sectionTitle,
    heroTitle,
    heroTitleTwo,
    heroTitleThree,
    aboutImage,
    imageOne,
    imageOneAlt,
    description,
  } = data;

  // Determine which image to use - prioritize aboutImage, then imageOne, then fallback
  const imageSrc = aboutImage 
    ? resolveImage(aboutImage) 
    : imageOne 
      ? resolveImage(imageOne) 
      : ABOUT_IMG;

  // Format hero title with proper line breaks
  const formatHeroTitle = () => {
    return (
      <>
        {heroTitle}
        <br />
        <span className="text-[#FFA8D9]">{heroTitleTwo}</span>
        <br />
        {heroTitleThree}
      </>
    );
  };

  return (
    <section className="w-full bg-white px-4 pb-16 pt-[100px] sm:px-6 sm:pb-20 sm:pt-[130px] md:pb-24 md:pt-[150px] xl:pb-28 xl:pt-[250px]">
      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-5">
        {/* =====================================================
            LEFT — Content
        ====================================================== */}
        <div className="flex w-full flex-col">
          {/* Eyebrow */}
          <div className="mb-4 flex w-full max-w-[340px] items-center gap-2.5 md:mb-6" style={{ minHeight: "36px" }}>
            <span className="h-px w-8 shrink-0 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize text-[#67003E]"
              style={{
                fontSize: "clamp(16px, 1.5vw + 10px, 24px)",
                lineHeight: "100%",
                letterSpacing: "0px",
              }}
            >
              {sectionTitle}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-4 w-full max-w-[722px] font-poppins font-bold text-black md:mb-6"
            style={{
              fontSize: "clamp(32px, 4vw + 12px, 70px)",
              lineHeight: "1.15",
              letterSpacing: "-0.02em",
            }}
          >
            {formatHeroTitle()}
          </h2>

          {/* Paragraph */}
          <p
            className="w-full max-w-[722px] font-poppins font-normal text-[#45464D]"
            style={{
              fontSize: "clamp(16px, 0.6vw + 14px, 22px)",
              lineHeight: "1.4",
              letterSpacing: "0px",
            }}
          >
            {description}
          </p>
        </div>

        {/* =====================================================
            RIGHT — Image
        ====================================================== */}
        <div className="relative w-full max-w-[721px] p-2.5">
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "701 / 550",
              borderRadius: "30px",
            }}
          >
            <Image
              src={imageSrc}
              alt={imageOneAlt || "Mega Quality Laboratory"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 50vw"
              unoptimized={typeof imageSrc === "string" && imageSrc.startsWith("http")}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutLabSecondary;