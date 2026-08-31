"use client";

import Image from "next/image";
import HERO_BG from "../../../public/images/technicalgeo.png";

const SERVICES = [
  "Geotechnical Investigation",
  "Soil & Rock Sampling",
  "Groundwater Investigation",
  "Geophysical Survey",
  "Hydrogeological Survey",
  "Petrological Survey",
  "In-Situ Testing",
  "Geotechnical Reporting",
];

const PROCESS_STEPS = [
  { number: "01", label: "Ground" },
  { number: "02", label: "Sample" },
  { number: "03", label: "Lab" },
  { number: "04", label: "Analysis" },
  { number: "05", label: "Report" },
];

function GeotechnicalHero() {
  return (
    <section className="w-full">
      {/* =====================================================
          HERO — background image + content
          Outer section: 1920 x 644, padding 55/612/54/228
      ====================================================== */}
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[644px] w-full">
  <Image
    src={HERO_BG}
    alt="Technician performing geotechnical fieldwork"
    fill
    priority
    className="object-cover"
    sizes="100vw"
  />

  {/* Vertical darkening — dark at top for text legibility, strong maroon/pink blend at bottom */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(180deg,  rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.15) 50%, rgba(90,10,60,0.55) 75%, rgba(103,0,62,0.85) 100%)",
    }}
  />
</div>

        {/* Outer content wrapper — locked to spec dimensions/padding */}
        <div
          className="absolute inset-0 mx-auto flex w-full max-w-[1920px] items-center"
          style={{
            paddingTop: "55px",
            paddingRight: "612px",
            paddingBottom: "54px",
            paddingLeft: "228px",
          }}
        >
          {/* Inner content block — 1080 x 537, 25px gap between children */}
          <div
            className="flex w-full flex-col"
            style={{
              maxWidth: "1080px",
              gap: "15px",
            }}
          >
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
                Geotechnical Investigation
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                font-poppins
                font-bold
                uppercase
                leading-[112%]
                text-white
                text-[32px]
                sm:text-[40px]
                md:text-[48px]
                xl:text-[60px]
              "
              style={{ letterSpacing: "0px" }}
            >
              Understand The Ground Before{" "}
              <span className="text-[#FFA8D9]">You Build.</span>
            </h2>

            {/* Sub copy */}
            <p
              className="font-poppins font-medium capitalize"
              style={{
                width: "870px",
                maxWidth: "100%",
                fontSize: "22px",
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#BBBBBB",
              }}
            >
              Mega Quality Laboratory Provides Geotechnical Investigation,
              Soil And Rock Investigation, Hydrogeological And Related
              Surveying Services, Supported By Experienced Technical
              Personnel And Equipment.
            </p>

            {/* Service pill buttons */}
           {/* Service pill buttons */}
<div className="mt-3 flex flex-wrap gap-4">
  {SERVICES.map((service) => (
    <button
      key={service}
      type="button"
      className="
        group
        flex
        items-center
        justify-center
        rounded-[40px]
        border
        border-[#BABABA]
        text-center
        transition-all
        duration-300

        hover:border-[#FC0198]
        hover:bg-gray-600
      "
      style={{
        width: "334px",
        height: "68px",
        padding: "12px 32px",
        gap: "10px",
      }}
    >
      <span
        className="
          whitespace-nowrap
          font-poppins
          text-[20px]
          font-normal
          capitalize
          leading-none
          text-[#BABABA]
          transition-all
          duration-300

          group-hover:text-[#FC0198]
        "
      >
        {service}
      </span>
    </button>
  ))}
</div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROCESS BAR — purple strip with numbered circles
      ====================================================== */}
      <div
  className="w-full bg-[#67003E]"
  style={{
    paddingTop: "78px",
    paddingBottom: "78px",
    paddingLeft: "16px",
    paddingRight: "16px",
  }}
>
  <div
    className="
      mx-auto
      flex
      w-full
      max-w-[1756px]
      flex-wrap
      items-start
      justify-between
      gap-y-10
      sm:flex-nowrap
    "
  >
    {PROCESS_STEPS.map((step) => (
      <div key={step.number} className="flex flex-1 items-center">
        {/* Line before circle — always rendered, including before the first */}
        <span className="h-px flex-1 bg-[#FC0198]/40" />

        <div className="flex flex-col items-center gap-3 px-2">
          <div
            className="flex items-center justify-center rounded-full "
            style={{
              width: "88px",
              height: "88px",
              borderColor: "#FC0198",
              borderWidth: "1px",
            }}
          >
            <span
              className="font-poppins font-normal capitalize"
              style={{
                fontSize: "24px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#FC0198",
              }}
            >
              {step.number}
            </span>
          </div>
          <span
            className="font-poppins font-bold capitalize"
            style={{
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#FC0198",
            }}
          >
            {step.label}
          </span>
        </div>

        {/* Line after circle — always rendered, including after the last */}
        <span className="h-px flex-1 bg-[#FC0198]/40" />
      </div>
    ))}
  </div>
</div>
    </section>
  );
}

export default GeotechnicalHero;
