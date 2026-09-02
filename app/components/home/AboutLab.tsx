"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import ABOUT_IMG_1 from "../../../public/images/lab1.jpg";
import ABOUT_IMG_2 from "../../../public/images/lab2.jpg";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface StatItem {
  _id?: string;
  value: string;
  label: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface AboutData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  imageOne: string;
  imageOneAlt: string;
  imageTwo: string;
  imageTwoAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  featureOne: string;
  featureTwo: string;
  featureThree: string;
  featureInlineLinks: InlineLink[];
  stats: StatItem[];
  isActive: boolean;
}

const defaultData: AboutData = {
  sectionTitle: "About The Laboratory",
  heroTitle: "TESTING THAT",
  heroTitleTwo: "SUPPORTS BETTER",
  heroTitleThree: "CONSTRUCTION",
  imageOne: "",
  imageOneAlt: "Mega Quality Laboratory - Testing Equipment",
  imageTwo: "",
  imageTwoAlt: "Mega Quality Laboratory - Soil Testing",
  heroInlineLinks: [],
  description:
    "Mega Quality Laboratory For Soil And Building Materials Testing Is A Professionally Competent And Independent Laboratory Serving Construction And Infrastructure Requirements In The UAE.",
  descriptionInlineLinks: [],
  featureOne:
    "The Laboratory Provides Material Testing Services To Contractors, Consultants And Private Agencies, With Testing Activities Managed Under A Quality System Aligned With ISO/IEC 17025:2017.",
  featureTwo:
    "The Laboratory is Supported By Technically Qualified Personnel And Appropriate Testing Equipment,",
  featureThree:
    "Operating From Facilities In Dubai And Ras Al Khaimah.",
  featureInlineLinks: [],
  stats: [
    { value: "2020", label: "Established", order: 0, inlineLinks: [] },
    { value: "17025", label: "ISO/IEC Aligned", order: 1, inlineLinks: [] },
    { value: "2", label: "UAE Locations", order: 2, inlineLinks: [] },
  ],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function AboutSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-17">
      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-9">
        {/* Image Skeleton */}
        <div className="relative mx-auto w-full max-w-[737px] pb-[70px] lg:mx-0">
          <div className="relative w-full aspect-[737/590] overflow-hidden rounded-[40px] bg-gray-200 animate-pulse" />
          <div className="absolute right-0 top-[45.5%] z-10 w-[61.7%] overflow-hidden rounded-[40px] border-[15px] border-white">
            <div className="relative aspect-[455/368] w-full bg-gray-200 animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-0 z-20 flex items-center gap-3 rounded-full bg-[#171717] px-6 py-3 sm:px-7 sm:py-3.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FC0198]" />
            <span className="whitespace-nowrap font-poppins text-sm font-normal text-white sm:text-base">
              Testing Since 2020
            </span>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex w-full max-w-[725.58px] flex-col gap-[27px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-tr-[49px] border-t border-r border-[#989898] pt-3 pr-3">
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutLab() {
  const [data, setData] = useState<AboutData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await api.get("/home-about");

        if (res.data && typeof res.data === "object") {
          // Map API response to component data
          const aboutData: AboutData = {
            _id: res.data._id,
            sectionTitle: res.data.sectionTitle || defaultData.sectionTitle,
            heroTitle: res.data.heroTitle || defaultData.heroTitle,
            heroTitleTwo: res.data.heroTitleTwo || defaultData.heroTitleTwo,
            heroTitleThree: res.data.heroTitleThree || defaultData.heroTitleThree,
            imageOne: res.data.imageOne || "",
            imageOneAlt: res.data.imageOneAlt || defaultData.imageOneAlt,
            imageTwo: res.data.imageTwo || "",
            imageTwoAlt: res.data.imageTwoAlt || defaultData.imageTwoAlt,
            heroInlineLinks: res.data.heroInlineLinks || [],
            description: res.data.description || defaultData.description,
            descriptionInlineLinks: res.data.descriptionInlineLinks || [],
            featureOne: res.data.featureOne || defaultData.featureOne,
            featureTwo: res.data.featureTwo || defaultData.featureTwo,
            featureThree: res.data.featureThree || defaultData.featureThree,
            featureInlineLinks: res.data.featureInlineLinks || [],
            stats: (res.data.stats || defaultData.stats)
              .sort((a: StatItem, b: StatItem) => (a.order || 0) - (b.order || 0)),
            isActive: res.data.isActive ?? true,
          };

          setData(aboutData);
        }
      } catch (err) {
        console.error("Failed to fetch about laboratory section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  const {
    sectionTitle,
    heroTitle,
    heroTitleTwo,
    heroTitleThree,
    imageOne,
    imageOneAlt,
    imageTwo,
    imageTwoAlt,
    description,
    featureOne,
    featureTwo,
    featureThree,
    stats,
  } = data;

  // Determine which images to use
  const imageOneSrc = imageOne ? resolveImage(imageOne) : ABOUT_IMG_1;
  const imageTwoSrc = imageTwo ? resolveImage(imageTwo) : ABOUT_IMG_2;

  // Get the first stat value for the badge (or use default)
  const establishedYear = stats.length > 0 ? stats[0].value : "2020";

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-17">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1464px]
          grid-cols-1
          items-center
          gap-12
          sm:gap-14
          lg:grid-cols-2
          lg:gap-12
          xl:gap-9
        "
      >
        {/* LEFT — IMAGE COLLAGE — one shared hover zone for both images */}
        <div
          className="
            group
            relative
            mx-auto
            w-full
            max-w-[737px]
            pb-[56px]
            sm:pb-[70px]
            lg:mx-0
          "
        >
          <div className="relative w-full aspect-[737/590] overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px]">
            <Image
              src={imageOneSrc}
              alt={imageOneAlt || "Laboratory testing equipment"}
              fill
              priority
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 1024px) 90vw, 737px"
              unoptimized={typeof imageOneSrc === 'string' && imageOneSrc.startsWith('http')}
            />
          </div>

          {/* SECOND IMAGE — border scales down on small screens so it doesn't overwhelm the inset */}
          <div
            className="
              absolute
              right-0
              top-[45.5%]
              z-10
              w-[61.7%]
              overflow-hidden
              rounded-[20px]
              sm:rounded-[28px]
              md:rounded-[40px]
              border-[8px]
              sm:border-[11px]
              md:border-[15px]
              border-white
            "
          >
            <div className="relative aspect-[455/368] w-full overflow-hidden">
              <Image
                src={imageTwoSrc}
                alt={imageTwoAlt || "Field technician collecting a soil sample"}
                fill
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                sizes="(max-width: 1024px) 55vw, 455px"
                unoptimized={typeof imageTwoSrc === 'string' && imageTwoSrc.startsWith('http')}
              />
            </div>
          </div>

          {/* TESTING SINCE BADGE — padding/text now scale from the smallest breakpoint */}
          <div
            className="
              absolute
              bottom-0
              left-0
              z-20
              flex
              max-w-[calc(100%-1rem)]
              items-center
              gap-2
              sm:gap-3
              rounded-full
              bg-[#171717]
              px-4
              py-2.5
              sm:px-6
              sm:py-3
              md:px-7
              md:py-3.5
            "
          >
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 rounded-full bg-[#FC0198]" />
            <span
              className="
                whitespace-nowrap
                overflow-hidden
                text-ellipsis
                font-poppins
                text-xs
                font-normal
                text-white
                sm:text-sm
                md:text-base
              "
            >
              Testing Since {establishedYear}
            </span>
          </div>
        </div>

        {/* RIGHT — CONTENT */}
        <div className="flex w-full max-w-[725.58px] flex-col gap-5 sm:gap-[27px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-10 sm:w-12 bg-[#67003E] shrink-0" />
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
          </div>

          {/* Heading */}
          <h2
            className="
              font-poppins
              font-bold
              uppercase
              leading-[112%]
              text-black
              text-[28px]
              sm:text-[32px]
              md:text-[48px]
              xl:text-[60px]
            "
            style={{ letterSpacing: "0px" }}
          >
            {heroTitle}
            <br />
            <span className="text-[#FFA8D9]">{heroTitleTwo}</span>
            <br />
            {heroTitleThree}
          </h2>

          {/* Lead + supporting paragraphs */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <p
              className="
                font-poppins
                text-base
                font-medium
                capitalize
                text-black
                sm:text-lg
                md:text-xl
                xl:text-[22px]
              "
              style={{ lineHeight: "120%", letterSpacing: "0px" }}
            >
              {description}
            </p>

            <p
              className="font-poppins text-sm font-normal capitalize sm:text-base"
              style={{ lineHeight: "120%", letterSpacing: "0px", color: "#686868" }}
            >
              {featureOne}
            </p>

            <p
              className="font-poppins text-sm font-normal capitalize sm:text-base"
              style={{ lineHeight: "120%", letterSpacing: "0px", color: "#686868" }}
            >
              {featureTwo} {featureThree}
            </p>
          </div>

          {/* Stats — gap and inner padding get an intermediate step */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat._id || stat.label}
                className="
                  flex
                  flex-col
                  rounded-tr-[32px]
                  sm:rounded-tr-[40px]
                  md:rounded-tr-[49px]
                  border-t
                  border-r
                  border-[#989898]
                  pt-2
                  pr-2
                  sm:pt-3
                  sm:pr-3
                "
              >
                <span
                  className="
                    font-poppins
                    font-normal
                    uppercase
                    leading-[112%]
                    text-black
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    xl:text-[40px]
                  "
                  style={{ letterSpacing: "0px" }}
                >
                  {stat.value}
                </span>
                <span
                  className="
                    text-center
                    font-poppins
                    text-xs
                    sm:text-sm
                    font-normal
                    capitalize
                    sm:text-left
                    xl:text-[18px]
                  "
                  style={{ lineHeight: "120%", letterSpacing: "0px", color: "#67003E" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutLab;