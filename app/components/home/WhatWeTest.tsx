"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SERVICE_1_IMG from "../../../public/images/homeservice1.jpg";
import SERVICE_2_IMG from "../../../public/images/homeservice2.jpg";
import SERVICE_3_IMG from "../../../public/images/homeservice3.jpg";

const SERVICES = [
  {
    id: "01",
    title: "Concrete Testing",
    description:
      "Cube Compressive Strength, Core Testing, Beam Flexural Testing, Mix Design, Water Penetration And Block/Paving Block Testing.",
    image: SERVICE_1_IMG,
    href: "/services/concrete-testing",
  },
  {
    id: "02",
    title: "Soil Testing",
    description:
      "Moisture Content, Specific Gravity, Grain-Size Analysis, FSI, Atterberg Limits, Classification, FDT, MDD/OMC, Direct & Triaxial Shear, CBR And Field CBR.",
    image: SERVICE_2_IMG,
    href: "/services/soil-testing",
  },
  {
    id: "03",
    title: "Steel Testing",
    description:
      "Tensile Testing, Bend Testing, Re-Bend Testing And Chemical Composition Testing For Reinforcement And Structural Steel.",
    image: SERVICE_3_IMG,
    href: "/services/steel-testing",
  },
];

function WhatWeTest() {
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
            What We Test
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-6
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
          style={{ letterSpacing: "0px" }}
        >
          Our Testing & Investigation{" "}
          <span className="text-[#FFA8D9]">Services</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mb-12
            max-w-[668px]
            font-poppins
            font-medium
            capitalize
            text-black
            text-lg
            sm:text-xl
            xl:text-[22px]
          "
          style={{
            lineHeight: "120%",
            letterSpacing: "0px",
          }}
        >
          Six Core Disciplines Covering The Full Lifecycle Of Construction
          Materials — From Raw Aggregate To Finished Structure.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
<Link
  key={service.id}
  href={service.href}
  className="
    group
    relative
    block
    w-full
    aspect-[470/336]
    overflow-hidden
    rounded-[30px]
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
  "
>
  {/* Background image */}
  <Image
    src={service.image}
    alt={service.title}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    sizes="(max-width: 768px) 90vw, 470px"
  />

  {/* Base gradient overlay for text legibility (always on) */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

  {/* Flat dark overlay that fades in on hover, evenly darkening the whole card */}
  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/50" />

  {/* Content */}
  <div
    className="absolute inset-0 flex flex-col"
    style={{
      paddingTop: "43px",
      paddingRight: "34px",
      paddingBottom: "44px",
      paddingLeft: "34px",
    }}
  >
    {/* Service badge */}
    <span
      className="font-poppins font-normal capitalize"
      style={{
        fontSize: "18px",
        lineHeight: "100%",
        letterSpacing: "0px",
        color: "#FFA7DC",
      }}
    >
      Service {service.id}
    </span>

    {/* Spacer pushes title block to a fixed distance from the bottom */}
    <div className="flex flex-1 flex-col justify-end gap-3">
      <h3
        className="font-poppins font-semibold capitalize text-white"
        style={{
          fontSize: "32px",
          lineHeight: "120%",
          letterSpacing: "0px",
        }}
      >
        {service.title}
      </h3>

      <p
        className="line-clamp-3 font-poppins font-normal capitalize"
        style={{
          fontSize: "16px",
          lineHeight: "120%",
          letterSpacing: "0px",
          color: "#D9D9D9",
          minHeight: "58px", // reserves space for 3 lines even if text is shorter
        }}
      >
        {service.description}
      </p>

      <span
        className="mt-1 flex items-center gap-[10px] font-poppins font-medium capitalize"
        style={{
          fontSize: "22px",
          lineHeight: "120%",
          letterSpacing: "0px",
          color: "#FC0198",
        }}
      >
        Explore
        <ArrowRight
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2}
        />
      </span>
    </div>
  </div>
</Link>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="
              flex
              items-center
              gap-3
              rounded-full
              bg-[#67003E]
              px-8
              py-4
              font-poppins
              font-medium
              capitalize
              text-white
              transition-colors
              hover:bg-[#4d002e]
            "
            style={{
              fontSize: "18px",
              lineHeight: "120%",
              letterSpacing: "0px",
            }}
          >
            View All Service
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhatWeTest;
