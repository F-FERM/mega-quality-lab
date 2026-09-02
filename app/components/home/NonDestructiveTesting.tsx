"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import MODULE_1_IMG from "../../../public/images/testing1.jpg";
import MODULE_2_IMG from "../../../public/images/testing2.jpg";
import MODULE_3_IMG from "../../../public/images/testing3.jpg";
import MODULE_4_IMG from "../../../public/images/testing4.jpg";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface NDTModuleItem {
  _id?: string;
  moduleNumber: string;
  title: string;
  image: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface NDTData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  ndtModules: NDTModuleItem[];
  materialTestingTitle: string;
  materialTestingInlineLinks: InlineLink[];
  equipmentTitle: string;
  equipmentTitleTwo: string;
  equipmentDescription: string;
  equipmentInlineLinks: InlineLink[];
  equipmentCategories: any[];
  equipmentItems: any[];
  isActive: boolean;
}

const FALLBACK_IMAGES = [MODULE_1_IMG, MODULE_2_IMG, MODULE_3_IMG, MODULE_4_IMG];

const defaultModules: NDTModuleItem[] = [
  {
    moduleNumber: "MODULE 01",
    title: "UPV Testing",
    image: "",
    description:
      "Ultrasonic Pulse Velocity Testing To Assess Concrete Uniformity And Quality In-Situ.",
    order: 0,
  },
  {
    moduleNumber: "MODULE 02",
    title: "Rebound Hammer",
    image: "",
    description:
      "Surface Hardness Testing Used As An Indicator Of Concrete Strength.",
    order: 1,
  },
  {
    moduleNumber: "MODULE 03",
    title: "Half-Cell Potential",
    image: "",
    description:
      "Electrochemical Assessment Of Reinforcement Corrosion Risk In Concrete Elements.",
    order: 2,
  },
  {
    moduleNumber: "MODULE 04",
    title: "Carbonation Testing",
    image: "",
    description:
      "Assessment Of Carbonation Depth To Evaluate Long-Term Durability Of Concrete.",
    order: 3,
  },
];

