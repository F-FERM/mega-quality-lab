"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Types
interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface FeatureCard {
  _id?: string;
  number: string;
  label: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface QualityData {
  qualityTitle: string;
  qualityTitleTwo?: string;
  featureCards: FeatureCard[];
  isActive?: boolean;
}

const defaultData: QualityData = {
  qualityTitle: "QUALITY YOU CAN ",
  qualityTitleTwo: "VERIFY",
  featureCards: [
    {
      number: "01",
      label: "ACCRED",
      title: "EIAC Accredited",
      description:
        "ISO/IEC 17025:2017 — Certificate LB-TEST-271, valid 19 Feb 2025 – 18 Feb 2028.",
      order: 0,
      inlineLinks: [],
    },
    {
      number: "02",
      label: "REG",
      title: "Sharjah Municipality",
      description:
        "Registered under the Sharjah Laboratories Registration Program.",
      order: 1,
      inlineLinks: [],
    },
    {
      number: "03",
      label: "TEAM",
      title: "Technical Expertise",
      description:
        "Experienced laboratory professionals across geotechnical and materials testing.",
      order: 2,
      inlineLinks: [],
    },
    {
      number: "04",
      label: "REACH",
      title: "UAE Project Experience",
      description: "Dubai · Abu Dhabi · Sharjah · Ras Al Khaimah",
      order: 3,
      inlineLinks: [],
    },
  ],
};

function QualitySkeleton() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      {/* Title Skeleton */}
      <div className="mx-auto mb-14 max-w-4xl text-center sm:mb-20 xl:mb-24">
        <div className="h-10 w-3/4 animate-pulse rounded-md bg-gray-200 sm:h-14 md:h-16 xl:h-20 mx-auto" />
      </div>

      {/* Cards Skeleton */}
      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 xl:gap-y-12 md:grid-cols-2">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="flex flex-col justify-center rounded-[40px] border border-[#D9D9D9] bg-white
                       p-6 sm:p-8 xl:pt-12 xl:pb-12 xl:pl-10 xl:pr-[162px]"
          >
            <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 mb-6 sm:mb-7 xl:mb-8" />
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-200 mb-2 sm:mb-3" />
            <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}

function QualityVerify() {
  const [data, setData] = useState<QualityData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQualityData = async () => {
      try {
        const res = await api.get("/home");

        // Handle different response formats
        let qualityData: QualityData | null = null;

        if (Array.isArray(res.data) && res.data.length > 0) {
          // Find active hero or get first one
          const activeHero = res.data.find((item: any) => item.isActive);
          const heroData = activeHero || res.data[0];

          qualityData = {
            qualityTitle: heroData.qualityTitle || defaultData.qualityTitle,
            qualityTitleTwo: heroData.qualityTitleTwo || defaultData.qualityTitleTwo,
            featureCards: heroData.featureCards || defaultData.featureCards,
            isActive: heroData.isActive,
          };
        } else if (res.data && typeof res.data === "object" && res.data.qualityTitle) {
          qualityData = {
            qualityTitle: res.data.qualityTitle,
            qualityTitleTwo: res.data.qualityTitleTwo || defaultData.qualityTitleTwo,
            featureCards: res.data.featureCards || defaultData.featureCards,
            isActive: res.data.isActive,
          };
        } else if (res.data && typeof res.data === "object" && res.data.testingHeroes && Array.isArray(res.data.testingHeroes)) {
          const activeHero = res.data.testingHeroes.find((item: any) => item.isActive);
          const heroData = activeHero || res.data.testingHeroes[0];

          qualityData = {
            qualityTitle: heroData.qualityTitle || defaultData.qualityTitle,
            qualityTitleTwo: heroData.qualityTitleTwo || defaultData.qualityTitleTwo,
            featureCards: heroData.featureCards || defaultData.featureCards,
            isActive: heroData.isActive,
          };
        }

        if (qualityData) {
          // Sort feature cards by order
          const sortedCards = [...(qualityData.featureCards || [])]
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          setData({
            ...qualityData,
            featureCards: sortedCards,
          });
        }
      } catch (err) {
        console.error("Failed to fetch quality section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQualityData();
  }, []);

  if (isLoading) {
    return <QualitySkeleton />;
  }

  const { qualityTitle, qualityTitleTwo, featureCards } = data;

  // Use default if no data
  const displayTitle = qualityTitle || defaultData.qualityTitle;
  const displayTitleTwo = qualityTitleTwo || defaultData.qualityTitleTwo;
  const displayCards = featureCards && featureCards.length > 0 ? featureCards : defaultData.featureCards;

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <h2
        className="mx-auto mb-14 max-w-4xl text-center font-poppins font-bold uppercase text-black
                   text-[28px] leading-[112%]
                   sm:text-[36px]
                   md:text-[48px]
                   xl:text-[60px]
                   sm:mb-20 xl:mb-24"
        style={{ letterSpacing: "0px" }}
      >
        {displayTitle}
        <span style={{ color: "#FFA8D9" }}>{displayTitleTwo}</span>
      </h2>

      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 xl:gap-y-12 md:grid-cols-2">
        {displayCards.map((card) => (
          <div
            key={card._id || card.number || card.title}
            className="flex flex-col justify-center rounded-[40px] border border-[#D9D9D9] bg-white
                       p-6 sm:p-8 md:pr-10 xl:pt-12 xl:pb-12 xl:pl-10 xl:pr-[162px]
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-6 hover:border hover:border-[#D9D9D9] hover:shadow-2xl hover:shadow-black/15"
          >
            <span
              className="font-poppins font-normal capitalize mb-6 sm:mb-7 xl:mb-8
                         text-sm sm:text-base xl:text-[18px]"
              style={{
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#67003E",
              }}
            >
              {card.number} / {card.label}
            </span>

            <h3
              className="font-poppins font-semibold capitalize text-black mb-2 sm:mb-3
                         text-xl sm:text-2xl md:text-[28px] xl:text-[32px]"
              style={{
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              {card.title}
            </h3>

            <p
              className="font-poppins font-normal capitalize
                         text-sm sm:text-base xl:text-[18px]"
              style={{
                lineHeight: "160%",
                letterSpacing: "0px",
                color: "#686868",
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QualityVerify;