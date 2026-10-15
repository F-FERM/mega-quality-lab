"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
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
    { stepNumber: "02", title: "SAMPLE COLLECTION", order: 1, inlineLinks: [] },
    { stepNumber: "03", title: "LABORATORY TESTING", order: 2, inlineLinks: [] },
    { stepNumber: "04", title: "QUALITY REVIEW", order: 3, inlineLinks: [] },
    { stepNumber: "05", title: "TECHNICAL REPORT", order: 4, inlineLinks: [] },
  ],
  processInlineLinks: [],
  isActive: true,
};

// ─────────────────────────────────────────────────────────
// Desktop design canvas (px). Everything is converted to % / cqw
// so the timeline scales fluidly with its container width.
//
// Canvas: 1566 x 610, card: 421 x 244
// 244 + 64 + 11 + 47 + 244 = 610
// ─────────────────────────────────────────────────────────
const CARD_W = 421;
const CARD_H = 244;
const GAP_UP = 64; // top card -> spine
const GAP_DOWN = 47; // spine -> bottom card
const SPINE_H = 11;
const CONTAINER_W = 1566;
const TOP_ROW_Y = 0;
const SPINE_Y = CARD_H + GAP_UP;
const BOTTOM_ROW_Y = SPINE_Y + SPINE_H + GAP_DOWN;
const CONTAINER_H = BOTTOM_ROW_Y + CARD_H; // 610
const CONNECTOR_W = 8;
const HOVER_GROW = 28; // card grows 14px up + 14px down on hover (design px)

// Timeline only works well up to 6 cards (same-row cards must not overlap)
const MAX_TIMELINE_STEPS = 6;

const pctW = (px: number) => `${((px / CONTAINER_W) * 100).toFixed(4)}%`;
const pctH = (px: number) => `${((px / CONTAINER_H) * 100).toFixed(4)}%`;
const cqw = (px: number) => `${((px / CONTAINER_W) * 100).toFixed(4)}cqw`;
// cqw with a readable minimum size (for text)
const cqwMin = (px: number, minPx: number) =>
  `max(${minPx}px, ${((px / CONTAINER_W) * 100).toFixed(4)}cqw)`;

// Timeline is shown from `lg` (1024px) up. Below that: grid / stack.
// Slot fraction for card i, when there are n cards.
const slotFrac = (i: number, n: number) => (i + 1) / (n + 1);

// ─────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────
function TestingProcessSkeleton() {
  const items = [1, 2, 3, 4, 5];
  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 xl:py-28">
      <div className="mx-auto w-full max-w-[1566px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-[#67003E] sm:w-12" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-300 sm:w-40" />
        </div>

        <div className="mb-10 md:mb-14">
          <div className="h-9 w-full max-w-[863px] animate-pulse rounded bg-gray-300 sm:h-11 md:h-14 xl:h-16" />
        </div>

        {/* Desktop skeleton */}
        <div
          className="hidden lg:block"
          style={{ containerType: "inline-size" } as React.CSSProperties}
        >
          <div
            className="relative mx-auto w-full max-w-[1566px]"
            style={{ aspectRatio: `${CONTAINER_W} / ${CONTAINER_H}` }}
          >
            <div
              className="absolute rounded-full bg-gray-300"
              style={{
                left: 0,
                top: pctH(SPINE_Y),
                width: "100%",
                height: pctH(SPINE_H),
              }}
            />
            {items.map((_, i) => {
              const centerX = slotFrac(i, items.length) * CONTAINER_W;
              const left = centerX - CARD_W / 2;
              const isTop = i % 2 === 0;
              return (
                <div key={i}>
                  <div
                    className="absolute bg-gray-300"
                    style={{
                      left: pctW(centerX),
                      transform: "translateX(-50%)",
                      top: isTop ? pctH(CARD_H) : pctH(SPINE_Y),
                      width: cqw(CONNECTOR_W),
                      height: isTop
                        ? pctH(GAP_UP + SPINE_H)
                        : pctH(GAP_DOWN + SPINE_H),
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

        {/* Mobile / tablet skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {items.map((i) => (
            <div
              key={i}
              className="h-[130px] animate-pulse rounded-[24px] bg-gray-300 sm:h-[150px] md:h-[170px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Desktop card content (sizes in cqw so they scale with the timeline)
// ─────────────────────────────────────────────────────────
function DesktopCardInner({ step }: { step: ProcessStep }) {
  return (
    <>
      <div className="flex items-start justify-between">
        {/* Accent line: hidden by default, grows in on hover */}
        <span
          className="block origin-left scale-x-0 bg-[#FC0198] transition-transform duration-300 ease-out group-hover:scale-x-100"
          style={{ width: cqw(68), height: cqw(3), marginTop: cqw(8) }}
        />
        <span
          className="font-poppins font-medium capitalize text-[#FC0198]"
          style={{ fontSize: cqw(58), lineHeight: "100%", letterSpacing: 0 }}
        >
          {step.stepNumber}
        </span>
      </div>

      <h3
        className="font-poppins font-semibold uppercase text-white"
        style={{ fontSize: cqw(28), lineHeight: "120%", letterSpacing: 0 }}
      >
        {step.title}
      </h3>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────
function TestingProcess() {
  const [data, setData] = useState<ManagementProcessData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

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

          const sortedSteps = [...(responseData.processSteps || [])].sort(
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
  const useTimeline = steps.length <= MAX_TIMELINE_STEPS;

  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 xl:py-28">
      <div className="mx-auto w-full max-w-[1566px]">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="h-px w-8 shrink-0 bg-[#67003E] sm:w-12" />
          <span className="font-poppins text-lg font-normal capitalize leading-none text-[#67003E] sm:text-xl md:text-2xl">
            {processTitle}
          </span>
        </div>

        {/* Heading */}
        <h2 className="mb-8 max-w-[863px] font-poppins text-[26px] font-bold uppercase leading-[112%] text-black sm:mb-10 sm:text-[34px] md:mb-12 md:text-[42px] lg:mb-14 xl:text-[60px]">
          {processSubtitle}
        </h2>

        {/* ===== Desktop timeline (lg and up, 1024px+) =====
            container-type: inline-size makes `cqw` scale with this
            element's width, so the zigzag never scrolls or overflows. */}
        {useTimeline && (
          <div
            className="hidden lg:block"
            style={{ containerType: "inline-size" } as React.CSSProperties}
          >
            <div
              className="relative mx-auto w-full max-w-[1566px]"
              style={{ aspectRatio: `${CONTAINER_W} / ${CONTAINER_H}` }}
            >
              {/* Spine */}
              <div
                className="absolute rounded-full bg-[#67003E]"
                style={{
                  left: 0,
                  top: pctH(SPINE_Y),
                  width: "100%",
                  height: pctH(SPINE_H),
                }}
              />

              {steps.map((step, i) => {
                const centerX = slotFrac(i, steps.length) * CONTAINER_W;
                const left = centerX - CARD_W / 2;
                const isTop = i % 2 === 0;
                const isHovered = hovered === i;

                const connectorTop = isTop ? CARD_H : SPINE_Y;
                const connectorHeight = isTop
                  ? GAP_UP + SPINE_H
                  : GAP_DOWN + SPINE_H;

                return (
                  <div key={step._id || `${step.stepNumber}-${i}`}>
                    {/* Connector */}
                    <div
                      className="absolute bg-[#67003E]"
                      style={{
                        left: pctW(centerX),
                        transform: "translateX(-50%)",
                        top: pctH(connectorTop),
                        width: cqw(CONNECTOR_W),
                        height: pctH(connectorHeight),
                      }}
                    />

                    {/* Card: on hover it grows 14px up/down and shows a pink ring */}
                    <div
                      tabIndex={0}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      className="group absolute box-border flex cursor-pointer flex-col justify-between overflow-hidden bg-[#67003E] outline-none transition-[top,height,box-shadow] duration-300 ease-out hover:z-10 focus:z-10"
                      style={{
                        left: pctW(left),
                        top: pctH(
                          (isTop ? TOP_ROW_Y : BOTTOM_ROW_Y) - (isHovered ? HOVER_GROW / 2 : 0)
                        ),
                        width: pctW(CARD_W),
                        height: pctH(CARD_H + (isHovered ? HOVER_GROW : 0)),
                        paddingTop: cqw(59),
                        paddingRight: cqw(56),
                        paddingBottom: cqw(59),
                        paddingLeft: cqw(56),
                        gap: cqw(10),
                        borderRadius: cqw(30),
                        boxShadow: isHovered ? `inset 0 0 0 ${cqw(3)} #FC0198` : "none",
                      }}
                    >
                      <DesktopCardInner step={step} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== Tablet / mobile fallback (< lg) =====
            < 640px : 1 column
            640–1023: 2 columns
            Also used on every screen if there are more than 6 steps. */}
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 ${
            useTimeline ? "lg:hidden" : "lg:grid-cols-3"
          }`}
        >
          {steps.map((step, i) => (
            <div
              key={step._id || `${step.stepNumber}-${i}`}
              className="group flex min-h-[130px] cursor-pointer flex-col justify-between gap-4 rounded-[24px] bg-[#67003E] p-6 transition-shadow duration-300 hover:shadow-[inset_0_0_0_3px_#FC0198] sm:min-h-[160px] sm:rounded-[28px] sm:p-7 md:min-h-[190px] md:rounded-[30px] md:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="block h-[2px] w-10 origin-left scale-x-0 bg-[#FC0198] transition-transform duration-300 ease-out group-hover:scale-x-100 group-active:scale-x-100 sm:w-14" />
                <span
                  className="font-poppins font-medium capitalize text-[#FC0198]"
                  style={{ fontSize: "clamp(32px, 7vw, 52px)", lineHeight: "100%" }}
                >
                  {step.stepNumber}
                </span>
              </div>

              <h3
                className="font-poppins font-semibold uppercase text-white"
                style={{ fontSize: "clamp(15px, 3.6vw, 22px)", lineHeight: "120%" }}
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