const defaultData: NDTData = {
  sectionTitle: "Non-Destructive Testing",
  heroTitle: "TEST WITHOUT",
  heroTitleTwo: "COMPROMISING",
  heroTitleThree: "THE STRUCTURE.",
  heroImage: "",
  heroImageAlt: "Non-Destructive Testing Services",
  heroInlineLinks: [],
  ndtModules: defaultModules,
  materialTestingTitle: "Material Testing",
  materialTestingInlineLinks: [],
  equipmentTitle: "WHERE PRECISION MEETS",
  equipmentTitleTwo: "EQUIPMENT",
  equipmentDescription:
    "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  equipmentInlineLinks: [],
  equipmentCategories: [],
  equipmentItems: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallbackIndex: number) {
  if (!path) return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  if (path.startsWith("http")) return path;
  // API sample data uses a literal "/image" placeholder — treat that as "no real image" too
  if (path === "/image") return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// "MODULE 01" -> "01"  (keeps the existing "Module {number}" label text exactly as before)
function extractModuleNumber(moduleNumber: string, fallbackOrder: number) {
  const match = moduleNumber?.match(/(\d+)/);
  return match ? match[1] : String(fallbackOrder + 1).padStart(2, "0");
}

function NDTSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-56 animate-pulse rounded bg-gray-200" />
          <span className="h-px w-12 bg-[#67003E]" />
        </div>
        <div className="mx-auto mb-16 flex max-w-[1100px] flex-col items-center gap-3">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full max-w-[350px] sm:w-[280px] md:w-[310px] lg:w-[330px] xl:w-[350px] rounded-[36px] sm:rounded-[50px] border border-[#E4E4E4] bg-white overflow-hidden"
            >
              <div className="h-[180px] sm:h-[195px] md:h-[210px] w-full animate-pulse bg-gray-200" />
              <div className="flex flex-col gap-2 px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NonDestructiveTesting() {
  const [data, setData] = useState<NDTData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNDTData = async () => {
      try {
        const res = await api.get("/home-ndt-equipment");

        if (res.data && typeof res.data === "object") {
          // Handle different response formats
          let ndtData = null;

          if (Array.isArray(res.data) && res.data.length > 0) {
            const activeItem = res.data.find((item: any) => item.isActive);
            ndtData = activeItem || res.data[0];
          } else if (res.data && res.data.ndtModules && Array.isArray(res.data.ndtModules)) {
            ndtData = res.data;
          } else if (res.data && res.data.sectionTitle) {
            ndtData = res.data;
          }

          if (ndtData) {
            // Sort modules by order
            const sortedModules = (ndtData.ndtModules || defaultModules)
              .sort((a: NDTModuleItem, b: NDTModuleItem) => (a.order || 0) - (b.order || 0));

            const mappedData: NDTData = {
              _id: ndtData._id,
              sectionTitle: ndtData.sectionTitle || defaultData.sectionTitle,
              heroTitle: ndtData.heroTitle || defaultData.heroTitle,
              heroTitleTwo: ndtData.heroTitleTwo || defaultData.heroTitleTwo,
              heroTitleThree: ndtData.heroTitleThree || defaultData.heroTitleThree,
              heroImage: ndtData.heroImage || "",
              heroImageAlt: ndtData.heroImageAlt || defaultData.heroImageAlt,
              heroInlineLinks: ndtData.heroInlineLinks || [],
              ndtModules: sortedModules,
              materialTestingTitle: ndtData.materialTestingTitle || defaultData.materialTestingTitle,
              materialTestingInlineLinks: ndtData.materialTestingInlineLinks || [],
              equipmentTitle: ndtData.equipmentTitle || defaultData.equipmentTitle,
              equipmentTitleTwo: ndtData.equipmentTitleTwo || defaultData.equipmentTitleTwo,
              equipmentDescription: ndtData.equipmentDescription || defaultData.equipmentDescription,
              equipmentInlineLinks: ndtData.equipmentInlineLinks || [],
              equipmentCategories: ndtData.equipmentCategories || [],
              equipmentItems: ndtData.equipmentItems || [],
              isActive: ndtData.isActive ?? true,
            };

            setData(mappedData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch NDT modules:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNDTData();
  }, []);

  if (isLoading) {
    return <NDTSkeleton />;
  }

  const {
    sectionTitle,
    heroTitle,
    heroTitleTwo,
    heroTitleThree,
    ndtModules,
  } = data;

  // Build hero title with dynamic parts
  const heroTitleText = `${heroTitle} ${heroTitleTwo} ${heroTitleThree}`;

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-8 sm:w-12 bg-[#67003E] shrink-0" />
          <span
            className="font-poppins font-normal capitalize text-lg sm:text-xl md:text-2xl"
            style={{
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            {sectionTitle}
          </span>
          <span className="h-px w-8 sm:w-12 bg-[#67003E] shrink-0" />
        </div>

        {/* Heading */}
        <h2
          className="
            mx-auto
            mb-10
            sm:mb-12
            md:mb-16
            max-w-[1100px]
            text-center
            font-poppins
            font-bold
            uppercase
            leading-[112%]
            text-black
            text-[26px]
            sm:text-[32px]
            md:text-[40px]
            lg:text-[48px]
            xl:text-[60px]
          "
          style={{ letterSpacing: "0px" }}
        >
          {heroTitle}{" "}
          <span className="text-[#FFA8D9]">{heroTitleTwo}</span>{" "}
          {heroTitleThree}
        </h2>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-4">
          {ndtModules.map((module, index) => {
            return (
              <div
                key={module._id || module.moduleNumber || index}
                className="
                  group relative flex flex-col overflow-hidden border border-[#E4E4E4] bg-white
                  w-full
                  max-w-[350px]
                  sm:w-[280px]
                  md:w-[310px]
                  lg:w-[330px]
                  xl:w-[350px]
                "
                style={{
                  borderRadius: "50px",
                  paddingTop: "1px",
                  paddingBottom: "34px",
                  gap: "10px",
                  opacity: 1,
                }}
              >
                {/* Image */}
                <div className="relative h-[180px] sm:h-[195px] md:h-[205px] xl:h-[210px] w-full shrink-0 overflow-hidden transition-all duration-500 ease-out group-hover:h-[200px] sm:group-hover:h-[215px] md:group-hover:h-[228px] xl:group-hover:h-[235px]">
                  <Image
                    src={(module.image)}
                    alt={module.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 350px"
                    unoptimized={typeof module.image === "string" && module.image.startsWith("http")}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 bg-white px-5 sm:px-6">
                  <span
                    className="font-poppins font-normal capitalize text-base sm:text-lg"
                    style={{
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      color: "#67003E",
                    }}
                  >
                     {module.moduleNumber}
                  </span>

                  <h3
                    className="mt-1 font-poppins font-semibold capitalize text-black text-xl sm:text-2xl"
                    style={{
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {module.title}
                  </h3>

                  <p
                    className="mt-1 font-poppins font-normal capitalize text-sm sm:text-base"
                    style={{
                      lineHeight: "130%",
                      letterSpacing: "0px",
                      color: "#656565",
                    }}
                  >
                    {module.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default NonDestructiveTesting;