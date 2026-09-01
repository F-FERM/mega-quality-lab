"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ServiceItem {
  _id?: string;
  serviceNumber: string;
  title: string;
  image: string;
  description: string;
  exploreLink: string;
  exploreText: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ServicesData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  services: ServiceItem[];
  isActive: boolean;
}

// Import fallback images
import SERVICE_1_IMG from "../../../public/images/homeservice1.jpg";
import SERVICE_2_IMG from "../../../public/images/homeservice2.jpg";
import SERVICE_3_IMG from "../../../public/images/homeservice3.jpg";

const FALLBACK_IMAGES = [
  SERVICE_1_IMG,
  SERVICE_2_IMG,
  SERVICE_3_IMG,
];

const defaultData: ServicesData = {
  sectionTitle: "What We Test",
  heroTitle: "OUR TESTING & INVESTIGATION",
  heroSubtitle: "SERVICES",
  heroImage: "",
  heroImageAlt: "Testing and Investigation Services",
  heroInlineLinks: [],
  description: "Six Core Disciplines Covering The Full Lifecycle Of Construction Materials — From Raw Aggregate To Finished Structure.",
  descriptionInlineLinks: [],
  services: [
    {
      serviceNumber: "SERVICE 01",
      title: "Concrete Testing",
      image: "",
      description: "Cube Compressive Strength, Core Testing, Beam Flexural Testing, Mix Design, Water Penetration And Block/Paving Block Testing.",
      exploreLink: "/services/concrete-testing",
      exploreText: "Explore →",
      order: 0,
      inlineLinks: [],
    },
    {
      serviceNumber: "SERVICE 02",
      title: "Soil Testing",
      image: "",
      description: "Moisture Content, Specific Gravity, Grain-Size Analysis, FSI, Atterberg Limits Classification, FDT, MDD/OMC, Direct & Triaxial Shear, CBR And Field CBR.",
      exploreLink: "/services/soil-testing",
      exploreText: "Explore →",
      order: 1,
      inlineLinks: [],
    },
    {
      serviceNumber: "SERVICE 03",
      title: "Steel Testing",
      image: "",
      description: "Tensile Testing, Bend Testing, Re-Bend Testing And Chemical Composition Testing For Reinforcement And Structural Steel.",
      exploreLink: "/services/steel-testing",
      exploreText: "Explore →",
      order: 2,
      inlineLinks: [],
    },
  ],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  const trimmed = path.trim(); // API data can contain stray leading spaces, e.g. " /images/services/x.jpg"
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function WhatWeTestSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        {/* Sub copy Skeleton */}
        <div className="mb-12 max-w-[668px]">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-6 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative w-full aspect-[470/336] overflow-hidden rounded-[30px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* View all button Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="h-14 w-48 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

function WhatWeTest() {
  const [data, setData] = useState<ServicesData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const res = await api.get("/home-services");
        const raw = res.data;

        // The endpoint normally returns the document directly as an object:
        // { sectionTitle, heroTitle, ..., services: [ {...}, {...} ] }
        // But stay defensive in case it's ever wrapped in an array of documents
        // (e.g. a list/collection response) — never mistake a single
        // service ITEM inside `services[]` for the whole document.
        let responseData: any = null;

        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          // Sort services by order and take the first 3 for the homepage
          const sortedServices = (responseData.services || [])
            .slice()
            .sort((a: ServiceItem, b: ServiceItem) => (a.order ?? 0) - (b.order ?? 0))
            .slice(0, 3);

          const servicesData: ServicesData = {
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroSubtitle: responseData.heroSubtitle || defaultData.heroSubtitle,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            description: responseData.description || defaultData.description,
            descriptionInlineLinks: responseData.descriptionInlineLinks || [],
            services: sortedServices.length > 0 ? sortedServices : defaultData.services,
            isActive: responseData.isActive ?? true,
          };

          setData(servicesData);
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Services section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  if (isLoading) {
    return <WhatWeTestSkeleton />;
  }

  const { sectionTitle, heroTitle, heroSubtitle, description, services } = data;

  // Map services with images
  const servicesWithImages = services.map((service, index) => {
    // Use image from API or fallback
    let imageSrc;
    const resolved = resolveImage(service.image);
    if (resolved) {
      imageSrc = resolved;
    } else {
      imageSrc = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    }

    // Extract service number from serviceNumber or use index
    const serviceId = service.serviceNumber ? service.serviceNumber.replace("SERVICE ", "") : String(index + 1).padStart(2, "0");
    // Use exploreLink or fallback
    const href = service.exploreLink || `/services/${service.title.toLowerCase().replace(/ /g, "-")}`;

    return {
      ...service,
      imageSrc,
      serviceId,
      href,
    };
  });

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <span
            className="font-poppins font-normal capitalize"
            style={{
              fontSize: "clamp(18px, 4vw, 24px)",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            {sectionTitle}
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
          {heroTitle} <span className="text-[#FFA8D9]">{heroSubtitle}</span>
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
          {description}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesWithImages.map((service) => (
            <Link
              key={service._id || service.serviceNumber}
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
                src={service.imageSrc}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 470px"
                unoptimized={typeof service.imageSrc === 'string' && service.imageSrc.startsWith('http')}
              />

              {/* Base gradient overlay for text legibility (always on) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Flat dark overlay that fades in on hover, evenly darkening the whole card */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/50" />

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col"
                style={{
                  paddingTop: "clamp(24px, 6vw, 43px)",
                  paddingRight: "clamp(18px, 4.5vw, 34px)",
                  paddingBottom: "clamp(24px, 6vw, 44px)",
                  paddingLeft: "clamp(18px, 4.5vw, 34px)",
                }}
              >
                {/* Service badge */}
                <span
                  className="font-poppins font-normal capitalize"
                  style={{
                    fontSize: "clamp(14px, 3vw, 18px)",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#FFA7DC",
                  }}
                >
                  Service {service.serviceId}
                </span>

                {/* Spacer pushes title block to a fixed distance from the bottom */}
                <div className="flex flex-1 flex-col justify-end gap-3">
                  <h3
                    className="font-poppins font-semibold capitalize text-white"
                    style={{
                      fontSize: "clamp(22px, 5vw, 32px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    className="line-clamp-3 font-poppins font-normal capitalize"
                    style={{
                      fontSize: "clamp(13px, 3vw, 16px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                      color: "#D9D9D9",
                    }}
                  >
                    {service.description}
                  </p>

                  <span
                    className="mt-1 flex items-center gap-[10px] font-poppins font-medium capitalize"
                    style={{
                      fontSize: "clamp(16px, 4vw, 22px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                      color: "#FC0198",
                    }}
                  >
                    {service.exploreText || "Explore"}
                  
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
              px-6
              py-3.5
              sm:px-8
              sm:py-4
              font-poppins
              font-medium
              capitalize
              text-white
              transition-colors
              hover:bg-[#4d002e]
            "
            style={{
              fontSize: "clamp(16px, 3.5vw, 18px)",
              lineHeight: "120%",
              letterSpacing: "0px",
            }}
          >
            View All Service
            <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhatWeTest;