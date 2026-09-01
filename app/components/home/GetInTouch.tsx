"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "../common/Button";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface Location {
  _id?: string;
  name: string;
  address: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface PhoneInlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface WhyMegaData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  whyFeatures: any[];
  ctaTitle: string;
  ctaDescription: string;
  ctaHeadingOne: string;
  ctaHeadingTwo: string;
  requestTestButtonText: string;
  requestTestButtonLink: string;
  talkToEngineerButtonText: string;
  talkToEngineerButtonLink: string;
  ctaInlineLinks: InlineLink[];
  locations: Location[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: PhoneInlineLink[];
  isActive: boolean;
}

// Import fallback image
import CONTACT_BG_IMG from "../../../public/images/getintouch.jpg";

const defaultData: WhyMegaData = {
  sectionTitle: "Get In Touch",
  heroTitle: "Have A Project That Needs",
  heroTitleTwo: "Testing?",
  heroImage: "",
  heroImageAlt: "Get in touch with our technical team",
  heroInlineLinks: [],
  whyFeatures: [],
  ctaTitle: "Get In Touch",
  ctaDescription: "From Soil Investigation To Construction Material Testing, Connect With Our Technical Team.",
  ctaHeadingOne: "HAVE A PROJECT THAT NEEDS",
  ctaHeadingTwo: "TESTING?",
  requestTestButtonText: "REQUEST A TEST",
  requestTestButtonLink: "/request-a-test",
  talkToEngineerButtonText: "TALK TO AN ENGINEER",
  talkToEngineerButtonLink: "/contact",
  ctaInlineLinks: [],
  locations: [
    { name: "Dubai", address: "Dubai, United Arab Emirates", order: 0, inlineLinks: [] },
    { name: "Ras Al Khaimah", address: "Ras Al Khaimah, United Arab Emirates", order: 1, inlineLinks: [] },
  ],
  phoneLabel: "Phone",
  phoneNumber: "+971 52 652 3220",
  phoneInlineLinks: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function GetInTouchSkeleton() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[600px] w-full bg-gray-200 animate-pulse sm:h-[650px] md:h-[700px]" />
    </section>
  );
}

function GetInTouch() {
  const [data, setData] = useState<WhyMegaData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

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

          // Sort locations by order
          const sortedLocations = (responseData.locations || [])
            .sort((a: Location, b: Location) => (a.order || 0) - (b.order || 0));

          const whyData: WhyMegaData = {
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            whyFeatures: responseData.whyFeatures || [],
            ctaTitle: responseData.ctaTitle || defaultData.ctaTitle,
            ctaDescription: responseData.ctaDescription || defaultData.ctaDescription,
            ctaHeadingOne: responseData.ctaHeadingOne || defaultData.ctaHeadingOne,
            ctaHeadingTwo: responseData.ctaHeadingTwo || defaultData.ctaHeadingTwo,
            requestTestButtonText: responseData.requestTestButtonText || defaultData.requestTestButtonText,
            requestTestButtonLink: responseData.requestTestButtonLink || defaultData.requestTestButtonLink,
            talkToEngineerButtonText: responseData.talkToEngineerButtonText || defaultData.talkToEngineerButtonText,
            talkToEngineerButtonLink: responseData.talkToEngineerButtonLink || defaultData.talkToEngineerButtonLink,
            ctaInlineLinks: responseData.ctaInlineLinks || [],
            locations: sortedLocations.length > 0 ? sortedLocations : defaultData.locations,
            phoneLabel: responseData.phoneLabel || defaultData.phoneLabel,
            phoneNumber: responseData.phoneNumber || defaultData.phoneNumber,
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
    return <GetInTouchSkeleton />;
  }

  const {
    ctaTitle,
    ctaDescription,
    ctaHeadingOne,
    ctaHeadingTwo,
    requestTestButtonText,
    requestTestButtonLink,
    talkToEngineerButtonText,
    talkToEngineerButtonLink,
    locations,
    phoneLabel,
    phoneNumber,
    heroImage,
    heroImageAlt,
  } = data;

  // Determine which image to use
  const imageSrc = heroImage ? resolveImage(heroImage) : CONTACT_BG_IMG;

  // Combine locations with phone as a location item
  const locationItems = [
    ...locations.map((loc) => ({ label: loc.name, value: loc.address })),
    { label: phoneLabel, value: phoneNumber },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={heroImageAlt || "Get in touch with our technical team"}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized={typeof imageSrc === 'string' && imageSrc.startsWith('http')}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-[1464px] flex-col items-center px-4 py-20 sm:px-6 sm:py-24 md:py-28 xl:py-32">
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
            {ctaTitle}
          </span>
          <span className="h-px w-12 bg-[#67003E]" />
        </div>

        {/* Heading */}
        <h2
          className="
            mb-6
            text-center
            font-poppins
            font-bold
            uppercase
            leading-[112%]
            text-white
            text-[32px]
            sm:text-[40px]
            md:text-[48px]
            xl:text-[60px]
          "
          style={{
            letterSpacing: "0px",
            width: "1076px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          {ctaHeadingOne} <span className="text-[#FFA8D9]">{ctaHeadingTwo}</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mb-12
            max-w-[820px]
            text-center
            font-poppins
            font-medium
            capitalize
            text-lg
            sm:text-xl
            xl:text-[22px]
          "
          style={{
            lineHeight: "120%",
            letterSpacing: "0px",
            color: "#D2D2D2",
          }}
        >
          {ctaDescription}
        </p>

        {/* Buttons */}
        <div className="mb-16 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={requestTestButtonLink}>
            <Button variant="navbarCta">
              {requestTestButtonText}
            </Button>
          </Link>

          <Link href={talkToEngineerButtonLink}>
            <Button variant="heroCta">
              {talkToEngineerButtonText}
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full max-w-[1690px] bg-white/30 mt-8" />

        {/* Locations */}
        <div
          className="mx-auto flex w-full max-w-[1173px] flex-col items-center justify-between gap-8 sm:flex-row"
          style={{ gap: "41px" }}
        >
          {locationItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <span
                className="font-poppins font-normal capitalize"
                style={{
                  fontSize: "18px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#67003E",
                }}
              >
                {item.label}
              </span>

              <span
                className="mt-2 font-poppins font-semibold capitalize text-white"
                style={{
                  fontSize: "26px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GetInTouch;