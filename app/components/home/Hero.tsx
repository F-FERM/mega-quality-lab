"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HERO_BG from "../../../public/images/hero.jpg";
import ACCREDITED_BADGE from "../../../public/images/accredited-badge.png";
import { Button } from "../common/Button";
import api from "@/lib/axios";

interface HeroData {
  heroTitleOne: string;
  heroTitleTwo: string;
  heroImage: string;
  heroTitleThree: string;
  heroDescription: string;
  heroDescriptionTwo: string;
  requestTestButtonText: string;
  requestTestButtonLink: string;
  exploreServicesButtonText: string;
  exploreServicesButtonLink: string;
}

const defaultData: HeroData = {
  heroTitleOne: "PRECISION TESTING",
  heroTitleTwo: "ENGINEERING ",
  heroTitleThree: "CONFIDENCE.",
  heroDescription:
    "Independent Soil, Construction Material And Building Testing Services For Projects Across The UAE.",
  heroDescriptionTwo:
    "Mega Quality Laboratory Provides Professional Testing And Investigation Services For Soil, Concrete, Steel, Cement, Aggregates And Other Construction Materials Supported By Experienced Technical Professionals And A Quality System Aligned With ISO/IEC 17025:2017.",
  requestTestButtonText: "Request a Test",
  requestTestButtonLink: "/request-test",
  heroImage: HERO_BG.src,
  exploreServicesButtonText: "Explore Services",
  exploreServicesButtonLink: "/services",
};

/*
  LAYOUT NOTES
  ------------
  - Everything is in normal document flow (no translate-y hacks, no
    absolute inset-0 centering), so the section grows with its content
    and nothing can overlap on any screen height/width.
  - The badge sits centered ABOVE the text on every screen below 2xl
    (this covers phones, tablets, and all MacBooks: 13", 14", 15").
  - Only at 2xl (1536px+) is there enough room to move the badge to the
    left of the heading. Its left offset is computed from the viewport
    center so it can never run into the 858px text column.
*/

const SECTION_PADDING =
  "px-4 pb-14 pt-[100px] sm:px-6 sm:pb-16 sm:pt-[110px] md:pb-20 md:pt-[125px] xl:pb-24 xl:pt-[135px] 2xl:min-h-[976px] 2xl:justify-center 2xl:pb-0 2xl:pt-0";

// Shared by the real badge and the skeleton badge so they always match.
const BADGE_SIZE =
  "h-[125px] w-[125px] xs:h-[140px] xs:w-[140px] sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px] xl:h-[190px] xl:w-[190px] 2xl:h-[237px] 2xl:w-[237px]";

// In flow + centered below 2xl, absolutely placed to the left at 2xl.
// 429 = half of the 858px text column, 237 = badge size, 40 = gap.
const BADGE_POSITION =
  "relative mb-5 sm:mb-6 xl:mb-8 2xl:absolute 2xl:mb-0 2xl:top-[165px] 2xl:left-[max(24px,min(217px,calc(50%-429px-237px-40px)))]";

// ================= SKELETON =================

function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      <div
        className={`relative z-10 flex w-full flex-col items-center ${SECTION_PADDING}`}
      >
        {/* Badge skeleton */}
        <div
          className={`${BADGE_POSITION} ${BADGE_SIZE} flex items-center justify-center p-2`}
        >
          <div className="h-full w-full animate-pulse rounded-full border-2 border-dashed border-[#FFD400]/60 bg-gray-300/50" />
        </div>

        <div className="flex w-full max-w-[858px] flex-col items-center gap-4">
          <div className="h-9 w-3/4 animate-pulse rounded-md bg-gray-300 sm:h-12 md:h-14 xl:h-16 2xl:h-20" />
          <div className="h-9 w-1/2 animate-pulse rounded-md bg-gray-300 sm:h-12 md:h-14 xl:h-16 2xl:h-20" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded-md bg-gray-300 sm:h-5" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-300 sm:h-5" />

          <div className="mt-6 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-300 sm:w-40" />
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-300 sm:w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= MAIN =================

