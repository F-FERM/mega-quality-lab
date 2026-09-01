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
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-14">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        {/* Cards Skeleton */}
        <div className="mx-auto flex flex-wrap justify-center gap-4 lg:gap-6 xl:flex-nowrap xl:justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex shrink-0 flex-col rounded-[30px] border border-[#E4E4E4] bg-white"
              style={{
                width: "286px",
                height: "196px",
                paddingTop: "45px",
                paddingRight: "33px",
                paddingBottom: "45px",
                paddingLeft: "33px",
                gap: "10px",
              }}
            >
              <div className="relative flex shrink-0 items-center justify-center rounded-full border border-dashed border-[#D4A017] animate-pulse bg-gray-200" style={{ width: "63px", height: "63px" }} />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
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

  // Hover state: each card tracks its OWN active state independently,
  // so hovering a new card never cuts short another card's 3s linger
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({});
  // Tracks pending "revert" timers per card index
  const hideTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const handleCardEnter = (index: number) => {
    // Cancel any pending revert timer for this card and activate it immediately
    if (hideTimeouts.current[index]) {
      clearTimeout(hideTimeouts.current[index]);
      delete hideTimeouts.current[index];
    }
    setActiveCards((prev) => ({ ...prev, [index]: true }));
  };

  const handleCardLeave = (index: number) => {
    // Keep this card's hovered effect (pink shadow + visible title) for 3s
    // after the mouse actually leaves, then revert — independent of any
    // other card being hovered in the meantime
    hideTimeouts.current[index] = setTimeout(() => {
      setActiveCards((prev) => ({ ...prev, [index]: false }));
      delete hideTimeouts.current[index];
    }, 3000);
  };

  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      Object.values(hideTimeouts.current).forEach(clearTimeout);
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
          } else if (responseData.whyMega && Array.isArray(responseData.whyMega) && responseData.whyMega.length > 0) {
            responseData = responseData.whyMega[0];
          }

          // Sort features by order
          const sortedFeatures = (responseData.whyFeatures || [])
            .sort((a: WhyFeature, b: WhyFeature) => (a.order || 0) - (b.order || 0));

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

  const { sectionTitle, heroTitle, heroTitleTwo, whyFeatures } = data;

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
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <span
            className="font-poppins font-normal capitalize"
            style={{
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            {sectionTitle}
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-14
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
          style={{
            letterSpacing: "0px",
            width: "863px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          Why Engineering Teams Choose{" "}
          <span className="text-[#FFA8D9]">Mega</span>
        </h2>

        {/* Cards */}
        <div
          className="mx-auto flex flex-wrap justify-center gap-4 lg:gap-6 xl:flex-nowrap xl:justify-between"
          style={{
            width: "1464px",
            maxWidth: "100%",
            opacity: 1,
          }}
        >
          {featuresWithIcons.map((feature, index) => {
            const isHovered = !!activeCards[index];
            return (
              <div
                key={feature._id || feature.title}
                onMouseEnter={() => handleCardEnter(index)}
                onMouseLeave={() => handleCardLeave(index)}
                className="flex shrink-0 flex-col rounded-[30px] border border-[#E4E4E4] bg-white transition-shadow duration-300 ease-out"
                style={{
                  width: "286px",
                  height: "196px",
                  paddingTop: "45px",
                  paddingRight: "33px",
                  paddingBottom: "45px",
                  paddingLeft: "33px",
                  gap: "10px",
                  boxShadow: isHovered
                    ? "0 6px 20px rgba(255, 61, 158, 0.14)"
                    : "0 0 0 rgba(255, 61, 158, 0)",
                }}
              >
                {/* Icon */}
                <div
                  className="relative flex shrink-0 items-center justify-center rounded-full border border-dashed border-[#D4A017] bg-white overflow-hidden"
                  style={{
                    width: "63px",
                    height: "63px",
                    borderWidth: "1px",
                  }}
                >
                  <Image
                    src={feature.iconSrc}
                    alt={feature.title}
                    fill
                    className="object-contain p-1.5"
                    sizes="63px"
                    unoptimized={typeof feature.iconSrc === 'string' && feature.iconSrc.startsWith('http')}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-poppins font-semibold uppercase text-black mt-2 transition-opacity duration-300 ease-out"
                  style={{
                    fontSize: "16px",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                    opacity: isHovered ? 1 : 0,
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