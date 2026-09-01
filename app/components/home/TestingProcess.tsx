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
  managementDescription: "Abdullah Mohammad Has Over 10 Years Of Experience In Geotechnical And Materials Testing Laboratory Operations, Including Quality-Control Activities Under ISO 17025:2017 And Management Of Major Projects In Dubai And Abu Dhabi.",
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

// Layout constants (px) — derived from the reference design
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

function TestingProcessSkeleton() {
  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Heading Skeleton */}
        <div className="mb-14">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 xl:h-16" />
        </div>

        {/* Desktop Timeline Skeleton */}
        <div className="hidden md:block">
          <div className="relative mx-auto" style={{ width: CONTAINER_W, height: CONTAINER_H }}>
            <div
              className="absolute rounded-full bg-gray-300"
              style={{
                left: 0,
                top: SPINE_Y,
                width: CONTAINER_W,
                height: SPINE_H,
              }}
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
                      left: centerX - 1,
                      top: isTop ? CARD_H : SPINE_Y,
                      width: 11,
                      height: isTop ? GAP_UP + SPINE_H : GAP_DOWN + SPINE_H,
                    }}
                  />
                  <div
                    className="absolute bg-gray-300 animate-pulse"
                    style={{
                      left,
                      top: isTop ? TOP_ROW_Y : BOTTOM_ROW_Y,
                      width: CARD_W,
                      height: CARD_H,
                      borderRadius: "30px",
                      paddingTop: "59px",
                      paddingRight: "56px",
                      paddingBottom: "59px",
                      paddingLeft: "56px",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="flex flex-col gap-6 md:hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[30px] bg-gray-300 animate-pulse p-8" style={{ height: "150px" }} />
          ))}
        </div>
      </div>
    </section>
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
          // Check if response is array or single object
          let responseData = res.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            responseData = responseData[0];
          } else if (responseData.managementProcess && Array.isArray(responseData.managementProcess) && responseData.managementProcess.length > 0) {
            responseData = responseData.managementProcess[0];
          }

          // Sort process steps by order
          const sortedSteps = (responseData.processSteps || [])
            .sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0));

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

  // Use process steps from API or fallback to default
  const steps = processSteps.length > 0 ? processSteps : defaultData.processSteps;

  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <span
            className="font-poppins font-normal capitalize"
            style={{
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            {processTitle}
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-14
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
          style={{
            letterSpacing: "0px",
            width: "863px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          {processSubtitle}
        </h2>

        {/* ===== Desktop / tablet timeline ===== */}
        <div className="hidden overflow-x-auto md:block">
          <div
            className="relative mx-auto"
            style={{ width: CONTAINER_W, height: CONTAINER_H }}
          >
            {/* Spine */}
            <div
              className="absolute rounded-full bg-[#67003E]"
              style={{
                left: 0,
                top: SPINE_Y,
                width: CONTAINER_W,
                height: SPINE_H,
              }}
            />

            {steps.map((step, i) => {
              const frac = (i + 1) / 6;
              const centerX = frac * CONTAINER_W;
              const left = centerX - CARD_W / 2;
              const isTop = i % 2 === 0;

              const connectorTop = isTop ? CARD_H : SPINE_Y;
              const connectorHeight = isTop
                ? GAP_UP + SPINE_H
                : GAP_DOWN + SPINE_H;

              return (
                <div key={step._id || step.stepNumber}>
                  {/* Connector tick */}
                  <div
                    className="absolute bg-[#67003E]"
                    style={{
                      left: centerX - 1,
                      top: connectorTop,
                      width: 11,
                      height: connectorHeight,
                    }}
                  />

                  {/* Card */}
                  <div
                    className="absolute flex flex-col justify-between bg-[#67003E]"
                    style={{
                      left,
                      top: isTop ? TOP_ROW_Y : BOTTOM_ROW_Y,
                      width: CARD_W,
                      height: CARD_H,
                      paddingTop: "59px",
                      paddingRight: "56px",
                      paddingBottom: "59px",
                      paddingLeft: "56px",
                      gap: "10px",
                      borderRadius: "30px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="h-px w-10 bg-[#FC0198]" />
                      <span
                        className="font-poppins font-medium capitalize"
                        style={{
                          fontSize: "58px",
                          lineHeight: "100%",
                          letterSpacing: "0px",
                          color: "#FC0198",
                        }}
                      >
                        {step.stepNumber}
                      </span>
                    </div>

                    <h3
                      className="font-poppins font-semibold uppercase text-white"
                      style={{
                        fontSize: "28px",
                        lineHeight: "120%",
                        letterSpacing: "0px",
                      }}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Mobile stacked fallback ===== */}
        <div className="flex flex-col gap-6 md:hidden">
          {steps.map((step) => (
            <div
              key={step._id || step.stepNumber}
              className="flex flex-col justify-between rounded-[30px] bg-[#67003E] p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="h-px w-10 bg-[#FC0198]" />
                <span
                  className="font-poppins font-medium capitalize"
                  style={{
                    fontSize: "48px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#FC0198",
                  }}
                >
                  {step.stepNumber}
                </span>
              </div>

              <h3
                className="font-poppins font-semibold uppercase text-white"
                style={{
                  fontSize: "24px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
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