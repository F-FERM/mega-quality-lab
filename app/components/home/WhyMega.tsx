"use client";

import { useEffect, useState, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import api from "@/lib/axios";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
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

// Fallback images
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

// ─────────────────────────────────────────────────────────
// Card design canvas (px). Everything inside a card is converted
// to cqw (relative to that card's own width) so the whole card
// — icon, number, title, radius — scales together at any size.
// ─────────────────────────────────────────────────────────
const CARD_W = 286;
const CARD_H = 196;
const u = (px: number) => `${((px / CARD_W) * 100).toFixed(3)}cqw`;
// same as u() but never smaller than minPx (keeps small text readable)
const uMin = (px: number, minPx: number) => `max(${minPx}px, ${u(px)})`;

const GOLD = "#C8A600";
const MAROON = "#67003E";

// How long the hover look stays after the mouse leaves (ms)
const LINGER_MS = 3000;
// How long the thicker border pulse lasts after hover starts (ms)
const BORDER_PULSE_MS = 400;

// Dashed ring: SVG so the dash is exactly 2px on / 2px off and the
// line stays 1px thick however much the icon scales.
function DashedRing({ inset, opacity = 1 }: { inset: string; opacity?: number }) {
  return (
    <div
      className="absolute rounded-full transition-all duration-300 ease-out motion-reduce:transition-none"
      style={{ inset, color: GOLD, opacity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <circle
          cx="50"
          cy="50"
          r="49.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────
function WhyMegaSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-32" />
        </div>

        <div className="mb-8 sm:mb-10 md:mb-14">
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200 sm:h-11 md:h-14 xl:h-16" />
        </div>

        <div className="mx-auto flex w-full max-w-[1464px] flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="relative w-full shrink-0 grow basis-[140px]"
              style={
                {
                  maxWidth: `${CARD_W}px`,
                  aspectRatio: `${CARD_W} / ${CARD_H}`,
                  containerType: "inline-size",
                } as React.CSSProperties
              }
            >
              <div
                className="h-full w-full border border-[#E4E4E4] bg-white"
                style={{ borderRadius: u(30) }}
              >
                <div
                  className="absolute animate-pulse rounded-full bg-gray-200"
                  style={{
                    left: u(34),
                    top: "50%",
                    width: u(105),
                    height: u(105),
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────
function WhyMega() {
  const [data, setData] = useState<WhyMegaData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Hover look (pink card, small icon, number, title). It turns on
  // instantly and stays for 3s after the mouse leaves.
  // Each card tracks its own state independently.
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({});
  const hideTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Transient thicker border: shows the moment hover starts, then fades
  // back to the thin border after a short beat — even while still hovering.
  const [borderVisible, setBorderVisible] = useState<Record<number, boolean>>({});
  const borderTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const handleCardEnter = (index: number) => {
    // Border pulse
    if (borderTimeouts.current[index]) {
      clearTimeout(borderTimeouts.current[index]);
      delete borderTimeouts.current[index];
    }
    setBorderVisible((prev) => ({ ...prev, [index]: true }));

    borderTimeouts.current[index] = setTimeout(() => {
      setBorderVisible((prev) => ({ ...prev, [index]: false }));
      delete borderTimeouts.current[index];
    }, BORDER_PULSE_MS);

    // Hover look: activate now, cancel any pending revert
    if (hideTimeouts.current[index]) {
      clearTimeout(hideTimeouts.current[index]);
      delete hideTimeouts.current[index];
    }
    setActiveCards((prev) => ({ ...prev, [index]: true }));
  };

  const handleCardLeave = (index: number) => {
    // Border: cancel pending fade timer and hide immediately
    if (borderTimeouts.current[index]) {
      clearTimeout(borderTimeouts.current[index]);
      delete borderTimeouts.current[index];
    }
    setBorderVisible((prev) => ({ ...prev, [index]: false }));

    // Hover look: keep it for 3s after the mouse actually leaves
    if (hideTimeouts.current[index]) clearTimeout(hideTimeouts.current[index]);
    hideTimeouts.current[index] = setTimeout(() => {
      setActiveCards((prev) => ({ ...prev, [index]: false }));
      delete hideTimeouts.current[index];
    }, LINGER_MS);
  };

  // Clean up pending timers on unmount
  useEffect(() => {
    const hide = hideTimeouts.current;
    const border = borderTimeouts.current;
    return () => {
      Object.values(hide).forEach(clearTimeout);
      Object.values(border).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const fetchWhyMegaData = async () => {
      try {
        const res = await api.get("/home-why-mega");

        if (res.data && typeof res.data === "object") {
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

          const sortedFeatures = [...(responseData.whyFeatures || [])].sort(
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

  const { sectionTitle } = data;
  const whyFeatures =
    data.whyFeatures.length > 0 ? data.whyFeatures : defaultData.whyFeatures;

  // Map features with resolved icons
  const featuresWithIcons = whyFeatures.map((feature, index) => {
    let iconSrc: string | StaticImageData;

    if (feature.icon && feature.icon.trim() !== "") {
      iconSrc = resolveImage(feature.icon);
    } else {
      iconSrc = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
    }

    return { ...feature, iconSrc };
  });

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <span className="font-poppins text-lg font-normal capitalize leading-none text-[#67003E] sm:text-xl md:text-2xl">
            {sectionTitle}
          </span>
        </div>

        {/* Heading */}
        <h2 className="mb-8 max-w-[863px] font-poppins text-[26px] font-bold uppercase leading-[112%] text-black sm:mb-10 sm:text-[36px] md:mb-14 md:text-[44px] xl:text-[60px]">
          Why Engineering Teams Choose <span className="text-[#FFA8D9]">Mega</span>
        </h2>

        {/* Cards */}
        <div className="mx-auto flex w-full max-w-[1464px] flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {featuresWithIcons.map((feature, index) => {
            const isActive = !!activeCards[index];
            const isBorderVisible = !!borderVisible[index];

            // Icon: 105px by default, 63px when active
            const iconSize = isActive ? 63 : 105;
            const iconCenterY = isActive ? 77 : CARD_H / 2;

            return (
              // Outer element = size container (cqw units refer to it)
              <div
                key={feature._id || `${feature.title}-${index}`}
                className="relative w-full shrink-0 grow basis-[140px]"
                style={
                  {
                    maxWidth: `${CARD_W}px`,
                    aspectRatio: `${CARD_W} / ${CARD_H}`,
                    containerType: "inline-size",
                  } as React.CSSProperties
                }
              >
                <div
                  tabIndex={0}
                  onMouseEnter={() => handleCardEnter(index)}
                  onMouseLeave={() => handleCardLeave(index)}
                  onFocus={() => handleCardEnter(index)}
                  onBlur={() => handleCardLeave(index)}
                  className="relative h-full w-full cursor-pointer overflow-hidden border outline-none transition-[box-shadow,border-color,background-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#FC0198] motion-reduce:transition-none"
                  style={{
                    borderRadius: u(30),
                    backgroundColor: isActive ? "#FFF0F9" : "#FFFFFF",
                    borderColor: isActive ? "#F9CDE7" : "#D9D9D9",
                    borderWidth: isBorderVisible ? "2px" : "1px",
                    boxShadow: isActive
                      ? "0 0 10px rgba(252, 1, 152, 0.35)"
                      : "0 0 0 rgba(252, 1, 152, 0)",
                  }}
                >
                  {/* Icon: moves up-left and shrinks 105 → 63 */}
                  <div
                    className="absolute transition-all duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      left: u(34),
                      top: u(iconCenterY),
                      width: u(iconSize),
                      height: u(iconSize),
                      transform: "translateY(-50%)",
                    }}
                  >
                    {/* outer dashed ring */}
                    <DashedRing inset="0%" />
                    {/* middle dashed ring */}
                    <DashedRing inset={isActive ? "4%" : "9%"} opacity={0.7} />
                    {/* the icon image */}
                    <div
                      className="absolute overflow-hidden rounded-full bg-transparent transition-all duration-300 ease-out motion-reduce:transition-none"
                      style={{ inset: isActive ? "9%" : "18%" }}
                    >
                      <Image
                        src={feature.iconSrc}
                        alt={feature.title}
                        fill
                        className="object-contain"
                        sizes="105px"
                        unoptimized={
                          typeof feature.iconSrc === "string" &&
                          feature.iconSrc.startsWith("http")
                        }
                      />
                    </div>
                  </div>

                  {/* Number: Poppins Medium 58px, #67003E, capitalize */}
                  <span
                    className="absolute font-poppins font-medium capitalize transition-opacity duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      right: u(52),
                      top: u(37),
                      fontSize: u(58),
                      lineHeight: "100%",
                      letterSpacing: 0,
                      color: MAROON,
                      opacity: isActive ? 1 : 0,
                    }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title: Poppins SemiBold 16px, uppercase */}
                  <h3
                    className="absolute font-poppins font-semibold uppercase text-black transition-opacity duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      left: u(34),
                      right: u(30),
                      bottom: u(45),
                      fontSize: uMin(16, 10),
                      lineHeight: "120%",
                      letterSpacing: 0,
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyMega;