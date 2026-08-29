"use client"
import Image from "next/image";
import HERO_BG from "../../public/images/hero.jpg";
import ACCREDITED_BADGE from "../../public/images/accredited-badge.png";
import { Button } from "../common/Button";

function Hero() {
  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] xl:min-h-[900px] overflow-hidden">
      {/* Background photo */}
      <Image
        src={HERO_BG}
        alt="Construction site rebar and formwork under inspection"
        fill
        priority
        className="object-cover object-top"
      />

      {/* Dark overlay — light at top so the image reads clearly under the nav, darker toward the bottom for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/85" />

      {/* Accreditation badge — real image asset, dummy path for now.
          Uses the same top offset as the content block's own top padding below,
          so its top edge lines up exactly with the "Precision Testing" line
          regardless of viewport height. */}
      <div className="absolute z-10 hidden lg:block lg:left-10 xl:left-16 2xl:left-[calc(50%-689px)] top-16 sm:top-20 md:top-24">
        <Image
          src={ACCREDITED_BADGE}
          alt="FIAC Accredited ISO/IEC 17025:2017"
          width={220}
          height={220}
          className="h-[160px] w-[160px] animate-[spin_18s_linear_infinite] xl:h-[200px] xl:w-[200px] 2xl:h-[220px] 2xl:w-[220px]"
        />
      </div>

      {/* Content block */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-[858px] flex-col items-center
                   gap-3 px-4 pt-16 pb-16 text-center
                   sm:gap-4 sm:px-6 sm:pt-20 sm:pb-20
                   md:gap-5 md:pt-24 md:pb-24
                   xl:gap-6"
      >
        <h1
          className="text-white uppercase font-poppins font-bold
                     text-[32px] leading-[112%]
                     sm:text-[40px]
                     md:text-[52px]
                     lg:text-[64px]
                     xl:text-[80px]"
          style={{ letterSpacing: "0px" }}
        >
          Precision Testing.
          <br />
          <span style={{ color: "#FC0198" }}>Engineering</span>
          <br />
          Confidence.
        </h1>

        <p
          className="text-white font-poppins font-medium capitalize
                     text-base leading-[120%]
                     sm:text-lg
                     md:text-xl
                     xl:text-[22px]"
          style={{ letterSpacing: "0px" }}
        >
          Independent Soil, Construction Material And Building Testing
          Services For Projects Across The UAE.
        </p>

        <p
          className="font-poppins font-normal capitalize
                     text-sm leading-[120%]
                     sm:text-base
                     xl:text-[18px]"
          style={{ letterSpacing: "0px", color: "#E8E8E8" }}
        >
          Mega Quality Laboratory Provides Professional Testing And
          Investigation Services For Soil, Concrete, Steel, Cement,
          Aggregates And Other Construction Materials Supported By
          Experienced Technical Professionals And A Quality System Aligned
          With ISO/IEC 17025:2017.
        </p>

        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
          <Button type="button" variant="navbarCta">
            Request a Test
          </Button>
          <Button type="button" variant="heroCta">
            Explore Services
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;