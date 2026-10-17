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
  whatsappLabel: string;
  whatsappNumbers: string[];
  whatsappInlineLinks: InlineLink[];
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
  whatsappLabel: "WHATSAPP",
  whatsappNumbers: [],
  whatsappInlineLinks: [],
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

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/* Top grid shared by the skeleton and the real footer.
   mobile: 1 column | sm: 2 columns
   lg: 4 columns (Navigation / Services / Address / Badge)
   xl+: column widths follow the reference — Navigation 21.7%,
   Services 32%, Address takes the rest, Badge on the far right. */
const FOOTER_GRID_CLASSES = `
  mx-auto grid w-full grid-cols-1 gap-x-6 gap-y-10
  sm:grid-cols-2
  lg:grid-cols-[0.7fr_1fr_1.3fr_auto]
  xl:grid-cols-[21.7%_32%_minmax(0,1fr)_auto] xl:gap-x-0 xl:pl-[14px]
`;

const FOOTER_GRID_STYLE = { width: "1759px", maxWidth: "100%" } as const;

// Small grey section label (NAVIGATION, SERVICES, PHONE ...)
const LABEL_STYLE = {
  fontSize: "clamp(14px, 0.8vw + 10px, 16px)",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#AAAAAA",
} as const;

// White links / numbers (nav, services, phone, whatsapp)
const LINK_STYLE = {
  fontSize: "clamp(16px, 1vw + 10px, 22px)",
  lineHeight: "100%",
  letterSpacing: "0%",
} as const;

// ================= SKELETON =================

function FooterSkeleton() {
  return (
    <footer className="relative w-full overflow-x-hidden animate-pulse" style={{ backgroundColor: "#270027" }}>
      <div className="mx-auto flex w-full max-w-[1920px] flex-col" style={{ paddingTop: "44px", paddingRight: "clamp(20px, 4vw, 81px)", paddingBottom: "1px", paddingLeft: "clamp(20px, 4vw, 80px)" }}>
        <div className={FOOTER_GRID_CLASSES} style={FOOTER_GRID_STYLE}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex min-w-0 flex-col">
              <div className="mb-6 h-4 w-24 rounded bg-white/10" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-6 w-32 rounded bg-white/5" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-1 mt-12 h-px w-full bg-white/20 sm:mt-16 md:mt-20 xl:mt-[120px]" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-64 max-w-full rounded bg-white/10" />
          <div className="h-4 w-80 max-w-full rounded bg-white/10" />
        </div>
        <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2 px-4" style={{ maxWidth: "1127px", minHeight: "120px", paddingTop: "24px", paddingBottom: "24px" }}>
          <div className="relative h-16 w-16 shrink-0 opacity-40 sm:h-20 sm:w-20 xl:h-28 xl:w-28 rounded-full bg-white/10" />
          <div className="h-12 w-48 rounded bg-white/10" />
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
            // Label: new field first, then older / misspelled names as fallbacks
            whatsappLabel:
              responseData.whatsappNumberLabel ||
              responseData.whatsappNumberlabel ||
              responseData.whatsappLabel ||
              responseData.whatasappLabel ||
              defaultData.whatsappLabel,
            whatsappNumbers: [
              responseData.whatsappNumber,
              responseData.whatsappNumberTwo,
              responseData.whatsappNumberThree,
            ].filter(Boolean),
            whatsappInlineLinks: responseData.whatsappInlineLinks || [],
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
    whatsappLabel,
    whatsappNumbers,
    whatsappInlineLinks,
    socialTitle,
    socialLinks,
    copyrightText,
    accreditationText,
  } = data;

  // Resolve brand logo from API
  const resolvedBrandLogo = brandLogo ? resolveImage(brandLogo) : LOGO_MARK_IMG;
  const isRemoteBrandLogo = typeof resolvedBrandLogo === "string" && resolvedBrandLogo.startsWith("http");

  // Prepare social links with icons
  const socialLinksWithIcons = socialLinks.map((link) => ({
    ...link,
    icon: link.icon ? resolveImage(link.icon) : getSocialIcon(link.platform),
  }));

  // WhatsApp items: skip empty / duplicate numbers, use the matching inline link when available
  const seenNumbers = new Set<string>();
  const safeWhatsappInlineLinks = whatsappInlineLinks ?? [];
  const whatsappItems = (whatsappNumbers ?? [])
    .filter((n) => {
      const d = digitsOnly(n);
      if (!d || seenNumbers.has(d)) return false;
      seenNumbers.add(d);
      return true;
    })
    .map((n) => {
      const match = safeWhatsappInlineLinks.find((l) => digitsOnly(l.text) === digitsOnly(n));
      return {
        number: n,
        url: match?.url || `https://wa.me/${digitsOnly(n)}`,
        newTab: match?.openInNewTab ?? true,
      };
    });

  return (
    <footer className="relative w-full overflow-x-hidden" style={{ backgroundColor: "#270027" }}>
      <div
        className="mx-auto flex w-full max-w-[1920px] flex-col"
        style={{
          paddingTop: "44px",
          paddingRight: "clamp(20px, 4vw, 81px)",
          paddingBottom: "1px",
          paddingLeft: "clamp(20px, 4vw, 80px)",
          opacity: 1,
        }}
      >
        {/* Top grid */}
        <div className={FOOTER_GRID_CLASSES} style={FOOTER_GRID_STYLE}>
          {/* Navigation */}
          <div className="flex min-w-0 flex-col">
            <span className="mb-6 font-poppins font-medium uppercase" style={LABEL_STYLE}>
              {navigationTitle}
            </span>

            <div className="flex flex-col gap-5 xl:gap-[23px]">
              {navLinks.map((link) => (
                <Link
                  key={link._id || link.label}
                  href={link.url}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={LINK_STYLE}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="flex min-w-0 flex-col">
            <span className="mb-6 font-poppins font-medium uppercase" style={LABEL_STYLE}>
              {servicesTitle}
            </span>

            <div className="flex flex-col gap-5 xl:gap-[23px]">
              {serviceLinks.map((link) => (
                <Link
                  key={link._id || link.label}
                  href={link.url}
                  className="font-poppins font-normal text-white transition-colors hover:text-[#FFA8D9]"
                  style={LINK_STYLE}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="flex min-w-0 flex-col xl:pr-6">
            <span className="mb-6 font-poppins font-medium uppercase" style={LABEL_STYLE}>
              {addressTitle}
            </span>

            <div className="flex flex-col gap-6 sm:gap-8 xl:gap-9">
              {addresses.map((addr) => (
                <div key={addr._id || addr.location} className="flex flex-col gap-1">
                  <span
                    className="mb-2 font-poppins font-normal text-white xl:mb-3"
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

              {/* Phone */}
              <div className="flex flex-col gap-3 xl:gap-4">
                <span className="font-poppins font-medium uppercase" style={LABEL_STYLE}>
                  {phoneLabel}
                </span>
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="font-poppins font-normal text-white"
                  style={{ ...LINK_STYLE, fontWeight: "400" }}
                >
                  {phoneNumber}
                </a>
              </div>

              {/* WhatsApp — numbers sit on one line, separated by commas */}
              {whatsappItems.length > 0 && (
                <div className="flex flex-col gap-3 xl:gap-4">
                  <span className="font-poppins font-medium uppercase" style={LABEL_STYLE}>
                    {whatsappLabel}
                  </span>

                  <div
                    className="flex flex-wrap items-baseline font-poppins font-normal text-white"
                    style={{ ...LINK_STYLE, lineHeight: "130%", fontWeight: "400" }}
                  >
                    {whatsappItems.map((item, idx) => (
                      <span key={item.number} className="whitespace-nowrap">
                        <a
                          href={item.url}
                          target={item.newTab ? "_blank" : undefined}
                          rel={item.newTab ? "noopener noreferrer" : undefined}
                          className="transition-colors hover:text-[#FFA8D9]"
                        >
                          {item.number}
                        </a>
                        {idx < whatsappItems.length - 1 && <span>,&nbsp;</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social */}
              <div className="flex flex-col gap-3">
                <span className="font-poppins font-medium uppercase" style={LABEL_STYLE}>
                  {socialTitle}
                </span>
                <div className="flex items-center gap-5">
                  {socialLinksWithIcons.map((social) => (
                    <a
                      key={social._id || social.platform}
                      href={social.url}
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={social.icon}
                        alt={social.platform}
                        width={35}
                        height={35}
                        className="object-contain"
                        unoptimized={typeof social.icon === "string" && social.icon.startsWith("http")}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accredited badge */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="relative h-[140px] w-[140px] shrink-0 animate-[spin_18s_linear_infinite] sm:h-[160px] sm:w-[160px] xl:h-[200px] xl:w-[200px] 2xl:h-[240px] 2xl:w-[240px]">
              <Image
                src={ACCREDITED_BADGE_IMG}
                alt="EIAC Accredited ISO/IEC 17025:2017"
                fill
                className="object-contain"
                sizes="240px"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-1 mt-12 h-px w-full bg-white/20 sm:mt-16 md:mt-20 xl:mt-[120px]" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="text-center font-poppins font-normal uppercase sm:text-left"
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
            className="text-center font-poppins font-normal uppercase sm:text-right"
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