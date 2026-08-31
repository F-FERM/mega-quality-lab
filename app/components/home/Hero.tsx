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

function HeroSkeleton() {
  return (
    <section
      className="
        relative w-full overflow-hidden bg-gray-100
        min-h-[600px]
        xs:min-h-[640px]
        sm:min-h-[680px]
        md:min-h-[760px]
        lg:min-h-[880px]
        xl:min-h-[976px]
      "
    >
      {/* Badge skeleton */}
      <div
        className="
          absolute z-20 flex items-center justify-center

          h-[65px] w-[65px]
          top-[90px] left-1/2
          -translate-x-1/2
          p-2

          xs:h-[75px] xs:w-[75px]
          xs:top-[95px]

          sm:h-[90px] sm:w-[90px]
          sm:top-[105px]

          md:h-[140px] md:w-[140px]
          md:top-[120px]

          lg:h-[150px] lg:w-[150px]
          lg:top-[130px]
          lg:left-1/2
          lg:-translate-x-1/2
          lg:p-3.5

          xl:h-[237px] xl:w-[237px]
          xl:top-[165px]
          xl:left-[217px]
          xl:p-4
        "
      >
        <div
          className="
            h-full w-full rounded-full
            border-2 border-dashed
            border-[#FFD400]/60
            bg-gray-300/50
            animate-pulse
          "
        />
      </div>

      <div
        className="
          absolute inset-0
          flex items-center justify-center
          px-4 sm:px-6
        "
      >
        <div
          className="
            flex w-full max-w-[858px]
            flex-col items-center gap-4

            translate-y-[110px]
            xs:translate-y-[160px]
            sm:translate-y-[175px]
            md:translate-y-[161px]
            lg:translate-y-[150px]
            xl:translate-y-0
          "
        >
          <div
            className="
              h-9 w-3/4
              animate-pulse rounded-md bg-gray-300
              sm:h-12
              md:h-16
              xl:h-20
            "
          />

          <div
            className="
              h-9 w-1/2
              animate-pulse rounded-md bg-gray-300
              sm:h-12
              md:h-16
              xl:h-20
            "
          />

          <div
            className="
              mt-4 h-4 w-2/3
              animate-pulse rounded-md bg-gray-300
              sm:h-5
            "
          />

          <div
            className="
              h-4 w-5/6
              animate-pulse rounded-md bg-gray-300
              sm:h-5
            "
          />

          <div
            className="
              mt-6 flex w-full
              flex-col items-center gap-4
              sm:w-auto sm:flex-row
            "
          >
            <div
              className="
                h-12 w-full
                animate-pulse rounded-md bg-gray-300
                sm:w-40
              "
            />

            <div
              className="
                h-12 w-full
                animate-pulse rounded-md bg-gray-300
                sm:w-40
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  const [data, setData] = useState<HeroData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get<HeroData>("home");
        setData(res.data);
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
    <section
      className="
        relative w-full overflow-hidden
        min-h-[600px]
        xs:min-h-[640px]
        sm:min-h-[680px]
        md:min-h-[760px]
        lg:min-h-[880px]
        xl:min-h-[976px]
      "
    >
      {/* Background */}
      <Image
        src={heroImage}
        alt="Construction site rebar and formwork under inspection"
        fill
        priority
        className="object-cover object-top"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.4104) 0%, rgba(0, 0, 0, 0.76) 100%)",
        }}
      />

      {/* =====================================================
          ACCREDITATION BADGE
          ===================================================== */}
      <div
        className="
          absolute z-20
          flex items-center justify-center

          /* Mobile */
          h-[125px] w-[125px]
          top-[92px]
          left-1/2
          -translate-x-1/2
          p-2

          /* XS */
          xs:h-[140px]
          xs:w-[140px]
          xs:top-[98px]

          /* SM */
          sm:h-[160px]
          sm:w-[160px]
          sm:top-[100px]

          /* MD */
          md:h-[185px]
          md:w-[185px]
          md:top-[118px]

          /* LG (1024-1279px, e.g. MacBook) - stay centered like MD,
             do NOT switch to the left-positioned desktop layout yet,
             there isn't enough horizontal room and it overlaps the heading */
          lg:h-[190px]
          lg:w-[190px]
          lg:top-[130px]
          lg:left-1/2
          lg:-translate-x-1/2
          lg:p-3.5

          /* XL (1280px+) - now there's room, move badge to the left of the heading */
          xl:h-[237px]
          xl:w-[237px]
          xl:top-[165px]
          xl:left-[217px]
          xl:translate-x-0
          xl:p-4
        "
        style={{
          borderRadius: "9999px",
          borderWidth: "2px",
          borderStyle: "dashed",
          borderColor: "#FFD400",
        }}
      >
        <Image
          src={ACCREDITED_BADGE}
          alt="EIAC Accredited ISO/IEC 17025:2017"
          width={198}
          height={198}
          priority
          className="
            h-full
            w-full
            object-contain
            animate-[spin_18s_linear_infinite]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}
      <div
        className="
          absolute inset-0 z-10
          flex items-center justify-center
          px-4 sm:px-6
        "
      >
        <div
          className="
            flex w-full max-w-[858px]
            flex-col items-center
            text-center

            /* Mobile - push content down below the badge (badge bottom ~217px) */
            translate-y-[110px]

            /* XS - badge bottom ~238px */
            xs:translate-y-[160px]

            /* SM - badge bottom ~260px */
            sm:translate-y-[175px]

            /* MD - badge bottom ~303px */
            md:translate-y-[161px]

            /* LG (1024-1279px) - badge is now centered above (top-130 + h190,
               bottom ~320), push content clear of it just like MD/SM do */
            lg:translate-y-[150px]

            /* XL - badge is out of the way (left-positioned), no push needed */
            xl:translate-y-0

            gap-3
            sm:gap-4
            md:gap-5
            xl:gap-6
          "
        >
          {/* Main heading */}
          <h1
            className="
              text-white
              uppercase
              font-poppins
              font-bold
              text-center

              text-[26px]
              leading-[112%]

              xs:text-[30px]
              sm:text-[38px]
              md:text-[48px]
              lg:text-[60px]
              xl:text-[80px]
            "
            style={{
              letterSpacing: "0px",
              maxWidth: "858px",
            }}
          >
            {heroTitleOne}.
            <br />

            <span style={{ color: "#FFA7DC" }}>
              {heroTitleTwo.trim()}
            </span>

            <br />

            {heroTitleThree}
          </h1>

          {/* First description */}
          <p
            className="
              text-white
              font-poppins
              font-medium
              capitalize
              text-center

              text-sm
              leading-[120%]

              xs:text-base
              sm:text-lg
              md:text-xl
              xl:text-[22px]
            "
            style={{
              letterSpacing: "0px",
            }}
          >
            {heroDescription}
          </p>

          {/* Second description */}
          <p
            className="
              font-poppins
              font-normal
              capitalize
              text-center

              text-xs
              leading-[120%]

              xs:text-sm
              sm:text-base
              xl:text-[18px]
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
          <div
            className="
              flex w-full
              flex-col items-center
              gap-3

              xs:gap-4

              sm:w-auto
              sm:flex-row
              sm:justify-center
            "
          >
            <Link
              href={requestTestButtonLink}
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="navbarCta"
                className="w-full sm:w-auto"
              >
                {requestTestButtonText}
              </Button>
            </Link>

            <Link
              href={exploreServicesButtonLink}
              className="w-full sm:w-auto"
            >
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