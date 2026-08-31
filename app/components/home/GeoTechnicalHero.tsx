"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import HERO_BG from "../../../public/images/technicalgeo.png";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ServiceItem {
  _id?: string;
  title: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ProcessStep {
  _id?: string;
  number: string;
  label: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface GeotechnicalData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  services: ServiceItem[];
  processSteps: ProcessStep[];
  isActive: boolean;
}

const defaultData: GeotechnicalData = {
  sectionTitle: "Geotechnical Investigation",
  heroTitle: "Understand The Ground Before",
  heroTitleTwo: "You Build.",
  heroImage: "",
  heroImageAlt: "Geotechnical Investigation Services",
  heroInlineLinks: [],
  description:
    "Mega Quality Laboratory Provides Geotechnical Investigation, Soil And Rock Investigation, Hydrogeological And Related Surveying Services, Supported By Experienced Technical Personnel And Equipment.",
  descriptionInlineLinks: [],
  services: [
    "Geotechnical Investigation",
    "Soil & Rock Sampling",
    "Groundwater Investigation",
    "Geophysical Survey",
    "Hydrogeological Survey",
    "Petrological Survey",
    "In-Situ Testing",
    "Geotechnical Reporting",
  ].map((title, index) => ({
    title,
    order: index,
    inlineLinks: [],
  })),
  processSteps: [
    { number: "01", label: "Ground", order: 0, inlineLinks: [] },
    { number: "02", label: "Sample", order: 1, inlineLinks: [] },
    { number: "03", label: "Lab", order: 2, inlineLinks: [] },
    { number: "04", label: "Analysis", order: 3, inlineLinks: [] },
    { number: "05", label: "Report", order: 4, inlineLinks: [] },
  ],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function GeotechnicalSkeleton() {
  return (
    <section className="w-full">
      {/* Hero Skeleton */}
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[644px] w-full bg-gray-200 animate-pulse" />

        <div
          className="absolute inset-0 mx-auto flex w-full max-w-[1920px] items-center"
          style={{
            paddingTop: "55px",
            paddingRight: "612px",
            paddingBottom: "54px",
            paddingLeft: "228px",
          }}
        >
          <div
            className="flex w-full flex-col"
            style={{
              maxWidth: "1080px",
              gap: "15px",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-[#67003E]" />
              <div className="h-6 w-48 animate-pulse rounded bg-gray-300" />
            </div>
            <div className="h-12 w-3/4 animate-pulse rounded bg-gray-300" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-gray-300" />
            <div className="mt-3 flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[68px] w-[334px] animate-pulse rounded-[40px] bg-gray-300"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process Bar Skeleton */}
      <div
        className="w-full bg-[#67003E]"
        style={{
          paddingTop: "78px",
          paddingBottom: "78px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1756px] flex-wrap items-start justify-between gap-y-10 sm:flex-nowrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-1 items-center">
              <span className="h-px flex-1 bg-[#FC0198]/20" />
              <div className="flex flex-col items-center gap-3 px-2">
                <div className="h-[88px] w-[88px] animate-pulse rounded-full bg-[#FC0198]/20" />
                <div className="h-4 w-16 animate-pulse rounded bg-[#FC0198]/20" />
              </div>
              <span className="h-px flex-1 bg-[#FC0198]/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeotechnicalHero() {
  const [data, setData] = useState<GeotechnicalData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGeotechnicalData = async () => {
      try {
        const res = await api.get("/home-geotechnical");

        if (res.data && typeof res.data === "object") {
          // Handle different response formats
          let geotechnicalData = null;

          if (Array.isArray(res.data) && res.data.length > 0) {
            const activeItem = res.data.find((item: any) => item.isActive);
            geotechnicalData = activeItem || res.data[0];
          } else if (res.data && res.data.geotechnical && Array.isArray(res.data.geotechnical)) {
            const activeItem = res.data.geotechnical.find((item: any) => item.isActive);
            geotechnicalData = activeItem || res.data.geotechnical[0];
          } else if (res.data && res.data.sectionTitle) {
            geotechnicalData = res.data;
          }

          if (geotechnicalData) {
            // Map API response to component data
            const mappedData: GeotechnicalData = {
              _id: geotechnicalData._id,
              sectionTitle: geotechnicalData.sectionTitle || defaultData.sectionTitle,
              heroTitle: geotechnicalData.heroTitle || defaultData.heroTitle,
              heroTitleTwo: geotechnicalData.heroTitleTwo || defaultData.heroTitleTwo,
              heroImage: geotechnicalData.heroImage || "",
              heroImageAlt: geotechnicalData.heroImageAlt || defaultData.heroImageAlt,
              heroInlineLinks: geotechnicalData.heroInlineLinks || [],
              description: geotechnicalData.description || defaultData.description,
              descriptionInlineLinks: geotechnicalData.descriptionInlineLinks || [],
              services: (geotechnicalData.services || defaultData.services)
                .sort((a: ServiceItem, b: ServiceItem) => (a.order || 0) - (b.order || 0)),
              processSteps: (geotechnicalData.processSteps || defaultData.processSteps)
                .sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0)),
              isActive: geotechnicalData.isActive ?? true,
            };

            setData(mappedData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch geotechnical section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeotechnicalData();
  }, []);

  if (isLoading) {
    return <GeotechnicalSkeleton />;
  }

  const {
    sectionTitle,
    heroTitle,
    heroTitleTwo,
    heroImage,
    heroImageAlt,
    description,
    services,
    processSteps,
  } = data;

  // Determine which image to use
  const heroImageSrc = heroImage ? resolveImage(heroImage) : HERO_BG;

  // Get service titles for display
  const serviceTitles = services.map((service) => service.title);

 return (
    <section className="w-full">
      {/* =====================================================
          HERO — background image (absolute layer) + content in
          normal flow. Breakpoint pattern matches AboutLab:
          base → sm → md → lg → xl, ending at your spec values at xl.
      ====================================================== */}
      <div
        className="
          relative w-full overflow-hidden
          min-h-[420px]
          sm:min-h-[480px]
          md:min-h-[540px]
          lg:min-h-[600px]
          xl:min-h-[644px]
        "
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageSrc}
            alt={heroImageAlt || "Technician performing geotechnical fieldwork"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized={typeof heroImageSrc === 'string' && heroImageSrc.startsWith('http')}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,  rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.15) 50%, rgba(90,10,60,0.55) 75%, rgba(103,0,62,0.85) 100%)",
            }}
          />
        </div>

        {/* Content — normal flow so it can grow taller on small screens */}
        <div
          className="
            relative z-10 mx-auto flex w-full max-w-[1920px] items-center
            px-5 py-8
            sm:px-8 sm:py-10
            md:px-12 md:py-12
            lg:pl-16 lg:pr-24 lg:py-14
            xl:pl-[152px] xl:pr-[408px] xl:py-[55px]
            min-h-[inherit]
          "
        >
          <div className="flex w-full flex-col max-w-[1080px] gap-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-10 sm:w-12 bg-[#67003E] shrink-0" />
              <span
                className="font-poppins font-normal capitalize text-lg sm:text-xl md:text-2xl"
                style={{ lineHeight: "100%", letterSpacing: "0px", color: "#67003E" }}
              >
                {sectionTitle}
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                font-poppins font-bold uppercase leading-[112%] text-white
                text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[60px]
              "
              style={{ letterSpacing: "0px" }}
            >
              {heroTitle}{" "}
              <span className="text-[#FFA8D9]">{heroTitleTwo}</span>
            </h2>

            {/* Sub copy */}
            <p
              className="font-poppins font-medium capitalize w-full max-w-[870px] text-sm sm:text-base md:text-lg xl:text-[22px]"
              style={{ lineHeight: "120%", letterSpacing: "0px", color: "#BBBBBB" }}
            >
              {description}
            </p>

            {/* Service pills */}
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-3 sm:gap-4">
              {serviceTitles.map((service) => (
                <button
                  key={service}
                  type="button"
                  className="
                    group flex items-center justify-center rounded-[40px] border border-[#BABABA]
                    text-center transition-all duration-300
                    hover:border-[#FC0198] hover:bg-gray-600
                    w-full h-[52px] px-5 gap-[10px]
                    sm:w-[334px] sm:h-[68px] sm:px-8
                  "
                >
                  <span
                    className="
                      whitespace-nowrap font-poppins text-sm sm:text-[20px] font-normal capitalize
                      leading-none text-[#BABABA] transition-all duration-300
                      group-hover:text-[#FC0198]
                    "
                  >
                    {service}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROCESS BAR — same base → sm → md → xl ramp as AboutLab
      ====================================================== */}
      <div
        className="
          w-full bg-[#67003E]
          px-4
          pt-10 pb-10
          sm:pt-12 sm:pb-12
          md:pt-16 md:pb-16
          xl:pt-[78px] xl:pb-[78px]
        "
      >
        <div className="mx-auto flex w-full max-w-[1756px] flex-wrap items-start justify-between gap-y-8 sm:gap-y-10 sm:flex-nowrap">
          {processSteps.map((step) => (
            <div key={step.number} className="flex flex-1 items-center min-w-[70px]">
              <span className="h-px flex-1 bg-[#FC0198]/40" />
              <div className="flex flex-col items-center gap-2 sm:gap-3 px-1 sm:px-2">
                <div
                  className="flex items-center justify-center rounded-full border w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 xl:w-[88px] xl:h-[88px]"
                  style={{ borderColor: "#FC0198", borderWidth: "1px" }}
                >
                  <span
                    className="font-poppins font-normal capitalize text-base sm:text-lg xl:text-2xl"
                    style={{ lineHeight: "100%", letterSpacing: "0px", color: "#FC0198" }}
                  >
                    {step.number}
                  </span>
                </div>
                <span
                  className="font-poppins font-bold capitalize text-xs sm:text-sm xl:text-base whitespace-nowrap"
                  style={{ lineHeight: "100%", letterSpacing: "0px", color: "#FC0198" }}
                >
                  {step.label}
                </span>
              </div>
              <span className="h-px flex-1 bg-[#FC0198]/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GeotechnicalHero;