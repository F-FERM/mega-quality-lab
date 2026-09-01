"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import ACCREDITED_BADGE_IMG from "../../../public/images/accredited-badge.png";
import LOGO_MARK_IMG from "../../../public/images/footerlogo.png";
import FACEBOOK_ICON_IMG from "../../../public/images/fb.png";
import INSTAGRAM_ICON_IMG from "../../../public/images/insta.png";
import X_ICON_IMG from "../../../public/images/twitter.png";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface NavLink {
  _id?: string;
  label: string;
  url: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ServiceLink {
  _id?: string;
  label: string;
  url: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface Address {
  _id?: string;
  location: string;
  address: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface FooterData {
  _id?: string;
  brandName: string;
  brandLogo: string;
  brandLogoAlt: string;
  navigationTitle: string;
  navLinks: NavLink[];
  servicesTitle: string;
  serviceLinks: ServiceLink[];
  addressTitle: string;
  addresses: Address[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: InlineLink[];
  socialTitle: string;
  socialLinks: SocialLink[];
  copyrightText: string;
  accreditationText: string;
  copyrightInlineLinks: InlineLink[];
  isActive: boolean;
}

// ================= FALLBACK =================

const defaultData: FooterData = {
  brandName: "MEGA QUALITY LAB",
  brandLogo: "",
  brandLogoAlt: "MEGA QUALITY LAB Logo",
  navigationTitle: "NAVIGATION",
  navLinks: [
    { label: "Home", url: "/", order: 0, inlineLinks: [] },
    { label: "About Us", url: "/about", order: 1, inlineLinks: [] },
    { label: "Service", url: "/services", order: 2, inlineLinks: [] },
    { label: "Projects", url: "/projects", order: 3, inlineLinks: [] },
    { label: "Contact", url: "/contact", order: 4, inlineLinks: [] },
  ],
  servicesTitle: "SERVICES",
  serviceLinks: [
    { label: "Material Testing", url: "/services/material-testing", order: 0, inlineLinks: [] },
    { label: "Soil Testing", url: "/services/soil-testing", order: 1, inlineLinks: [] },
    { label: "Concrete Testing", url: "/services/concrete-testing", order: 2, inlineLinks: [] },
    { label: "Steel Testing", url: "/services/steel-testing", order: 3, inlineLinks: [] },
    { label: "NDT", url: "/services/ndt", order: 4, inlineLinks: [] },
    { label: "Geotechnical Investigation", url: "/services/geotechnical-investigation", order: 5, inlineLinks: [] },
    { label: "Hydrogeological Services", url: "/services/hydrogeological-services", order: 6, inlineLinks: [] },
  ],
  addressTitle: "ADDRESS",
  addresses: [
    { location: "Dubai", address: "Dubai, United Arab Emirates", order: 0, inlineLinks: [] },
    { location: "Ras Al Khaimah", address: "Ras Al Khaimah, United Arab Emirates", order: 1, inlineLinks: [] },
  ],
  phoneLabel: "PHONE",
  phoneNumber: "+971 52 652 3220",
  phoneInlineLinks: [],
  socialTitle: "FOLLOW US",
  socialLinks: [
    { platform: "Facebook", url: "#", icon: "", order: 0, inlineLinks: [] },
    { platform: "Instagram", url: "#", icon: "", order: 1, inlineLinks: [] },
    { platform: "X", url: "#", icon: "", order: 2, inlineLinks: [] },
  ],
  copyrightText: "© 2026 MEGA QUALITY LABORATORY FOR SOIL AND BUILDING MATERIALS TESTING",
  accreditationText: "EIAC ACCREDITED — ISO/IEC 17025:2017 — LB-TEST-271",
  copyrightInlineLinks: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

// Map platform to icon
const getSocialIcon = (platform: string): any => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes("facebook")) return FACEBOOK_ICON_IMG;
  if (platformLower.includes("instagram")) return INSTAGRAM_ICON_IMG;
  if (platformLower.includes("twitter") || platformLower.includes("x")) return X_ICON_IMG;
  return FACEBOOK_ICON_IMG; // fallback
};

// ================= SKELETON =================

function FooterSkeleton() {
  return (
    <footer className="relative w-full overflow-x-hidden animate-pulse" style={{ backgroundColor: "#270027" }}>
      <div className="mx-auto flex w-full max-w-[1920px] flex-col" style={{ paddingTop: "53px", paddingRight: "clamp(20px, 4vw, 81px)", paddingBottom: "1px", paddingLeft: "clamp(20px, 4vw, 80px)" }}>
        <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ width: "1759px", maxWidth: "100%", gap: "clamp(30px, 4vw, 80px)" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-6 h-4 w-24 rounded bg-white/10" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-6 w-32 rounded bg-white/5" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-1 mt-20 h-px w-full bg-white/20" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-64 rounded bg-white/10" />
          <div className="h-4 w-80 rounded bg-white/10" />
        </div>
        <div className="mx-auto flex w-full items-center justify-center" style={{ width: "1127px", maxWidth: "100%", height: "180px" }}>
          <div className="relative h-16 w-16 shrink-0 opacity-40 sm:h-20 sm:w-20 xl:h-28 xl:w-28 rounded-full bg-white/10" />
          <div className="h-12 w-48 rounded bg-white/10" style={{ marginLeft: "10px" }} />
        </div>
      </div>
    </footer>
  );
}

// ================= MAIN COMPONENT =================

function Footer() {
  const [data, setData] = useState<FooterData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get("/footer");
        const raw = res.data;

        let responseData: any = null;
        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          setData({
            _id: responseData._id,
            brandName: responseData.brandName || defaultData.brandName,
            brandLogo: responseData.brandLogo || "",
            brandLogoAlt: responseData.brandLogoAlt || defaultData.brandLogoAlt,
            navigationTitle: responseData.navigationTitle || defaultData.navigationTitle,
            navLinks: (responseData.navLinks || []).sort((a: NavLink, b: NavLink) => (a.order ?? 0) - (b.order ?? 0)),
            servicesTitle: responseData.servicesTitle || defaultData.servicesTitle,
            serviceLinks: (responseData.serviceLinks || []).sort((a: ServiceLink, b: ServiceLink) => (a.order ?? 0) - (b.order ?? 0)),
            addressTitle: responseData.addressTitle || defaultData.addressTitle,
            addresses: (responseData.addresses || []).sort((a: Address, b: Address) => (a.order ?? 0) - (b.order ?? 0)),
            phoneLabel: responseData.phoneLabel || defaultData.phoneLabel,
            phoneNumber: responseData.phoneNumber || defaultData.phoneNumber,
            phoneInlineLinks: responseData.phoneInlineLinks || [],
            socialTitle: responseData.socialTitle || defaultData.socialTitle,
            socialLinks: (responseData.socialLinks || []).sort((a: SocialLink, b: SocialLink) => (a.order ?? 0) - (b.order ?? 0)),
            copyrightText: responseData.copyrightText || defaultData.copyrightText,
            accreditationText: responseData.accreditationText || defaultData.accreditationText,
            copyrightInlineLinks: responseData.copyrightInlineLinks || [],
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Footer:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (isLoading) {
    return <FooterSkeleton />;
  }

  const {
    brandName,
    brandLogo,
    brandLogoAlt,
    navigationTitle,
    navLinks,
    servicesTitle,
    serviceLinks,
    addressTitle,
    addresses,
    phoneLabel,
    phoneNumber,
    socialTitle,
    socialLinks,
    copyrightText,
    accreditationText,
  } = data;

  // Resolve brand logo from API
  const resolvedBrandLogo = brandLogo ? resolveImage(brandLogo) : LOGO_MARK_IMG;
  const isRemoteBrandLogo = typeof resolvedBrandLogo === 'string' && resolvedBrandLogo.startsWith('http');

  // Prepare social links with icons
  const socialLinksWithIcons = socialLinks.map((link) => ({
    ...link,
    icon: link.icon ? resolveImage(link.icon) : getSocialIcon(link.platform),
  }));

  return (
    <footer className="relative w-full overflow-x-hidden" style={{ backgroundColor: "#270027" }}>
      <div
        className="mx-auto flex w-full max-w-[1920px] flex-col"
        style={{
          paddingTop: "53px",
          paddingRight: "clamp(20px, 4vw, 81px)",
          paddingBottom: "1px",
          paddingLeft: "clamp(20px, 4vw, 80px)",
          opacity: 1,
        }}
      >
        {/* Top grid */}
        <div
          className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            width: "1759px",
            maxWidth: "100%",
            gap: "clamp(30px, 4vw, 80px)",
            opacity: 1,
          }}
        >
          {/* Navigation */}
          <div className="flex flex-col">
            <span
              className="mb-6 font-poppins font-medium uppercase"
              style={{
                fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              {navigationTitle}
            </span>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link._id || link.label}
                  href={link.url}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={{
                    fontSize: "clamp(16px, 1vw + 10px, 22px)",
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
                fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              {servicesTitle}
            </span>

            <div className="flex flex-col gap-4">
              {serviceLinks.map((link) => (
                <Link
                  key={link._id || link.label}
                  href={link.url}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={{
                    fontSize: "clamp(16px, 1vw + 10px, 22px)",
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
                fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#AAAAAA",
              }}
            >
              {addressTitle}
            </span>

            <div className="flex flex-col gap-6 sm:gap-8">
              {addresses.map((addr) => (
                <div key={addr._id || addr.location} className="flex flex-col gap-1">
                  <span
                    className="mb-2 font-poppins font-normal text-white"
                    style={{ fontSize: "clamp(18px, 1vw + 12px, 22px)", lineHeight: "100%" }}
                  >
                    {addr.location}
                  </span>
                  <span
                    className="font-poppins font-normal"
                    style={{
                      fontSize: "clamp(14px, 0.8vw + 10px, 18px)",
                      lineHeight: "150%",
                      color: "#CDCDCD",
                      fontWeight: "400",
                    }}
                  >
                    {addr.address}
                  </span>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <span
                  className="mb-2 font-poppins font-medium uppercase"
                  style={{
                    fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#AAAAAA",
                  }}
                >
                  {phoneLabel}
                </span>
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="font-poppins font-normal text-white"
                  style={{ fontSize: "clamp(14px, 0.8vw + 10px, 18px)", lineHeight: "100%", fontWeight: "400" }}
                >
                  {phoneNumber}
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <span
                  className="mb-2 font-poppins font-medium uppercase"
                  style={{
                    fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#AAAAAA",
                  }}
                >
                  {socialTitle}
                </span>
                <div className="flex items-center gap-6 sm:gap-8">
                  {socialLinksWithIcons.map((social) => (
                    <a
                      key={social._id || social.platform}
                      href={social.url}
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={social.icon}
                        alt={social.platform}
                        width={35}
                        height={35}
                        className="object-contain"
                        unoptimized={typeof social.icon === 'string' && social.icon.startsWith('http')}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accredited badge */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="relative h-[140px] w-[140px] animate-[spin_18s_linear_infinite] sm:h-[160px] sm:w-[160px] md:h-[186px] md:w-[186px]">
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
        <div className="mb-1 mt-12 sm:mt-16 md:mt-20 h-px w-full bg-white/20" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="font-poppins font-normal uppercase text-center sm:text-left"
            style={{
              fontSize: "clamp(12px, 0.7vw + 8px, 16px)",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#D9D9D9",
            }}
          >
            {copyrightText}
          </span>

          <span
            className="font-poppins font-normal uppercase text-center sm:text-right"
            style={{
              fontSize: "clamp(12px, 0.7vw + 8px, 16px)",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#D9D9D9",
            }}
          >
            {accreditationText}
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
        <div className="relative h-12 w-12 shrink-0 opacity-40 sm:h-16 sm:w-16 md:h-20 md:w-20 xl:h-28 xl:w-28">
          <Image
            src={resolvedBrandLogo}
            alt={brandLogoAlt || "Mega Quality Lab Logo"}
            fill
            className="object-contain"
            sizes="112px"
            unoptimized={isRemoteBrandLogo}
          />
        </div>
        <span
          className="whitespace-nowrap font-poppins font-bold uppercase text-[#67003E]/40"
          style={{
            fontSize: "clamp(30px, 6vw, 110px)",
            lineHeight: "100%",
            letterSpacing: "0px",
          }}
        >
          {brandName}
        </span>
      </div>
    </footer>
  );
}

export default Footer;