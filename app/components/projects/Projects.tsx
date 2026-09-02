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

interface ProjectItem {
  _id?: string;
  title: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  viewProjectLink: string;
  viewProjectText: string;
  tags: string[];
  order: number;
  inlineLinks?: InlineLink[];
}

interface ProjectExperienceData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  description: string;
  descriptionInlineLinks: InlineLink[];
  projects: ProjectItem[];
  isActive: boolean;
}

// Import fallback images
import PROJECT_1_IMG from "../../../public/images/homeservice1.jpg";
import PROJECT_2_IMG from "../../../public/images/homeservice2.jpg";
import PROJECT_3_IMG from "../../../public/images/homeservice3.jpg";

const FALLBACK_IMAGES = [PROJECT_1_IMG, PROJECT_2_IMG, PROJECT_3_IMG];

const defaultData: ProjectExperienceData = {
  sectionTitle: "Project Experience",
  heroTitle: "TRUSTED ACROSS MAJOR UAE PROJECTS",
  heroSubtitle: "PROJECTS",
  heroImage: "",
  heroImageAlt: "Project Experience - UAE Projects",
  heroInlineLinks: [],
  description: "Six Core Disciplines Covering The Full Lifecycle Of Construction Materials From Raw Aggregate To Finished Structure.",
  descriptionInlineLinks: [],
  projects: [
    {
      title: "Sharjah Airport Authority",
      location: "Sharjah, UAE",
      description: "Material Testing Support for Sharjah Airport Authority - Soil Investigation and Laboratory Testing Services.",
      image: "",
      imageAlt: "Sharjah Airport Authority Project",
      viewProjectLink: "/projects/sharjah-airport-authority",
      viewProjectText: "View Project",
      tags: ["Recognized", "Laboratory Engagement", "Material Testing"],
      order: 0,
      inlineLinks: [],
    },
    {
      title: "RTA-Hatta Dam",
      location: "Hatta, Dubai, UAE",
      description: "Material Testing Support for RTA-Hatta Dam - Soil Investigation and Laboratory Testing Services.",
      image: "",
      imageAlt: "RTA-Hatta Dam Project",
      viewProjectLink: "/projects/rta-hatta-dam",
      viewProjectText: "View Project",
      tags: ["Recognized", "Construction Support", "Soil Testing"],
      order: 1,
      inlineLinks: [],
    },
    {
      title: "DAMAC Lagoons",
      location: "Dubai, UAE",
      description: "CP415 Fit-Out & Associate Work - Material Testing and Quality Assurance Services.",
      image: "",
      imageAlt: "DAMAC Lagoons Project",
      viewProjectLink: "/projects/damac-lagoons",
      viewProjectText: "View Project",
      tags: ["Recognized", "Fit-Out", "Quality Assurance"],
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

function ProjectOverlayCardsSkeleton() {
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

function ProjectOverlayCards() {
  const [data, setData] = useState<ProjectExperienceData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const res = await api.get("/project-experience");
        const raw = res.data;

        let responseData: any = null;

        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          const sortedProjects = (responseData.projects || [])
            .slice()
            .sort((a: ProjectItem, b: ProjectItem) => (a.order ?? 0) - (b.order ?? 0));

          const projectData: ProjectExperienceData = {
            _id: responseData._id,
            sectionTitle: responseData.sectionTitle || defaultData.sectionTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroSubtitle: responseData.heroSubtitle || defaultData.heroSubtitle,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            description: responseData.description || defaultData.description,
            descriptionInlineLinks: responseData.descriptionInlineLinks || [],
            projects: sortedProjects.length > 0 ? sortedProjects : defaultData.projects,
            isActive: responseData.isActive ?? true,
          };

          setData(projectData);
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Project Experience section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  if (isLoading) {
    return <ProjectOverlayCardsSkeleton />;
  }

  const { projects, sectionTitle, heroTitle, heroSubtitle, description } = data;

  const projectsWithImages = projects.map((project, index) => {
    let imageSrc;
    const resolved = resolveImage(project.image);
    if (resolved) {
      imageSrc = resolved;
    } else {
      imageSrc = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    }

    const href = project.viewProjectLink || `/projects/${project.title.toLowerCase().replace(/ /g, "-")}`;

    return { ...project, imageSrc, href };
  });

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        

        {/* Cards — 470 x 520 spec, flat #00000059 overlay */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectsWithImages.map((project) => (
            <Link
              key={project._id || project.title}
              href={project.href}
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
                src={project.imageSrc}
                alt={project.imageAlt || project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 470px"
                unoptimized={typeof project.imageSrc === "string" && project.imageSrc.startsWith("http")}
              />

              {/* Flat overlay per spec: background: #00000059 */}
              <div className="absolute inset-0 bg-[#00000059] transition-colors duration-300 group-hover:bg-[#00000080]" />

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col transition-transform duration-300 group-hover:-translate-y-2"
                style={{
                  paddingTop: "clamp(24px, 13cqw, 62px)",
                  paddingRight: "clamp(16px, 7.2cqw, 34px)",
                  paddingBottom: "clamp(24px, 13cqw, 61px)",
                  paddingLeft: "clamp(16px, 7.2cqw, 34px)",
                }}
              >
                {/* Location badge */}
                <span
                  className="font-poppins font-normal capitalize"
                  style={{
                    fontSize: "clamp(13px, 3.8cqw, 18px)",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#FFA7DC",
                  }}
                >
                  {project.location}
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
                    {project.title}
                  </h3>

                  <p
                    className="line-clamp-3 font-poppins font-normal capitalize"
                    style={{
                      fontSize: "clamp(12px, 3.4cqw, 16px)",
                      lineHeight: "120%",
                      letterSpacing: "0px",
                      color: "#D9D9D9",
                    }}
                  >
                    {project.description}
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
                    {project.viewProjectText || "View Project"}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

       
      </div>
    </section>
  );
}

export default ProjectOverlayCards;