export default function Hero() {
  const [data, setData] = useState<HeroData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get<HeroData>("home");
        // Guard against the API returning an empty/missing heroImage,
        // which would otherwise crash next/image (invalid src="")
        setData({
          ...defaultData,
          ...res.data,
          heroImage: res.data?.heroImage?.trim()
            ? res.data.heroImage
            : defaultData.heroImage,
        });
      } catch (err) {
        console.error("Failed to fetch hero section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  const {
    heroTitleOne,
    heroTitleTwo,
    heroTitleThree,
    heroDescription,
    heroDescriptionTwo,
    requestTestButtonText,
    requestTestButtonLink,
    exploreServicesButtonText,
    exploreServicesButtonLink,
    heroImage,
  } = data;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <Image
        src={heroImage}
        alt="Construction site rebar and formwork under inspection"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.4104) 0%, rgba(0, 0, 0, 0.66) 100%)",
        }}
      />

      {/* Content wrapper — full width, in flow, positioned so the 2xl
          badge can anchor to the section edges. */}
      <div
        className={`relative z-10 flex w-full flex-col items-center ${SECTION_PADDING}`}
      >
        {/* ACCREDITATION BADGE */}
        <div
          className={`${BADGE_POSITION} ${BADGE_SIZE} z-20 flex items-center justify-center p-2 xl:p-3 2xl:p-4`}
        >
          <Image
            src={ACCREDITED_BADGE}
            alt="EIAC Accredited ISO/IEC 17025:2017"
            width={198}
            height={198}
            priority
            className="h-full w-full animate-[spin_18s_linear_infinite] object-contain"
          />
        </div>

        {/* TEXT COLUMN */}
        <div className="flex w-full max-w-[858px] flex-col items-center gap-3 text-center sm:gap-4 md:gap-5 2xl:gap-6">
          {/* Main heading */}
          <h1
            className="
              text-center font-poppins font-bold uppercase
              text-[26px] leading-[112%] text-white
              xs:text-[30px]
              sm:text-[38px]
              md:text-[48px]
              lg:text-[54px]
              xl:text-[64px]
              2xl:text-[80px]
            "
            style={{ letterSpacing: "0px", maxWidth: "858px" }}
          >
            {heroTitleOne}.
            <br />
            <span style={{ color: "#FFA7DC" }}>{heroTitleTwo.trim()}</span>
            <br />
            {heroTitleThree}
          </h1>

          {/* First description */}
          <p
            className="
              text-center font-poppins font-medium capitalize
              text-sm leading-[120%] text-white
              xs:text-base
              sm:text-lg
              md:text-xl
              2xl:text-[22px]
            "
            style={{ letterSpacing: "0px" }}
          >
            {heroDescription}
          </p>

          {/* Second description */}
          <p
            className="
              text-center font-poppins font-normal capitalize
              text-xs leading-[120%]
              xs:text-sm
              sm:text-base
              2xl:text-[18px]
            "
            style={{
              letterSpacing: "0px",
              color: "#E8E8E8",
              maxWidth: "804px",
            }}
          >
            {heroDescriptionTwo}
          </p>

          {/* Buttons */}
          <div className="flex w-full flex-col items-center gap-3 xs:gap-4 sm:w-auto sm:flex-row sm:justify-center">
            <Link href={requestTestButtonLink} className="w-full sm:w-auto">
              <Button
                type="button"
                variant="navbarCta"
                className="w-full sm:w-auto"
              >
                {requestTestButtonText}
              </Button>
            </Link>

            <Link href={exploreServicesButtonLink} className="w-full sm:w-auto">
              <Button
                type="button"
                variant="heroCta"
                className="w-full sm:w-auto"
              >
                {exploreServicesButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}