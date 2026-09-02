"use client";

import { useEffect, useState, useRef } from "react";
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

interface WhyFeature {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface WhyMegaData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  whyFeatures: WhyFeature[];
  ctaTitle: string;
  ctaDescription: string;
  ctaHeadingOne: string;
  ctaHeadingTwo: string;
  requestTestButtonText: string;
  requestTestButtonLink: string;
  talkToEngineerButtonText: string;
  talkToEngineerButtonLink: string;
  ctaInlineLinks: InlineLink[];
  locations: any[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: any[];
  isActive: boolean;
}

// Import fallback images
import ICON_INDEPENDENT from "../../../public/images/why1.png";
import ICON_ACCREDITED from "../../../public/images/why2.png";
import ICON_EXPERTISE from "../../../public/images/why3.png";
import ICON_WIDE from "../../../public/images/why4.png";
import ICON_CONFIDENTIAL from "../../../public/images/why5.png";

const FALLBACK_ICONS = [
  ICON_INDEPENDENT,
  ICON_ACCREDITED,
  ICON_EXPERTISE,
  ICON_WIDE,
  ICON_CONFIDENTIAL,
];

const defaultData: WhyMegaData = {
  sectionTitle: "Why Mega",
  heroTitle: "WHY ENGINEERING TEAMS CHOOSE",
  heroTitleTwo: "MEGA",
  heroImage: "",
  heroImageAlt: "Why Engineering Teams Choose Mega",
  heroInlineLinks: [],
  whyFeatures: [
    { title: "Independent Testing", description: "", icon: "", order: 0, inlineLinks: [] },
    { title: "Accredited Quality System", description: "", icon: "", order: 1, inlineLinks: [] },
    { title: "Technical Expertise", description: "", icon: "", order: 2, inlineLinks: [] },
    { title: "Wide Testing Capability", description: "", icon: "", order: 3, inlineLinks: [] },
    { title: "Confidential & Impartial", description: "", icon: "", order: 4, inlineLinks: [] },
  ],
  ctaTitle: "",
  ctaDescription: "",
  ctaHeadingOne: "",
  ctaHeadingTwo: "",
  requestTestButtonText: "",
  requestTestButtonLink: "",
  talkToEngineerButtonText: "",
  talkToEngineerButtonLink: "",
  ctaInlineLinks: [],
  locations: [],
  phoneLabel: "",
  phoneNumber: "",
  phoneInlineLinks: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function WhyMegaSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-32" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-8 sm:mb-10 md:mb-14">
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200 sm:h-11 md:h-14 xl:h-16" />
        </div>

        {/* Cards Skeleton */}
        <div className="mx-auto flex w-full max-w-[1464px] flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex shrink-0 grow basis-[140px] flex-col rounded-[20px] border border-[#E4E4E4] bg-white sm:rounded-[24px] lg:rounded-[30px]"
              style={{
                maxWidth: "286px",
                aspectRatio: "286 / 196",
                padding: "clamp(20px, 4vw, 45px) clamp(16px, 3vw, 33px)",
                gap: "10px",
              }}
            >
              <div
                className="relative flex shrink-0 items-center justify-center rounded-full border border-dashed border-[#D4A017] animate-pulse bg-gray-200"
                style={{ width: "clamp(44px, 6vw, 63px)", height: "clamp(44px, 6vw, 63px)" }}
              />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMega() {
  const [data, setData] = useState<WhyMegaData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Delayed state: shadow + title linger for 3s after mouse leaves.
  // Each card tracks its own state independently.
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({});
  const hideTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Transient border: appears the instant hover starts, then fades
  // back out on its own after a short beat — even while still hovering.
  const [borderVisible, setBorderVisible] = useState<Record<number, boolean>>({});
  const borderTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const handleCardEnter = (index: number) => {
    // Border: show immediately, then schedule its own fade-out
    if (borderTimeouts.current[index]) {
      clearTimeout(borderTimeouts.current[index]);
      delete borderTimeouts.current[index];
    }
    setBorderVisible((prev) => ({ ...prev, [index]: true }));

    borderTimeouts.current[index] = setTimeout(() => {
      setBorderVisible((prev) => ({ ...prev, [index]: false }));
      delete borderTimeouts.current[index];
    }, 400);

    // Shadow + title: activate immediately, cancel any pending revert
    if (hideTimeouts.current[index]) {
      clearTimeout(hideTimeouts.current[index]);
      delete hideTimeouts.current[index];
    }
    setActiveCards((prev) => ({ ...prev, [index]: true }));
  };

  const handleCardLeave = (index: number) => {
    // Border: cancel any pending fade timer and hide immediately
    if (borderTimeouts.current[index]) {
      clearTimeout(borderTimeouts.current[index]);
      delete borderTimeouts.current[index];
    }
    setBorderVisible((prev) => ({ ...prev, [index]: false }));

    // Shadow + title: keep hovered look for 3s after mouse actually
    // leaves — independent of any other card being hovered meanwhile
    hideTimeouts.current[index] = setTimeout(() => {
      setActiveCards((prev) => ({ ...prev, [index]: false }));
      delete hideTimeouts.current[index];
    }, 3000);
  };

  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      Object.values(hideTimeouts.current).forEach(clearTimeout);
      Object.values(borderTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const fetchWhyMegaData = async () => {
      try {
        const res = await api.get("/home-why-mega");

        if (res.data && typeof res.data === "object") {
          // Check if response is array or single object
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (
            responseData.whyMega &&
            Array.isArray(responseData.whyMega) &&
            responseData.whyMega.length > 0
          ) {
            responseData = responseData.whyMega[0];
          }

          // Sort features by order
          const sortedFeatures = (responseData.whyFeatures || []).sort(
            (a: WhyFeature, b: WhyFeature) => (a.order || 0) - (b.order || 0)
          );

          const whyData: WhyMegaData = {
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            whyFeatures: sortedFeatures,
            ctaTitle: responseData.ctaTitle || "",
            ctaDescription: responseData.ctaDescription || "",
            ctaHeadingOne: responseData.ctaHeadingOne || "",
            ctaHeadingTwo: responseData.ctaHeadingTwo || "",
            requestTestButtonText: responseData.requestTestButtonText || "",
            requestTestButtonLink: responseData.requestTestButtonLink || "",
            talkToEngineerButtonText: responseData.talkToEngineerButtonText || "",
            talkToEngineerButtonLink: responseData.talkToEngineerButtonLink || "",
            ctaInlineLinks: responseData.ctaInlineLinks || [],
            locations: responseData.locations || [],
            phoneLabel: responseData.phoneLabel || "",
            phoneNumber: responseData.phoneNumber || "",
            phoneInlineLinks: responseData.phoneInlineLinks || [],
            isActive: responseData.isActive ?? true,
          };

          setData(whyData);
        }
      } catch (err) {
        console.error("Failed to fetch Why Mega section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhyMegaData();
  }, []);

  if (isLoading) {
    return <WhyMegaSkeleton />;
  }

  const { sectionTitle, whyFeatures } = data;

  // Map features with resolved icons
  const featuresWithIcons = whyFeatures.map((feature, index) => {
    let iconSrc;

    if (feature.icon && feature.icon.trim() !== "") {
      // If icon is a URL path, resolve it
      iconSrc = resolveImage(feature.icon);
    } else {
      // Use fallback icon
      iconSrc = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
    }

    return {
      ...feature,
      iconSrc,
    };
  });

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <span className="font-poppins font-normal capitalize text-[#67003E] text-lg sm:text-xl md:text-2xl leading-none">
            {sectionTitle}
          </span>
        </div>

        {/* Heading */}
        <h2 className="mb-8 max-w-[863px] font-poppins font-bold uppercase leading-[112%] text-black text-[26px] sm:mb-10 sm:text-[36px] md:mb-14 md:text-[44px] xl:text-[60px]">
          Why Engineering Teams Choose <span className="text-[#FFA8D9]">Mega</span>
        </h2>

        {/* Cards */}
        <div className="mx-auto flex w-full max-w-[1464px] flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {featuresWithIcons.map((feature, index) => {
            const isDelayedActive = !!activeCards[index]; // shadow + title
            const isBorderVisible = !!borderVisible[index]; // transient border

            return (
              <div
                key={feature._id || feature.title}
                onMouseEnter={() => handleCardEnter(index)}
                onMouseLeave={() => handleCardLeave(index)}
                className="flex shrink-0 grow basis-[140px] cursor-pointer flex-col rounded-[20px] border bg-white transition-[box-shadow,border-color] duration-300 ease-out sm:rounded-[24px] lg:rounded-[30px]"
                style={{
                  maxWidth: "286px",
                  aspectRatio: "286 / 196",
                  padding: "clamp(20px, 4vw, 45px) clamp(16px, 3vw, 33px)",
                  gap: "10px",
                  borderColor: isBorderVisible ? "#D9D9D9" : "#D9D9D9",
                     borderWidth: isBorderVisible ? "2px" : "1px",
                boxShadow: isDelayedActive
  ? "0 0 10px rgba(252, 1, 152, 0.35)"
  : "0 0 0 rgba(252, 1, 152, 0)",
                }} 
              >
                {/* Icon */}
                <div
                  className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-[#D4A017] bg-white"
                  style={{
                    width: "clamp(44px, 6vw, 63px)",
                    height: "clamp(44px, 6vw, 63px)",
                    borderWidth: "1px",
                  }}
                >
                  <Image
                    src={feature.iconSrc}
                    alt={feature.title}
                    fill
                    className="object-contain p-1.5"
                    sizes="63px"
                    unoptimized={typeof feature.iconSrc === "string" && feature.iconSrc.startsWith("http")}
                  />
                </div>

                {/* Title */}
                <h3
                  className="mt-2 font-poppins font-semibold uppercase text-black transition-opacity duration-300 ease-out"
                  style={{
                    fontSize: "clamp(13px, 1.3vw, 16px)",
                    lineHeight: "120%",
                    opacity: isDelayedActive ? 1 : 0,
                  }}
                >
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyMega;