"use client";

import Image from "next/image";
import Link from "next/link";
import CONTACT_BG_IMG from "../../public/images/getintouch.jpg";
import { Button } from "../common/Button";

const LOCATIONS = [
  {
    label: "Dubai",
    value: "Dubai, United Arab Emirates",
  },
  {
    label: "Ras Al Khaimah",
    value: "Ras Al Khaimah, United Arab Emirates",
  },
  {
    label: "Phone",
    value: "+971 52 652 3220",
  },
];

function GetInTouch() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={CONTACT_BG_IMG}
        alt="Get in touch with our technical team"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-[1464px] flex-col items-center px-4 py-20 sm:px-6 sm:py-24 md:py-28 xl:py-32">
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
            Get In Touch
          </span>
          <span className="h-px w-12 bg-[#67003E]" />
        </div>

        {/* Heading */}
        <h2
          className="
            mb-6
            text-center
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
          style={{
            letterSpacing: "0px",
            width: "1076px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          Have A Project That Needs{" "}
          <span className="text-[#FFA8D9]">Testing?</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mb-12
            max-w-[820px]
            text-center
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
            color: "#D2D2D2",
          }}
        >
          From Soil Investigation To Construction Material Testing, Connect
          With Our Technical Team.
        </p>

        {/* Buttons */}
        <div className="mb-16 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/request-a-test"
            
          >
            <Button
            variant={"navbarCta"}
            >Request A Test</Button>
            
          </Link>

          <Link
            href="/contact"
          
          >
           <Button
            variant={"heroCta"}
            >Talk To An Engineer</Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full max-w-[1690px] bg-white/30 mt-8" />

        {/* Locations */}
        <div
          className="mx-auto flex w-full max-w-[1173px] flex-col items-center  justify-between gap-8 sm:flex-row"
          style={{ gap: "41px" }}
        >
          {LOCATIONS.map((location) => (
            <div key={location.label} className="flex flex-col items-center text-center">
              <span
                className="font-poppins font-normal capitalize"
                style={{
                  fontSize: "18px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#67003E",
                }}
              >
                {location.label}
              </span>

              <span
                className="mt-2 font-poppins font-semibold capitalize text-white"
                style={{
                  fontSize: "26px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {location.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GetInTouch;