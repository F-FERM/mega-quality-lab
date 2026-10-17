"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import api from "@/lib/axios";

import MANAGER_FALLBACK_IMG from "../../../public/images/equipment3.jpg";

// ================= TYPES =================

interface TitleSegment {
  text: string;
  highlight: boolean;
}

interface ManagementMember {
  _id?: string;
  name: string;
  image: string;
  order: number;
  isActive?: boolean;
  title?: string; // not in the API yet, falls back below
  description?: string; // not in the API yet, falls back below
}

interface ManagementData {
  label: string;
  title: TitleSegment[];
  description: string;
  members: ManagementMember[];
}

// ================= FALLBACKS =================

// The API has no job title / description per member yet, so these are used by position.
const MEMBER_DETAILS = [
  {
    title: "Managing Director",
    description: "Guiding laboratory operations with a focus on dependable service and quality standards.",
  },
  {
    title: "CEO & Founder",
    description: "Providing leadership and direction for the laboratory's continued growth and technical excellence.",
  },
  {
    title: "CEO & Founder",
    description: "Supporting a culture of professional expertise, reliable results and quality-focused service.",
  },
];

const defaultData: ManagementData = {
  label: "Management",
  title: [
    { text: "Experienced", highlight: false },
    { text: "People", highlight: true },
    { text: ". Reliable Results.", highlight: false },
  ],
  description: "",
  members: [
    { name: "Abdullah Mohammad", image: "", order: 0 },
    { name: "Eng. Nasralden Ali Elyas Mohamed", image: "", order: 1 },
    { name: "Eng. Yousif Mohmmad Adam Sebiel", image: "", order: 2 },
  ],
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* Card grid shared by the skeleton and the real cards.
   mobile: 1 column | sm–md: 2 columns (a lone last card is centered)
   lg+: 3 columns in ONE row, cards shrink to fit
   xl+: cards stop growing at 425px and spread across the row */
const CARDS_GRID_CLASSES = `
  grid grid-cols-1 justify-items-center
  gap-5 sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-5
  xl:grid-cols-[repeat(3,minmax(0,425px))] xl:justify-between xl:gap-6
`;

// Last card alone on an odd row: center it across 2 columns on sm–md only
const LAST_CARD_CLASSES = `
  sm:last:odd:col-span-2 lg:last:odd:col-span-1
`;

// ================= MEMBER IMAGE (falls back if missing / broken) =================

function MemberImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  // "/image" is the placeholder currently stored in the API, so treat it as empty
  const isPlaceholder = !src || src === "/image";
  const resolved = isPlaceholder || failed ? "" : resolveImage(src);
  const finalSrc: string | StaticImageData = resolved || MANAGER_FALLBACK_IMG;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1536px) 31vw, 425px"
      unoptimized={typeof finalSrc === "string"}
      onError={() => setFailed(true)}
    />
  );
}

// ================= SKELETON =================

