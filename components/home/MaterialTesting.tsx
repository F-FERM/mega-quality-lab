"use client";

import Image from "next/image";
import EQUIPMENT_1_IMG from "../../public/images/equipment1.jpg";
import EQUIPMENT_2_IMG from "../../public/images/equipment2.jpg";
import EQUIPMENT_3_IMG from "../../public/images/equipment3.jpg";

const EQUIPMENTS = [
  {
    id: "01",
    badge: "Concrete Testing",
    title: "Compression Testing Machine 3000 KN",
    description:
      "Ultrasonic Pulse Velocity Testing To Assess Concrete Uniformity And Quality In-Situ.",
    image: EQUIPMENT_1_IMG,
  },
  {
    id: "02",
    badge: "Soil Testing",
    title: "Triaxial Shear Testing Apparatus",
    description:
      "Used To Determine Shear Strength Parameters Of Soil Samples Under Controlled Conditions.",
    image: EQUIPMENT_2_IMG,
  },
  {
    id: "03",
    badge: "Sample Preparation",
    title: "Laboratory Sample Preparation Bay",
    description:
      "Controlled Preparation Environment For Soil, Concrete And Aggregate Specimens Ahead Of Testing.",
    image: EQUIPMENT_3_IMG,
  },
];

function MaterialTesting() {
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
            Material Testing
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
          Where Precision Meets <span className="text-[#FFA8D9]">Equipment</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mb-12
            max-w-[900px]
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
            color: "#727272",
          }}
        >
          Documented Laboratory Equipment Used In Testing Operations.
          Specifications Shown Are Limited To What Has Been Verified By The
          Laboratory.
        </p>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 lg:justify-between">
          {EQUIPMENTS.map((equipment) => (
            <div
              key={equipment.id}
              className="group relative overflow-hidden"
              style={{
                width: "458px",
                maxWidth: "100%",
                height: "451px",
                borderRadius: "50px",
                boxShadow: "0px 0px 4px 0px #00000040",
              }}
            >
              {/* Background image */}
              <Image
                src={equipment.image}
                alt={equipment.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 90vw, 458px"
              />

              {/* Base gradient overlay for text legibility (always on) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              />

              {/* Flat dark overlay that fades in on hover, darkening the whole card */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/50" />

              {/* Content */}
              <div
                className="relative flex h-full flex-col"
                style={{
                  paddingTop: "35px",
                  paddingRight: "39px",
                  paddingBottom: "35px",
                  paddingLeft: "39px",
                  gap: "10px",
                }}
              >
                {/* Badge */}
               {/* Badge */}
{/* Badge */}
<div
  className="
    flex
    h-[33px]
    min-w-[211px]
    w-fit
    items-center
    justify-center
    gap-[10px]
    overflow-hidden
    rounded-[23px]
    bg-[#FFCEEBB2]
    px-[19px]
    py-[3px]

    transition-all
    duration-300
    ease-out

    group-hover:h-[60px]
    group-hover:w-full
    group-hover:rounded-[30px]
    group-hover:px-6
  "
>
  {/* Dot */}
  <span
    className="
      h-[6px]
      w-[6px]
      shrink-0
      rounded-full
      bg-[#FC0198]

      transition-all
      duration-300
      ease-out

      group-hover:h-[14px]
      group-hover:w-[14px]
    "
    aria-hidden="true"
  />

  {/* Text */}
  <span
    className="
      whitespace-nowrap
      font-poppins
      text-[18px]
      font-normal
      capitalize
      leading-none
      text-[#67003E]

      transition-all
      duration-300
      ease-out

      group-hover:text-[28px]
    "
  >
    {equipment.badge}
  </span>
</div>

                {/* Spacer pushes text block to the bottom */}
                <div className="flex flex-1 flex-col justify-end gap-3">
                  <h3
                    className="font-poppins font-semibold capitalize text-white"
                    style={{
                      fontSize: "26px",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {equipment.title}
                  </h3>

                  <p
                    className="font-poppins font-normal capitalize"
                    style={{
                      fontSize: "18px",
                      lineHeight: "140%",
                      letterSpacing: "0px",
                      color: "#D9D9D9",

                    }}
                  >
                    {equipment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MaterialTesting;