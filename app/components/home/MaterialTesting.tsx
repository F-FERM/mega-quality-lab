"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface EquipmentItem {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  inlineLinks: InlineLink[];
}

interface EquipmentCategory {
  _id?: string;
  title: string;
  order: number;
  inlineLinks: InlineLink[];
}

interface NdtEquipmentData {
  _id?: string;
  materialTestingTitle: string;
  materialTestingInlineLinks: InlineLink[];
  equipmentTitle: string;
  equipmentTitleTwo: string;
  equipmentDescription: string;
  equipmentInlineLinks: InlineLink[];
  equipmentCategories: EquipmentCategory[];
  equipmentItems: EquipmentItem[];
  isActive: boolean;
}

const defaultData: NdtEquipmentData = {
  materialTestingTitle: "Material Testing",
  materialTestingInlineLinks: [],
  equipmentTitle: "WHERE PRECISION MEETS",
  equipmentTitleTwo: "EQUIPMENT",
  equipmentDescription:
    "Documented Laboratory Equipment Used In Testing Operations. Specifications Shown Are Limited To What Has Been Verified By The Laboratory.",
  equipmentInlineLinks: [],
  equipmentCategories: [
    { title: "Concrete Testing", order: 0, inlineLinks: [] },
    { title: "Soil Testing", order: 1, inlineLinks: [] },
    { title: "Sample Preparation", order: 2, inlineLinks: [] },
  ],
  equipmentItems: [
    {
      title: "Compression Testing Machine 3000 KN",
      subtitle: "Machine 3000 KN",
      description:
        "Ultrasonic Pulse Velocity Testing To Assess Concrete Uniformity And Quality In-Situ.",
      image: "",
      imageAlt: "Compression Testing Machine 3000 KN",
      order: 0,
      inlineLinks: [],
    },
    {
      title: "Triaxial Shear Testing Apparatus",
      subtitle: "Apparatus",
      description:
        "Used To Determine Shear Strength Parameters Of Soil Samples Under Controlled Conditions.",
      image: "",
      imageAlt: "Triaxial Shear Testing Apparatus",
      order: 1,
      inlineLinks: [],
    },
    {
      title: "Laboratory Sample Preparation Bay",
      subtitle: "Preparation Bay",
      description:
        "Controlled Preparation Environment For Soil, Concrete And Aggregate Specimens Ahead Of Testing.",
      image: "",
      imageAlt: "Laboratory Sample Preparation Bay",
      order: 2,
      inlineLinks: [],
    },
  ],
  isActive: true,
};

// Import images as fallback
import EQUIPMENT_1_IMG from "../../../public/images/equipment1.jpg";
import EQUIPMENT_2_IMG from "../../../public/images/equipment2.jpg";
import EQUIPMENT_3_IMG from "../../../public/images/equipment3.jpg";

const FALLBACK_IMAGES = [EQUIPMENT_1_IMG, EQUIPMENT_2_IMG, EQUIPMENT_3_IMG];

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function MaterialTestingSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
          <span className="h-6 w-40 max-w-[60%] animate-pulse rounded bg-gray-200" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-6">
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        {/* Sub copy Skeleton */}
        <div className="mb-12 max-w-[900px]">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-6 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Cards Skeleton */}
        <div className="flex flex-wrap justify-center gap-6 lg:justify-between">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative w-full max-w-[458px] overflow-hidden rounded-[28px] sm:rounded-[40px] md:rounded-[50px]"
              style={{
                aspectRatio: "458 / 451",
                boxShadow: "0px 0px 4px 0px #00000040",
              }}
            >
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
              <div className="relative flex h-full flex-col justify-end gap-2.5 p-6 sm:p-8 md:p-9">
                <div className="h-[28px] w-[160px] animate-pulse rounded-[23px] bg-gray-300 sm:h-[33px] sm:w-[211px]" />
                <div className="h-7 w-3/4 animate-pulse rounded bg-gray-300 sm:h-8" />
                <div className="h-6 w-full animate-pulse rounded bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaterialTesting() {
  const [data, setData] = useState<NdtEquipmentData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNdtEquipmentData = async () => {
      try {
        const res = await api.get("/home-ndt-equipment");

        if (res.data && typeof res.data === "object") {
          // Sort equipment items by order
          const sortedItems = (res.data.equipmentItems || []).sort(
            (a: EquipmentItem, b: EquipmentItem) => (a.order || 0) - (b.order || 0)
          );

          const ndtData: NdtEquipmentData = {
            _id: res.data._id,
            materialTestingTitle:
              res.data.materialTestingTitle || defaultData.materialTestingTitle,
            materialTestingInlineLinks: res.data.materialTestingInlineLinks || [],
            equipmentTitle: res.data.equipmentTitle || defaultData.equipmentTitle,
            equipmentTitleTwo: res.data.equipmentTitleTwo || defaultData.equipmentTitleTwo,
            equipmentDescription:
              res.data.equipmentDescription || defaultData.equipmentDescription,
            equipmentInlineLinks: res.data.equipmentInlineLinks || [],
            equipmentCategories: (
              res.data.equipmentCategories || defaultData.equipmentCategories
            ).sort(
              (a: EquipmentCategory, b: EquipmentCategory) =>
                (a.order || 0) - (b.order || 0)
            ),
            equipmentItems: sortedItems,
            isActive: res.data.isActive ?? true,
          };

          setData(ndtData);
        }
      } catch (err) {
        console.error("Failed to fetch NDT equipment section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNdtEquipmentData();
  }, []);

  if (isLoading) {
    return <MaterialTestingSkeleton />;
  }

  const {
    materialTestingTitle,
    equipmentTitle,
    equipmentTitleTwo,
    equipmentDescription,
    equipmentItems,
    equipmentCategories,
  } = data;

  // Map equipment items with fallback images
  const equipmentWithImages = equipmentItems.map((item, index) => {
    const imageSrc = item.image
      ? resolveImage(item.image)
      : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const badgeTitle = equipmentCategories[index]?.title || item.subtitle || "Testing";

    return {
      ...item,
      imageSrc,
      badgeTitle,
    };
  });

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
          <span
            className="
              font-poppins font-normal capitalize break-words
              text-base sm:text-lg md:text-xl lg:text-2xl
            "
            style={{
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            {materialTestingTitle}
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-6
            font-poppins font-bold uppercase text-black
            leading-[120%] sm:leading-[116%] md:leading-[112%]
            break-words [overflow-wrap:anywhere]
            text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[60px]
          "
          style={{ letterSpacing: "0px" }}
        >
          {equipmentTitle} <span className="text-[#FFA8D9]">{equipmentTitleTwo}</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mb-12 max-w-[900px]
            font-poppins font-medium capitalize
            break-words [overflow-wrap:anywhere]
            text-sm sm:text-lg md:text-xl xl:text-[22px]
          "
          style={{
            lineHeight: "140%",
            letterSpacing: "0px",
            color: "#727272",
          }}
        >
          {equipmentDescription}
        </p>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:justify-between">
          {equipmentWithImages.map((equipment, index) => (
            <div
              key={equipment._id || index}
              className="
                group relative w-full max-w-[458px] overflow-hidden
                rounded-[28px] sm:rounded-[40px] md:rounded-[50px]
              "
              style={{
                aspectRatio: "458 / 451",
                boxShadow: "0px 0px 4px 0px #00000040",
              }}
            >
              {/* Background image */}
              <Image
                src={equipment.imageSrc}
                alt={equipment.imageAlt || equipment.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 458px"
                unoptimized={
                  typeof equipment.imageSrc === "string" &&
                  equipment.imageSrc.startsWith("http")
                }
              />

              {/* Base gradient overlay for text legibility (always on) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
                }}
              />

              {/* Flat dark overlay that fades in on hover, darkening the whole card */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/50" />

              {/* Content */}
              <div className="relative flex h-full min-w-0 flex-col gap-2.5 p-6 sm:p-8 md:p-9">
                {/* Badge */}
               {/* Badge */}
<div
  className="
    flex h-[32px] w-fit min-w-[150px] items-center justify-center
    gap-2 rounded-[23px] bg-[#FFCEEBB2]
    px-3.5 py-[3px]
    transition-all duration-300 ease-out
    sm:h-[36px] sm:min-w-[211px] sm:px-[19px]
    group-hover:h-[50px] group-hover:w-full group-hover:max-w-full
    group-hover:rounded-[30px] group-hover:px-5
    sm:group-hover:h-[60px] sm:group-hover:px-6
  "
>
  {/* Dot */}
  <span
    className="
      h-[5px] w-[5px] shrink-0 rounded-full bg-[#FC0198]
      transition-all duration-300 ease-out
      sm:h-[6px] sm:w-[6px]
      group-hover:h-[11px] group-hover:w-[11px]
      sm:group-hover:h-[14px] sm:group-hover:w-[14px]
    "
    aria-hidden="true"
  />

  {/* Text */}
  <span
    className="
      truncate whitespace-nowrap font-poppins font-normal capitalize
      leading-[1.3] text-[#67003E]
      transition-all duration-300 ease-out
      text-sm sm:text-[18px]
      group-hover:text-lg sm:group-hover:text-[28px]
    "
  >
    {equipment.badgeTitle}
  </span>
</div>
                {/* Spacer pushes text block to the bottom */}
                <div className="flex flex-1 min-w-0 flex-col justify-end gap-2 sm:gap-3">
                  <h3
                    className="
                      font-poppins font-semibold capitalize text-white
                      break-words [overflow-wrap:anywhere]
                      text-xl sm:text-2xl md:text-[26px]
                    "
                    style={{
                      lineHeight: "120%",
                      letterSpacing: "0px",
                    }}
                  >
                    {equipment.title}
                  </h3>

                  <p
                    className="
                      font-poppins font-normal capitalize
                      break-words [overflow-wrap:anywhere]
                      text-sm sm:text-base md:text-[18px]
                    "
                    style={{
                      lineHeight: "140%",
                      letterSpacing: "0px",
                      color: "#D9D9D9",
                    }}
                  >
                    {equipment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MaterialTesting;