function ManagementSkeleton() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mb-10 h-24 w-full max-w-[700px] animate-pulse rounded bg-gray-200 lg:mb-14" />
        <div className={CARDS_GRID_CLASSES}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`aspect-[425/657] w-full max-w-[425px] animate-pulse rounded-[30px] bg-gray-200 ${LAST_CARD_CLASSES}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ================= MAIN COMPONENT =================

function ManagementSection() {
  const [data, setData] = useState<ManagementData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/home-quality-ehs");
        const raw = res.data;

        let r: any = null;
        if (Array.isArray(raw) && raw.length > 0) {
          r = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          r = raw;
        }

        if (r) {
          const members: ManagementMember[] = (Array.isArray(r.managementMembers) ? r.managementMembers : [])
            .filter((m: ManagementMember) => m.isActive !== false)
            .sort((a: ManagementMember, b: ManagementMember) => (a.order ?? 0) - (b.order ?? 0));

          setData({
            label: r.managementLabel || defaultData.label,
            title:
              Array.isArray(r.managementTitle) && r.managementTitle.length > 0
                ? r.managementTitle
                : defaultData.title,
            description: r.managementDescription || "",
            members: members.length > 0 ? members : defaultData.members,
          });
        }
      } catch (err) {
        console.error("Failed to fetch Management section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <ManagementSkeleton />;

  const { label, title, description, members } = data;

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-[#67003E]" />
          <span className="font-poppins text-[24px] font-normal capitalize leading-none text-[#67003E]">
            {label}
          </span>
        </div>

        {/* Heading: always breaks before the last segment */}
        <h2
          className="mb-10 break-words font-poppins font-bold uppercase leading-[120%] text-black lg:mb-14"
          style={{ fontSize: "clamp(22px, 6.2vw, 60px)" }}
        >
          {title.map((seg, i) => {
            const highlightClass = seg.highlight ? "text-[#FFA7DC]" : undefined;
            const isLast = title.length > 1 && i === title.length - 1;

            if (isLast) {
              // ". RELIABLE RESULTS." -> "." stays on line 1, "RELIABLE RESULTS." goes to line 2
              const match = seg.text.match(/^\s*([.,!?;:]*)\s*([\s\S]*)$/);
              const punctuation = match?.[1] ?? "";
              const rest = match?.[2] ?? seg.text;

              return (
                <span key={i}>
                  {punctuation && <span className={highlightClass}>{punctuation}</span>}
                  <br />
                  <span className={highlightClass}>{rest}</span>
                </span>
              );
            }

            const needsSpace = i > 0 && !/^[.,!?;:]/.test(seg.text);
            return (
              <span key={i}>
                {needsSpace ? " " : ""}
                <span className={highlightClass}>{seg.text}</span>
              </span>
            );
          })}
        </h2>
        {description && (
          <p className="-mt-6 mb-10 max-w-[820px] font-poppins text-[18px] font-medium capitalize leading-[120%] text-[#727272] lg:mb-14">
            {description}
          </p>
        )}

        {/* Cards — 3 in one row from lg up */}
        <div className={CARDS_GRID_CLASSES}>
          {members.map((member, i) => {
            const memberTitle = member.title || MEMBER_DETAILS[i]?.title || "";
            const memberDescription = member.description || MEMBER_DETAILS[i]?.description || "";

            return (
              <article
                key={member._id ?? member.name}
                tabIndex={0}
                className={`group relative aspect-[425/657] w-full max-w-[425px] overflow-hidden rounded-[30px] outline-none focus-visible:ring-2 focus-visible:ring-[#FC0198] ${LAST_CARD_CLASSES}`}
              >
                <MemberImage src={member.image} alt={`${member.name}${memberTitle ? ` - ${memberTitle}` : ""}`} />

                <div
                  className="absolute inset-0 flex flex-col justify-end gap-[10px] px-[30px] pb-[30px] lg:gap-2 lg:px-5 lg:pb-5 xl:gap-[10px] xl:px-[30px] xl:pb-[30px]"
                  style={{
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.82) 100%)",
                  }}
                >
                  {/* Title — on hover */}
                  {memberTitle && (
                    <span className="translate-y-2 font-poppins text-[18px] font-medium uppercase leading-[150%] text-[#FC0198] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none lg:text-sm xl:text-[18px]">
                      {memberTitle}
                    </span>
                  )}

                  {/* Name — always visible */}
                  <h3 className="break-words font-poppins text-[22px] font-semibold uppercase leading-[130%] text-white sm:text-[28px] lg:text-xl xl:text-[28px]">
                    {member.name}
                  </h3>

                  {/* Description — on hover */}
                  {memberDescription && (
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] motion-reduce:transition-none">
                      <p className="overflow-hidden font-poppins text-[16px] font-normal capitalize leading-[150%] text-[#CFCFCF] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none lg:text-[13px] xl:text-[16px]">
                        {memberDescription}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ManagementSection;