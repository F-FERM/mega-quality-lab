"use client";

import Image from "next/image";
import ABOUT_IMG_1 from "../../public/images/lab1.jpg";
import ABOUT_IMG_2 from "../../public/images/lab2.jpg";

const STATS = [
  { value: "2020", label: "Established" },
  { value: "17025", label: "ISO/IEC Aligned" },
  { value: "2", label: "UAE Locations" },
];

function AboutLab() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-17">
      {/* SAME WIDTH AS QUALITY VERIFY */}
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1464px]
          grid-cols-1
          items-center
          gap-16
          lg:grid-cols-2
          lg:gap-12
          xl:gap-9
        "
      >
        {/* =====================================================
            LEFT — IMAGE COLLAGE
            width: 737, height: 675, top: 2032, left: 228
        ====================================================== */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[737px]
            pb-[70px]
           
            lg:mx-0
          "
        >
          {/* FIRST / MAIN IMAGE */}
          <div
            className="
              relative
              w-full
             aspect-[737/590]
              overflow-hidden
              rounded-[40px]
            "
          >
            <Image
              src={ABOUT_IMG_1}
              alt="Reviewing laboratory test records at a desk"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 737px"
            />
          </div>

          {/* SECOND IMAGE — right edges aligned, 45.5% down, 61.7% width, 15px frame */}
          <div
            className="
              absolute
              right-0
              top-[45.5%]
              z-10
              w-[61.7%]
              overflow-hidden
              rounded-[40px]
              border-[15px]
              border-white
            "
          >
            <div className="relative aspect-[455/368] w-full">
              <Image
                src={ABOUT_IMG_2}
                alt="Field technician collecting a soil sample at sunset"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 55vw, 455px"
              />
            </div>
          </div>

          {/* TESTING SINCE 2020 BADGE */}
          <div
            className="
              absolute
              bottom-0
              left-0
              z-20
              flex
              items-center
              gap-3
              rounded-full
              bg-[#171717]
              px-6
              py-3
              sm:px-7
              sm:py-3.5
            "
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FC0198]" />
            <span
              className="
                whitespace-nowrap
                font-poppins
                text-sm
                font-normal
                text-white
                sm:text-base
              "
            >
              Testing Since 2020
            </span>
          </div>
        </div>

        {/* =====================================================
            RIGHT — CONTENT
            width: 725.58, height: 639, top: 2050, left: 970
            gap: 38px between stacked blocks
        ====================================================== */}
        <div className="flex w-full max-w-[725.58px] flex-col gap-[27px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
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
              About The Laboratory
            </span>
          </div>

          {/* Heading */}
          <h2
            className="
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
            Testing That
            <br />
            <span className="text-[#FFA8D9]">Supports Better</span>
            <br />
            Construction
          </h2>

          {/* Lead + supporting paragraphs, kept as one block */}
          <div className="flex flex-col gap-4">
            <p
              className="
                font-poppins
                text-lg
                font-medium
                capitalize
                text-black
                sm:text-xl
                xl:text-[22px]
              "
              style={{
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              Mega Quality Laboratory For Soil And Building Materials Testing
              Is A Professionally Competent And Independent Laboratory
              Serving Construction And Infrastructure Requirements In The
              UAE.
            </p>

            <p
              className="
                font-poppins
                text-sm
                font-normal
                capitalize
                sm:text-base
              "
              style={{
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#686868",
              }}
            >
              The Laboratory Provides Material Testing Services To
              Contractors, Consultants And Private Agencies, With Testing
              Activities Managed Under A Quality System Aligned With ISO/IEC
              17025:2017.
            </p>

            <p
              className="
                font-poppins
                text-sm
                font-normal
                capitalize
                sm:text-base
              "
              style={{
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#686868",
              }}
            >
              The Laboratory Is Supported By Technically Qualified Personnel
              And Appropriate Testing Equipment, Operating From Facilities In
              Dubai And Ras Al Khaimah.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="
                  flex
                  flex-col
                  rounded-tr-[49px]
                  border-t
                  border-r
                  border-[#989898]
                  pt-3
                  pr-3
                "
              >
                <span
                  className="
                    font-poppins
                    text-2xl
                    font-normal
                    uppercase
                    leading-[112%]
                    text-black
                    sm:text-3xl
                    xl:text-[40px]
                  "
                  style={{ letterSpacing: "0px" }}
                >
                  {stat.value}
                </span>
                <span
                  className="
                    text-center
                    font-poppins
                    text-sm
                    font-normal
                    capitalize
                    sm:text-left
                    xl:text-[18px]
                  "
                  style={{
                    lineHeight: "120%",
                    letterSpacing: "0px",
                    color: "#67003E",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutLab;