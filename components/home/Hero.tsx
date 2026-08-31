"use client";
import Image from "next/image";
import HERO_BG from "../../public/images/hero.jpg";
import ACCREDITED_BADGE from "../../public/images/accredited-badge.png";
import { Button } from "../common/Button";

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "976px" }}
    >
      {/* Background photo */}
      <Image
        src={HERO_BG}
        alt="Construction site rebar and formwork under inspection"
        fill
        priority
        className="object-cover object-top"
      />

      {/* Dark overlay — exact gradient per spec */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.4104) 0%, rgba(0, 0, 0, 0.76) 100%)",
        }}
      />

      {/* Accreditation badge — dashed circular frame per spec, exact 237x237, positioned at top:165px / left:217px */}
      <div
        className="absolute z-10 hidden lg:flex items-center justify-center"
        style={{
          width: "237px",
          height: "237px",
          top: "165px",
          left: "217px",
          borderRadius: "124px",
          borderWidth: "2px",
          borderStyle: "dashed",
          borderColor: "#FFD400",
          paddingTop: "19px",
          paddingRight: "20px",
          paddingBottom: "20px",
          paddingLeft: "19px",
          gap: "10px",
        }}
      >
        <Image
          src={ACCREDITED_BADGE}
          alt="FIAC Accredited ISO/IEC 17025:2017"
          width={198}
          height={198}
          className="h-full w-full animate-[spin_18s_linear_infinite] object-contain"
        />
      </div>

      {/* Content block — vertically & horizontally centered within the fixed-height section */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-[858px] flex-col items-center gap-3 text-center sm:gap-4 md:gap-5 xl:gap-6">
          <h1
            className="text-white uppercase font-poppins font-bold text-center
                       text-[32px] leading-[112%]
                       sm:text-[40px]
                       md:text-[52px]
                       lg:text-[64px]
                       xl:text-[80px]"
            style={{
              letterSpacing: "0px",
              maxWidth: "858px",
            }}
          >
            Precision Testing.
            <br />
            <span style={{ color: "#FFA7DC" }}>Engineering</span>
            <br />
            Confidence.
          </h1>

          <p
            className="text-white font-poppins font-medium capitalize text-center
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
            className="font-poppins font-normal capitalize text-center
                       text-sm leading-[120%]
                       sm:text-base
                       xl:text-[18px]"
            style={{
              letterSpacing: "0px",
              color: "#E8E8E8",
              maxWidth: "804px",
            }}
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
      </div>
    </section>
  );
}

export default Hero;