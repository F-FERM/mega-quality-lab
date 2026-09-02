"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import CONTACT_IMAGE from "../../../public/images/contact.jpg";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface LocationCard {
  _id?: string;
  number: string;
  title: string;
  address: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ContactPageData {
  _id?: string;
  pageTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  dubaiLocation: string;
  rasAlKhaimahLocation: string;
  directLine: string;
  directLineLabel: string;
  contactInlineLinks: InlineLink[];
  getInTouchTitle: string;
  getInTouchHeadingOne: string;
  getInTouchHeadingTwo: string;
  getInTouchDescription: string;
  locationCards: LocationCard[];
  isActive: boolean;
}

// ================= FALLBACK =================

const defaultData: ContactPageData = {
  pageTitle: "Contact Mega Quality Laboratory",
  heroTitle: "LET'S TALK ABOUT YOUR",
  heroTitleTwo: "PROJECT.",
  heroDescription:
    "From Soil Investigation To Construction Material Testing, Connect With Our Technical Team To Discuss Your Project Requirements And Laboratory Testing Needs.",
  heroImage: "",
  heroImageAlt: "Contact Mega Quality Laboratory",
  heroInlineLinks: [],
  dubaiLocation: "United Arab Emirates",
  rasAlKhaimahLocation: "United Arab Emirates",
  directLine: "+971 52 652 3220",
  directLineLabel: "DIRECT LINE",
  contactInlineLinks: [],
  getInTouchTitle: "GET IN TOUCH",
  getInTouchHeadingOne: "TELL US WHAT YOU NEED",
  getInTouchHeadingTwo: "TESTED.",
  getInTouchDescription: "Send Your Project Details And Our Team Can Help Direct Your Enquiry To The Appropriate Testing Or Investigation Service.",
  locationCards: [
    { number: "01", title: "DUBAI", address: "Plot 284-242, Warehouse 3, Al Tayy, Dubai UAE", icon: "fa-solid fa-location-dot", order: 0, inlineLinks: [] },
    { number: "02", title: "RAK", address: "Ras Al Khaimah, United Arab Emirates", icon: "fa-solid fa-location-dot", order: 1, inlineLinks: [] },
    { number: "03", title: "CALL", address: "+971 52 652 3220", icon: "fa-solid fa-phone", order: 2, inlineLinks: [] },
  ],
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

// ================= SKELETON =================

function ContactSectionSkeleton() {
  return (
    <section className="w-full bg-white px-4 pb-12 pt-[90px] sm:px-6 sm:pb-16 sm:pt-[120px] md:pb-24 md:pt-[180px] xl:pb-28 xl:pt-[250px]">
      <div
        className="mx-auto flex w-full flex-col items-start gap-8 xl:flex-row xl:gap-5"
        style={{ maxWidth: "1464px" }}
      >
        <div className="flex w-full flex-col justify-center xl:max-w-[722px]">
          <div className="flex w-full flex-col gap-5 sm:gap-6 lg:gap-[26px]">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="h-px w-8 bg-[#67003E] sm:w-12" />
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-48" />
              </div>
              <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14" />
              <div className="mt-2 h-10 w-1/2 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14" />
            </div>
            <div className="h-5 w-full animate-pulse rounded bg-gray-200 sm:h-6" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-gray-200 sm:h-6" />
            <div className="flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-10 xl:flex-nowrap xl:gap-x-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex shrink-0 flex-col gap-2">
                  <span className="h-px w-full bg-[#585858]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-20" />
                  <div className="h-7 w-28 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative w-full shrink-0 xl:max-w-[722px]">
          <div
            className="relative w-full overflow-hidden rounded-[20px] bg-gray-200 animate-pulse sm:rounded-[24px] lg:rounded-[30px]"
            style={{ aspectRatio: "722 / 494" }}
          />
        </div>
      </div>
    </section>
  );
}

// ================= MAIN COMPONENT =================

function ContactSection() {
  const [data, setData] = useState<ContactPageData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/contact/page");
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
            pageTitle: responseData.pageTitle || defaultData.pageTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroDescription: responseData.heroDescription || defaultData.heroDescription,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            dubaiLocation: responseData.dubaiLocation || defaultData.dubaiLocation,
            rasAlKhaimahLocation: responseData.rasAlKhaimahLocation || defaultData.rasAlKhaimahLocation,
            directLine: responseData.directLine || defaultData.directLine,
            directLineLabel: responseData.directLineLabel || defaultData.directLineLabel,
            contactInlineLinks: responseData.contactInlineLinks || [],
            getInTouchTitle: responseData.getInTouchTitle || defaultData.getInTouchTitle,
            getInTouchHeadingOne: responseData.getInTouchHeadingOne || defaultData.getInTouchHeadingOne,
            getInTouchHeadingTwo: responseData.getInTouchHeadingTwo || defaultData.getInTouchHeadingTwo,
            getInTouchDescription: responseData.getInTouchDescription || defaultData.getInTouchDescription,
            locationCards: responseData.locationCards || defaultData.locationCards,
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Contact Page:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <ContactSectionSkeleton />;
  }

  const resolvedImage = resolveImage(data.heroImage);
  const isRemoteImage = resolvedImage.startsWith("http");

  return (
    <section className="w-full bg-white px-4 pb-12 pt-[90px] sm:px-6 sm:pb-16 sm:pt-[120px] md:pb-24 md:pt-[180px] xl:pb-28 xl:pt-[250px]">
      <div
        className="mx-auto flex w-full flex-col items-start gap-8 xl:flex-row xl:gap-5"
        style={{ maxWidth: "1464px" }}
      >
        {/* Left column */}
        <div className="flex w-full flex-col justify-center xl:max-w-[722px]">
          <div className="flex w-full flex-col gap-5 sm:gap-6 lg:gap-[26px]">
            {/* Eyebrow + heading block */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="h-px w-8 bg-[#67003E] sm:w-12" />
                <span
                  className="font-poppins font-normal capitalize text-[#67003E]"
                  style={{
                    maxWidth: "400px",
                    fontSize: "clamp(16px, 1.2vw + 10px, 24px)",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                  }}
                >
                  {data.pageTitle}
                </span>
              </div>

              <h2
                className="font-poppins font-bold uppercase text-black"
                style={{
                  fontSize: "clamp(30px, 5vw + 10px, 60px)",
                  lineHeight: "112%",
                  letterSpacing: "0px",
                }}
              >
                {data.heroTitle}
                <br />
                <span className="text-[#FFA8D9]">{data.heroTitleTwo}</span>
              </h2>
            </div>

            {/* Description */}
            <p
              className="font-poppins font-medium capitalize text-[#727272]"
              style={{
                maxWidth: "733px",
                fontSize: "clamp(16px, 1vw + 10px, 22px)",
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              {data.heroDescription}
            </p>

            {/* Location / phone stats — stays wrapped until xl (1280px),
                since 800–1280px didn't have enough width for both this
                block and the image side-by-side, which was forcing the
                phone number to overflow under the image */}
          {/* Location / phone stats — wraps at every screen size now (not just
    below xl). Forcing all three into one row was overflowing: Dubai
    (206px) + RAK (206px) + phone number (~230px) + gaps exceeds the
    722px column even on large screens, so nowrap was pushing the
    number out past the container and under the image. */}
<div className="flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-10 xl:gap-x-12">
  <div className="flex min-w-[140px] flex-1 flex-col" style={{ gap: "10px" }}>
    <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "clamp(14px, 0.8vw + 8px, 18px)", lineHeight: "100%", letterSpacing: "0px" }}
    >
      Dubai
    </span>
    <span
      className="font-poppins font-semibold capitalize text-black"
      style={{
        maxWidth: "206px",
        fontSize: "clamp(18px, 1.5vw + 10px, 26px)",
        lineHeight: "120%",
        letterSpacing: "0px",
      }}
    >
      {data.dubaiLocation}
    </span>
  </div>

  <div className="flex min-w-[140px] flex-1 flex-col" style={{ gap: "10px" }}>
    <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "clamp(14px, 0.8vw + 8px, 18px)", lineHeight: "100%", letterSpacing: "0px" }}
    >
      Ras Al Khaimah
    </span>
    <span
      className="font-poppins font-semibold capitalize text-black"
      style={{
        maxWidth: "206px",
        fontSize: "clamp(18px, 1.5vw + 10px, 26px)",
        lineHeight: "120%",
        letterSpacing: "0px",
      }}
    >
      {data.rasAlKhaimahLocation}
    </span>
  </div>

  <div className="flex min-w-[140px] flex-1 flex-col" style={{ gap: "10px" }}>
    <span className="h-px w-full bg-[#585858]" />
    <span
      className="font-poppins font-normal capitalize text-[#67003E]"
      style={{ fontSize: "clamp(14px, 0.8vw + 8px, 18px)", lineHeight: "100%", letterSpacing: "0px" }}
    >
      {data.directLineLabel}
    </span>
    <span
      className="font-poppins font-semibold capitalize text-black"
      style={{
        fontSize: "clamp(16px, 1.1vw + 8px, 22px)",
        lineHeight: "120%",
        letterSpacing: "0px",
      }}
    >
      {data.directLine}
    </span>
  </div>
</div>
          </div>
        </div>

        {/* Right column — image */}
        <div className="relative w-full shrink-0 xl:max-w-[722px]">
          <div
            className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[30px]"
            style={{ aspectRatio: "722 / 494" }}
          >
            <Image
              src={resolvedImage || CONTACT_IMAGE}
              alt={data.heroImageAlt || "Contact Mega Quality Laboratory"}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 722px"
              unoptimized={isRemoteImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;