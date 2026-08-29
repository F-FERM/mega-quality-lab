"use client";

import Image from "next/image";
import MODULE_1_IMG from "../../public/images/testing1.jpg";
import MODULE_2_IMG from "../../public/images/testing2.jpg";
import MODULE_3_IMG from "../../public/images/testing3.jpg";
import MODULE_4_IMG from "../../public/images/testing4.jpg";

const MODULES = [
  {
    id: "01",
    title: "UPV Testing",
    description:
      "Ultrasonic Pulse Velocity Testing To Assess Concrete Uniformity And Quality In-Situ.",
    image: MODULE_1_IMG,
  },
  {
    id: "02",
    title: "Rebound Hammer",
    description:
      "Surface Hardness Testing Used As An Indicator Of Concrete Strength.",
    image: MODULE_2_IMG,
  },
  {
    id: "03",
    title: "Half-Cell Potential",
    description:
      "Electrochemical Assessment Of Reinforcement Corrosion Risk In Concrete Elements.",
    image: MODULE_3_IMG,
  },
  {
    id: "04",
    title: "Carbonation Testing",
    description:
      "Assessment Of Carbonation Depth To Evaluate Long-Term Durability Of Concrete.",
    image: MODULE_4_IMG,
  },
];

function NonDestructiveTesting() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3">
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
            Non-Destructive Testing
          </span>
          <span className="h-px w-12 bg-[#67003E]" />
        </div>

        {/* Heading */}
        <h2
          className="
            mx-auto
            mb-16
            max-w-[1100px]
            text-center
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
          Test Without <span className="text-[#FFA8D9]">Compromising</span>{" "}
          The Structure.
        </h2>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {MODULES.map((module) => (
            <div
              key={module.id}
              className="group relative flex flex-col overflow-hidden border border-[#E4E4E4] bg-white"
              style={{
                width: "350px",
                height: "383px",
                borderRadius: "50px",
                paddingTop: "1px",
                paddingBottom: "34px",
                gap: "10px",
                opacity: 1,
              }}
            >
              {/* Image */}
              <div className="relative h-[210px] w-full shrink-0 overflow-hidden transition-all duration-500 ease-out group-hover:h-[235px]">
                <Image
                  src={module.image}
                  alt={module.title}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 bg-white px-6">
                <span
                  className="font-poppins font-normal capitalize"
                  style={{
                    fontSize: "18px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#67003E",
                  }}
                >
                  Module {module.id}
                </span>

                <h3
                  className="mt-1 font-poppins font-semibold capitalize text-black"
                  style={{
                    fontSize: "26px",
                    lineHeight: "120%",
                    letterSpacing: "0px",
                  }}
                >
                  {module.title}
                </h3>

                <p
                  className="mt-1 font-poppins font-normal capitalize"
                  style={{
                    fontSize: "18px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#656565",
                  }}
                >
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NonDestructiveTesting;