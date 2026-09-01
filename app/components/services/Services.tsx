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

const FALLBACK_IMAGES = [SERVICE_1_IMG, SERVICE_2_IMG, SERVICE_3_IMG];

const defaultData: ServicesData = {
  sectionTitle: "What We Test",
  heroTitle: "OUR TESTING & INVESTIGATION",
  heroSubtitle: "SERVICES",
  heroImage: "",
  heroImageAlt: "Testing and Investigation Services",
  heroInlineLinks: [],
  description:
    "Six Core Disciplines Covering The Full Lifecycle Of Construction Materials — From Raw Aggregate To Finished Structure.",
  descriptionInlineLinks: [],
  services: [
    {
      serviceNumber: "SERVICE 01",
      title: "Concrete Testing",
      image: "",
      description:
        "Cube Compressive Strength, Core Testing, Beam Flexural Testing, Mix Design, Water Penetration And Block/Paving Block Testing.",
      exploreLink: "/services/concrete-testing",
      exploreText: "Explore →",
      order: 0,
      inlineLinks: [],
    },
    {
      serviceNumber: "SERVICE 02",
      title: "Soil Testing",
      image: "",
      description:
        "Moisture Content, Specific Gravity, Grain-Size Analysis, FSI, Atterberg Limits Classification, FDT, MDD/OMC, Direct & Triaxial Shear, CBR And Field CBR.",
      exploreLink: "/services/soil-testing",
      exploreText: "Explore →",
      order: 1,
      inlineLinks: [],
    },
    {
      serviceNumber: "SERVICE 03",
      title: "Steel Testing",
      image: "",
      description:
        "Tensile Testing, Bend Testing, Re-Bend Testing And Chemical Composition Testing For Reinforcement And Structural Steel.",
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
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function ServiceOverlayCardsSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-6">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        <div className="mb-12 max-w-[668px]">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-6 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative w-full aspect-[470/520] overflow-hidden rounded-[30px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="h-14 w-48 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

function ServiceOverlayCards() {
  const [data, setData] = useState<ServicesData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const res = await api.get("/home-services");
        const raw = res.data;

        let responseData: any = null;

        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          const sortedServices = (responseData.services || [])
            .slice()
            .sort((a: ServiceItem, b: ServiceItem) => (a.order ?? 0) - (b.order ?? 0));

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
    return <ServiceOverlayCardsSkeleton />;
  }

  const { services } = data;

  const servicesWithImages = services.map((service, index) => {
    let imageSrc;
    const resolved = resolveImage(service.image);
    if (resolved) {
      imageSrc = resolved;
    } else {
      imageSrc = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    }

    const serviceId = service.serviceNumber
      ? service.serviceNumber.replace("SERVICE ", "")
      : String(index + 1).padStart(2, "0");
    const href = service.exploreLink || `/services/${service.title.toLowerCase().replace(/ /g, "-")}`;

    return { ...service, imageSrc, serviceId, href };
  });

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Cards — 470 x 520 spec, flat #00000059 overlay */}
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
                aspect-[470/520]
                overflow-hidden
                rounded-[30px]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-2xl
                [container-type:inline-size]
              "
            >
              {/* Background image */}
              <Image
                src={service.imageSrc}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 470px"
                unoptimized={typeof service.imageSrc === "string" && service.imageSrc.startsWith("http")}
              />

              {/* Flat overlay per spec: background: #00000059 */}
              <div className="absolute inset-0 bg-[#00000059] transition-colors duration-300 group-hover:bg-[#00000080]" />

              {/*
                Content — spec: padding-top 62, right 34, bottom 61, left 34; gap 10px; radius 30 (inherited).
                Sizes use `cqw` (container query width units) instead of `vw`, so every value scales
                against the CARD's own rendered width (set via [container-type:inline-size] above),
                not the viewport. That keeps proportions correct whether the card is in a 1-col, 2-col,
                or 3-col layout, at any screen size — true container-relative responsiveness.
              */}
              <div
                className="absolute inset-0 flex flex-col transition-transform duration-300 group-hover:-translate-y-2"
                style={{
                  paddingTop: "clamp(24px, 13cqw, 62px)",
                  paddingRight: "clamp(16px, 7.2cqw, 34px)",
                  paddingBottom: "clamp(24px, 13cqw, 61px)",
                  paddingLeft: "clamp(16px, 7.2cqw, 34px)",
                }}
              >
                {/* Service badge */}
                <span
                  className="font-poppins font-normal capitalize"
                  style={{
                    fontSize: "clamp(13px, 3.8cqw, 18px)",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#FFA7DC",
                  }}
                >
                  Service {service.serviceId}
                </span>

                <div className="flex flex-1 flex-col justify-end gap-[10px]">
                  <h3
                    className="font-poppins font-semibold capitalize text-white"
                    style={{
                      fontSize: "clamp(20px, 6.8cqw, 32px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    className="line-clamp-4 font-poppins font-normal capitalize"
                    style={{
                      fontSize: "clamp(12px, 3.4cqw, 16px)",
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
                      fontSize: "clamp(15px, 4.7cqw, 22px)",
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

export default ServiceOverlayCards;