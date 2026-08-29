"use client";

import Image from "next/image";
import Link from "next/link";
import ACCREDITED_BADGE_IMG from "../../public/images/accredited-badge.png";
import LOGO_MARK_IMG from "../../public/images/footerlogo.png";
import FACEBOOK_ICON_IMG from "../../public/images/fb.png";
import INSTAGRAM_ICON_IMG from "../../public/images/insta.png";
import X_ICON_IMG from "../../public/images/twitter.png";

const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Material Testing", href: "/services/material-testing" },
  { label: "Soil Testing", href: "/services/soil-testing" },
  { label: "Concrete Testing", href: "/services/concrete-testing" },
  { label: "Steel Testing", href: "/services/steel-testing" },
  { label: "NDT", href: "/services/ndt" },
  { label: "Geotechnical Investigation", href: "/services/geotechnical-investigation" },
  { label: "Hydrogeological Services", href: "/services/hydrogeological-services" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FACEBOOK_ICON_IMG },
  { label: "Instagram", href: "#", icon: INSTAGRAM_ICON_IMG },
  { label: "X", href: "#", icon: X_ICON_IMG },
];

function Footer() {
  return (
    <footer className="relative w-full overflow-x-hidden" style={{ backgroundColor: "#270027" }}>
      <div
        className="mx-auto flex w-full max-w-[1920px] flex-col"
        style={{
          paddingTop: "53px",
          paddingRight: "81px",
          paddingBottom: "1px",
          paddingLeft: "80px",
          opacity: 1,
        }}
      >
        {/* Top grid */}
        <div
          className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            width: "1759px",
            maxWidth: "100%",
            gap: "80px",
            opacity: 1,
          }}
        >
          {/* Navigation */}
          <div className="flex flex-col">
            <span
              className="mb-6 font-poppins font-medium uppercase"
              style={{
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              Navigation
            </span>

            <div className="flex flex-col gap-4">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={{
                    fontSize: "22px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col">
            <span
              className="mb-6 font-poppins font-medium uppercase"
              style={{
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              Services
            </span>

            <div className="flex flex-col gap-4">
              {SERVICE_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={{
                    fontSize: "22px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <span
              className="mb-6 font-poppins font-medium uppercase"
              style={{
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              Address
            </span>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <span
                  className="mb-2 font-poppins font-normal text-white"
                  style={{ fontSize: "22px", lineHeight: "100%" }}
                >
                  Dubai
                </span>
                <span
                  className="font-poppins font-normal"
                  style={{
                    fontSize: "18px",
                    lineHeight: "150%",
                    color: "#CDCDCD",
                    fontWeight: "400",
                  }}
                >
                  Dubai, United Arab Emirates
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className="mb-2 font-poppins font-normal text-white"
                  style={{ fontSize: "22px", lineHeight: "100%" }}
                >
                  Ras Al Khaimah
                </span>
                <span
                  className="font-poppins font-normal"
                  style={{
                    fontSize: "18px",
                    lineHeight: "150%",
                    color: "#CDCDCD",
                    fontWeight: "400",
                  }}
                >
                  Ras Al Khaimah, United Arab Emirates
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className="mb-2 font-poppins font-medium uppercase"
                  style={{
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#AAAAAA",
                  }}
                >
                  Phone
                </span>
                <a
                  href="tel:+971526523220"
                  className="font-poppins font-normal text-white"
                  style={{ fontSize: "18px", lineHeight: "100%", fontWeight: "400" }}
                >
                  +971 52 652 3220
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <span
                  className="mb-2 font-poppins font-medium uppercase"
                  style={{
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#AAAAAA",
                  }}
                >
                  Follow Us
                </span>
                <div className="flex items-center gap-8">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                    >
                      <Image
  src={social.icon}
  alt={social.label}
  width={35}
  height={35}
  className="object-contain"
/>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accredited badge */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="relative h-[186px] w-[186px] animate-[spin_18s_linear_infinite]">
              <Image
                src={ACCREDITED_BADGE_IMG}
                alt="EIAC Accredited ISO/IEC 17025:2017"
                fill
                className="object-contain"
                sizes="186px"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-1 mt-20 h-px w-full bg-white/20" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="font-poppins font-normal uppercase"
            style={{
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#D9D9D9",
            }}
          >
            © 2026 Mega Quality Laboratory For Soil And Building Materials
            Testing
          </span>

          <span
            className="font-poppins font-normal uppercase"
            style={{
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#D9D9D9",
            }}
          >
            EIAC Accredited — ISO/IEC 17025:2017 — LB-TEST-271
          </span>
        </div>
      </div>

      {/* Watermark logo */}
      <div
        className="pointer-events-none mx-auto flex w-full items-center justify-center"
        style={{
          width: "1127px",
          maxWidth: "100%",
          height: "180px",
          gap: "10px",
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <div className="relative h-16 w-16 shrink-0 opacity-40 sm:h-20 sm:w-20 xl:h-28 xl:w-28">
          <Image
            src={LOGO_MARK_IMG}
            alt=""
            fill
            className="object-contain"
            sizes="112px"
          />
        </div>
        <span
          className="whitespace-nowrap font-poppins font-bold uppercase text-[#67003E]/40"
          style={{
            fontSize: "clamp(40px, 8vw, 110px)",
            lineHeight: "100%",
            letterSpacing: "0px",
          }}
        >
          Mega Quality Lab
        </span>
      </div>
    </footer>
  );
}

export default Footer;