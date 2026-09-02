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

interface ProcessStep {
  _id?: string;
  stepNumber: string;
  title: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ManagementProcessData {
  _id?: string;
  managementTitle: string;
  managementSubtitle: string;
  managementSubtitleTwo: string;
  managementSubtitleThree: string;
  managementDescription: string;
  managingDirectorName: string;
  managingDirectorTitle: string;
  managingDirectorImage: string;
  managingDirectorImageAlt: string;
  managementInlineLinks: InlineLink[];
  additionalInfo: string;
  additionalInfoInlineLinks: InlineLink[];
  processTitle: string;
  processSubtitle: string;
  processSteps: ProcessStep[];
  processInlineLinks: InlineLink[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const defaultData: ManagementProcessData = {
  managementTitle: "Management",
  managementSubtitle: "EXPERIENCED",
  managementSubtitleTwo: "PEOPLE.",
  managementSubtitleThree: "RELIABLE RESULTS.",
  managementDescription:
    "Abdullah Mohammad Has Over 10 Years Of Experience In Geotechnical And Materials Testing Laboratory Operations, Including Quality-Control Activities Under ISO 17025:2017 And Management Of Major Projects In Dubai And Abu Dhabi.",
  managingDirectorName: "ABDULLAH MOHAMMAD",
  managingDirectorTitle: "MANAGING DIRECTOR",
  managingDirectorImage: "",
  managingDirectorImageAlt: "Abdullah Mohammad - Managing Director",
  managementInlineLinks: [],
  additionalInfo: "Additional Technical Personnel Profiles Available On Request.",
  additionalInfoInlineLinks: [],
  processTitle: "Testing Process",
  processSubtitle: "FROM FIELD INVESTIGATION TO FINAL REPORT",
  processSteps: [
    { stepNumber: "01", title: "SITE INVESTIGATION", order: 0, inlineLinks: [] },
    { stepNumber: "02", title: "LABORATORY TESTING", order: 1, inlineLinks: [] },
    { stepNumber: "03", title: "TECHNICAL REPORT", order: 2, inlineLinks: [] },
    { stepNumber: "04", title: "QUALITY REVIEW", order: 3, inlineLinks: [] },
  ],
  processInlineLinks: [],
  isActive: true,
};

// ─────────────────────────────────────────────────────────
// Layout constants (px) — this is the "design canvas" size.
// Everything below is converted to % / cqw so it scales
// fluidly with the container instead of using fixed pixels.
// ─────────────────────────────────────────────────────────
const CARD_W = 470;
const CARD_H = 274;
const GAP_UP = 44; // connector length: top card -> spine
const GAP_DOWN = 36; // connector length: spine -> bottom card
const SPINE_H = 11;
const CONTAINER_W = 1464;
const TOP_ROW_Y = 0;
const SPINE_Y = CARD_H + GAP_UP;
const BOTTOM_ROW_Y = SPINE_Y + SPINE_H + GAP_DOWN;
const CONTAINER_H = BOTTOM_ROW_Y + CARD_H;

// Convert a design px value into a % of container width or height
const pctW = (px: number) => `${((px / CONTAINER_W) * 100).toFixed(4)}%`;
const pctH = (px: number) => `${((px / CONTAINER_H) * 100).toFixed(4)}%`;
// Convert a design px value into cqw (scales with the queried
// container's inline size — used for anything that must scale
// uniformly regardless of row: font sizes, paddings, radii, thin bars)
const cqw = (px: number) => `${((px / CONTAINER_W) * 100).toFixed(4)}cqw`;

function TestingProcessSkeleton() {
  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-300" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-10 md:mb-14">
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-300 sm:h-11 md:h-14 xl:h-16" />
        </div>

        {/* Desktop Timeline Skeleton */}
        <div
          className="hidden md:block"
          style={{ containerType: "inline-size" } as React.CSSProperties}
        >
          <div
            className="relative mx-auto w-full max-w-[1464px]"
            style={{ aspectRatio: `${CONTAINER_W} / ${CONTAINER_H}` }}
          >
            <div
              className="absolute rounded-full bg-gray-300"
              style={{ left: 0, top: pctH(SPINE_Y), width: "100%", height: pctH(SPINE_H) }}
            />
            {[1, 2, 3, 4].map((_, i) => {
              const frac = (i + 1) / 6;
              const centerX = frac * CONTAINER_W;
              const left = centerX - CARD_W / 2;
              const isTop = i % 2 === 0;

              return (
                <div key={i}>
                  <div
                    className="absolute bg-gray-300"
                    style={{
                      left: pctW(centerX - 1),
                      top: isTop ? pctH(CARD_H) : pctH(SPINE_Y),
                      width: cqw(11),
                      height: isTop ? pctH(GAP_UP + SPINE_H) : pctH(GAP_DOWN + SPINE_H),
                    }}
                  />
                  <div
                    className="absolute animate-pulse bg-gray-300"
                    style={{
                      left: pctW(left),
                      top: isTop ? pctH(TOP_ROW_Y) : pctH(BOTTOM_ROW_Y),
                      width: pctW(CARD_W),
                      height: pctH(CARD_H),
                      borderRadius: cqw(30),
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="flex flex-col gap-4 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[150px] animate-pulse rounded-[24px] bg-gray-300 p-6 sm:h-[170px] sm:p-8"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Card content shared between desktop timeline + mobile stack.
// Hover: the accent line extends, and a border fades in.
// ─────────────────────────────────────────────────────────
function StepCardInner({
  step,
  numberFontPx,
  titleFontPx,
}: {
  step: ProcessStep;
  numberFontPx: number;
  titleFontPx: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
       <span
  className="block h-px origin-left bg-[#FC0198] transition-transform duration-300 ease-out group-hover:scale-x-[4]"
  style={{ width: cqw(12) }}
/>
        <span
          className="font-poppins font-medium capitalize text-[#FC0198]"
          style={{ fontSize: cqw(numberFontPx), lineHeight: "100%" }}
        >
          {step.stepNumber}
        </span>
      </div>

      <h3
        className="font-poppins font-semibold uppercase text-white"
        style={{ fontSize: cqw(titleFontPx), lineHeight: "120%" }}
      >
        {step.title}
      </h3>
    </>
  );
}

function TestingProcess() {
  const [data, setData] = useState<ManagementProcessData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManagementData = async () => {
      try {
        const res = await api.get("/home-management-process");

        if (res.data && typeof res.data === "object") {
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (
            responseData.managementProcess &&
            Array.isArray(responseData.managementProcess) &&
            responseData.managementProcess.length > 0
          ) {
            responseData = responseData.managementProcess[0];
          }

          const sortedSteps = (responseData.processSteps || []).sort(
            (a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0)
          );

          const managementData: ManagementProcessData = {
            _id: responseData._id,
            managementTitle: responseData.managementTitle || defaultData.managementTitle,
            managementSubtitle: responseData.managementSubtitle || defaultData.managementSubtitle,
            managementSubtitleTwo: responseData.managementSubtitleTwo || defaultData.managementSubtitleTwo,
            managementSubtitleThree: responseData.managementSubtitleThree || defaultData.managementSubtitleThree,
            managementDescription: responseData.managementDescription || defaultData.managementDescription,
            managingDirectorName: responseData.managingDirectorName || defaultData.managingDirectorName,
            managingDirectorTitle: responseData.managingDirectorTitle || defaultData.managingDirectorTitle,
            managingDirectorImage: responseData.managingDirectorImage || "",
            managingDirectorImageAlt: responseData.managingDirectorImageAlt || defaultData.managingDirectorImageAlt,
            managementInlineLinks: responseData.managementInlineLinks || [],
            additionalInfo: responseData.additionalInfo || defaultData.additionalInfo,
            additionalInfoInlineLinks: responseData.additionalInfoInlineLinks || [],
            processTitle: responseData.processTitle || defaultData.processTitle,
            processSubtitle: responseData.processSubtitle || defaultData.processSubtitle,
            processSteps: sortedSteps,
            processInlineLinks: responseData.processInlineLinks || [],
            isActive: responseData.isActive ?? true,
          };

          setData(managementData);
        }
      } catch (err) {
        console.error("Failed to fetch Management & Process section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagementData();
  }, []);

  if (isLoading) {
    return <TestingProcessSkeleton />;
  }

  const { processTitle, processSubtitle, processSteps } = data;
  const steps = processSteps.length > 0 ? processSteps : defaultData.processSteps;

  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <span className="font-poppins font-normal capitalize text-[#67003E] text-lg sm:text-xl md:text-2xl leading-none">
            {processTitle}
          </span>
        </div>

        {/* Heading */}
        <h2 className="mb-8 max-w-[863px] font-poppins font-bold uppercase leading-[112%] text-black text-[26px] sm:mb-10 sm:text-[36px] md:mb-14 md:text-[44px] xl:text-[60px]">
          {processSubtitle}
        </h2>

        {/* ===== Desktop / tablet timeline (md and up) =====
            container-type: inline-size makes `cqw` units below scale
            with THIS element's rendered width — so at 768px wide it's
            ~52% the size of the 1464px design, and it never scrolls. */}
        <div
          className="hidden md:block"
          style={{ containerType: "inline-size" } as React.CSSProperties}
        >
          <div
            className="relative mx-auto w-full max-w-[1464px]"
            style={{ aspectRatio: `${CONTAINER_W} / ${CONTAINER_H}` }}
          >
            {/* Spine */}
            <div
              className="absolute rounded-full bg-[#67003E]"
              style={{ left: 0, top: pctH(SPINE_Y), width: "100%", height: pctH(SPINE_H) }}
            />

            {steps.map((step, i) => {
              const frac = (i + 1) / 6;
              const centerX = frac * CONTAINER_W;
              const left = centerX - CARD_W / 2;
              const isTop = i % 2 === 0;

              const connectorTop = isTop ? CARD_H : SPINE_Y;
              const connectorHeight = isTop ? GAP_UP + SPINE_H : GAP_DOWN + SPINE_H;

              return (
                <div key={step._id || step.stepNumber}>
                  {/* Connector tick */}
                  <div
                    className="absolute bg-[#67003E]"
                    style={{
                      left: pctW(centerX - 1),
                      top: pctH(connectorTop),
                      width: cqw(11),
                      height: pctH(connectorHeight),
                    }}
                  />

                  {/* Card */}
                  <div
                    className="group absolute flex cursor-pointer flex-col justify-between border-2 border-transparent bg-[#67003E] transition-all duration-300 hover:border-[#FC0198] hover:border-4"
                    style={{
                      left: pctW(left),
                      top: isTop ? pctH(TOP_ROW_Y) : pctH(BOTTOM_ROW_Y),
                      width: pctW(CARD_W),
                      height: pctH(CARD_H),
                      paddingTop: cqw(59),
                      paddingRight: cqw(56),
                      paddingBottom: cqw(59),
                      paddingLeft: cqw(56),
                      gap: cqw(10),
                      borderRadius: cqw(30),
                    }}
                  >
                    <StepCardInner step={step} numberFontPx={58} titleFontPx={28} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Mobile stacked fallback (< md) ===== */}
        <div className="flex flex-col gap-4 md:hidden">
          {steps.map((step) => (
            <div
              key={step._id || step.stepNumber}
              className="group flex cursor-pointer flex-col justify-between rounded-[24px] border-2 border-transparent bg-[#67003E] p-6 transition-all duration-300 hover:border-[#FC0198] hover:shadow-[0_0_0_4px_rgba(252,1,152,0.15)] sm:rounded-[30px] sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between sm:mb-6">
<span className="h-px w-3 origin-left bg-[#FC0198] transition-transform duration-300 ease-out group-hover:scale-x-[4] sm:w-4" />                <span
                  className="font-poppins font-medium capitalize text-[#FC0198]"
                  style={{ fontSize: "clamp(32px, 10vw, 48px)", lineHeight: "100%" }}
                >
                  {step.stepNumber}
                </span>
              </div>

              <h3
                className="font-poppins font-semibold uppercase text-white"
                style={{ fontSize: "clamp(18px, 5vw, 24px)", lineHeight: "120%" }}
              >
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestingProcess;