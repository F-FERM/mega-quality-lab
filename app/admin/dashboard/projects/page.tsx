"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ExternalLink,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  Link as LinkIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { fileUpload } from "@/app/api/admin/upload/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// ================= CONFIG =================

const ENDPOINT = "/project-experience";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

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
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ProjectExperiencePayload {
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

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_PROJECT: ProjectItem = {
  title: "",
  location: "",
  description: "",
  image: "",
  imageAlt: "",
  viewProjectLink: "",
  viewProjectText: "View Project",
  tags: [],
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: ProjectExperiencePayload = {
  sectionTitle: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  heroImageAlt: "",
  heroInlineLinks: [],
  description: "",
  descriptionInlineLinks: [],
  projects: [],
  isActive: true,
};

// ================= HELPERS =================

function resolveImage(path: string): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function getLinkTypeIcon(type: string) {
  const found = LINK_TYPES.find((t) => t.value === type);
  const IconComponent = found ? found.icon : LinkIcon;
  return <IconComponent className="h-3 w-3" />;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data
  ) {
    return String(err.response.data.message);
  }
  return fallback;
}

function isProjectExperienceData(val: unknown): val is ProjectExperienceData {
  return !!val && typeof val === "object" && "sectionTitle" in (val as object);
}

function parseProjectExperienceList(data: unknown): ProjectExperienceData[] {
  if (Array.isArray(data)) return data as ProjectExperienceData[];
  if (isProjectExperienceData(data)) return [data];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidateKeys = [
      "projects",
      "data",
      "result",
      "results",
      "item",
      "projectExperience",
      "payload",
    ];

    for (const key of candidateKeys) {
      if (!(key in obj)) continue;
      const val = obj[key];
      if (Array.isArray(val)) return val as ProjectExperienceData[];
      if (isProjectExperienceData(val)) return [val];
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[ProjectExperienceAdminPage] Unrecognized API response shape for GET /project-experience:",
      data,
    );
  }

  return [];
}

function mapEntryToForm(entry: ProjectExperienceData): ProjectExperiencePayload {
  return {
    sectionTitle: entry.sectionTitle || "",
    heroTitle: entry.heroTitle || "",
    heroSubtitle: entry.heroSubtitle || "",
    heroImage: entry.heroImage ? entry.heroImage.trim() : "",
    heroImageAlt: entry.heroImageAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    description: entry.description || "",
    descriptionInlineLinks: entry.descriptionInlineLinks || [],
    projects: [...(entry.projects || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((project) => ({
        ...project,
        image: project.image ? project.image.trim() : "",
        tags: project.tags || [],
        inlineLinks: project.inlineLinks || [],
      })),
    isActive: entry.isActive ?? true,
  };
}

function serializeProject(project: ProjectItem): Omit<ProjectItem, "_id"> {
  const { _id, ...rest } = project;
  return {
    ...rest,
    tags: rest.tags || [],
    inlineLinks: rest.inlineLinks || [],
  };
}

// ================= REUSABLE FORM FIELD =================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  textarea = false,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className={className}>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      {textarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
        />
      )}
    </div>
  );
}

// ================= INLINE LINK MANAGER =================

function InlineLinkManager({
  links,
  onChange,
  label = "Inline Links",
  description = "Text within this content that will become clickable.",
}: {
  links: InlineLink[];
  onChange: (links: InlineLink[]) => void;
  label?: string;
  description?: string;
}) {
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkType, setLinkType] = useState<string>(LINK_TYPES[0].value);
  const [linkNewTab, setLinkNewTab] = useState(false);

  const resetForm = () => {
    setLinkText("");
    setLinkUrl("");
    setLinkType(LINK_TYPES[0].value);
    setLinkNewTab(false);
  };

  const addLink = () => {
    const text = linkText.trim();
    const url = linkUrl.trim();

    if (!text || !url) {
      toast.error("Text and URL are required");
      return;
    }

    const isDuplicate = links.some(
      (link) => link.text.toLowerCase() === text.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`"${text}" already has a link`);
      return;
    }

    onChange([
      ...links,
      { text, url, type: linkType, openInNewTab: linkNewTab, position: links.length },
    ]);
    resetForm();
    toast.success("Inline link added");
  };

  const removeLink = (index: number) => {
    const updated = links
      .filter((_, i) => i !== index)
      .map((link, idx) => ({ ...link, position: idx }));
    onChange(updated);
    toast.success("Inline link removed");
  };

  return (
    <div className="mt-3 border-t border-[#D4B8A8] pt-3">
      <Label className="mb-2 block text-xs font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <p className="mb-2 text-[10px] text-[#888888]">{description}</p>

      {links.length > 0 && (
        <div className="mb-2 max-h-[120px] space-y-1 overflow-y-auto">
          {links.map((link, idx) => (
            <div
              key={`${link.text}-${idx}`}
              className="flex items-center justify-between rounded-[8px] border border-[#E4E4E4] bg-white px-3 py-2 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[#67003E]">"{link.text}"</span>
                <span className="text-[#999]">→</span>
                <span className="max-w-[120px] truncate text-[#666]">
                  {link.url}
                </span>
                {link.openInNewTab && (
                  <span className="flex items-center gap-0.5 text-[9px] text-[#999]">
                    <ExternalLink className="h-2.5 w-2.5" /> new tab
                  </span>
                )}
                <span className="text-[9px] text-[#999]">#{link.position}</span>
                {getLinkTypeIcon(link.type)}
              </div>
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="text-[#DC2626] hover:text-[#b91c1c]"
                aria-label={`Remove link "${link.text}"`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-4">
        <Input
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
          placeholder="Text to link"
          className="h-9 rounded-[8px] text-xs"
        />
        <Input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="URL"
          className="h-9 rounded-[8px] text-xs"
        />
        <select
          value={linkType}
          onChange={(e) => setLinkType(e.target.value)}
          className="h-9 w-full rounded-[8px] border border-[#E4E4E4] bg-white px-2 text-xs"
        >
          {LINK_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          onClick={addLink}
          className="h-9 rounded-[8px] bg-[#67003E] px-3 text-xs text-white hover:bg-[#4F0030]"
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <Switch
          checked={linkNewTab}
          onCheckedChange={setLinkNewTab}
          className="h-4 w-7"
        />
        <span className="text-[10px] text-[#666666]">Open in new tab</span>
      </div>
    </div>
  );
}

// ================= MAIN PAGE =================

export default function ProjectExperienceAdminPage() {
  const [entry, setEntry] = useState<ProjectExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectExperiencePayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);

  const [deleteProjectIndex, setDeleteProjectIndex] = useState<number | null>(null);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectDraft, setProjectDraft] = useState<ProjectItem>(EMPTY_PROJECT);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const projectFormRef = useRef<HTMLDivElement>(null);

  // ---------- LOAD ----------

  const fetchProjectExperience = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT);
      const entries = parseProjectExperienceList(res.data);
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Project Experience section"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectExperience();
  }, []);

  // Scroll to project form when opened
  useEffect(() => {
    if (showProjectForm) {
      const raf = requestAnimationFrame(() => {
        projectFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [showProjectForm, editingProjectIndex]);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!entry) {
      toast.error("No Project Experience section loaded yet. Try refreshing the page.");
      return;
    }
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingHeroImage || uploadingProjectImage) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowProjectForm(false);
    setEditingProjectIndex(null);
    setProjectDraft(EMPTY_PROJECT);
    setDeleteProjectIndex(null);
    setTagInput("");
  };

  // ---------- HERO IMAGE UPLOAD ----------

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHeroImage(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, heroImage: result.url }));
      toast.success("Hero image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload hero image"));
    } finally {
      setUploadingHeroImage(false);
      if (heroImageInputRef.current) heroImageInputRef.current.value = "";
    }
  };

  // ---------- PROJECT IMAGE UPLOAD ----------

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingProjectImage(true);
      const result = await fileUpload(file);
      setProjectDraft((prev) => ({ ...prev, image: result.url }));
      toast.success("Project image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload project image"));
    } finally {
      setUploadingProjectImage(false);
      if (projectImageInputRef.current) projectImageInputRef.current.value = "";
    }
  };

  // ---------- TAGS ----------

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (projectDraft.tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }
    setProjectDraft((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setProjectDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // ---------- PROJECTS ----------

  const openAddProject = () => {
    setProjectDraft({
      ...EMPTY_PROJECT,
      order: form.projects.length,
      tags: [],
      inlineLinks: [],
    });
    setEditingProjectIndex(null);
    setShowProjectForm(true);
    setTagInput("");
  };

  const openEditProject = (index: number) => {
    const project = form.projects[index];
    setProjectDraft({
      ...project,
      image: project.image || "",
      tags: project.tags || [],
      inlineLinks: project.inlineLinks || [],
    });
    setEditingProjectIndex(index);
    setShowProjectForm(true);
    setTagInput("");
  };

  const cancelProjectForm = () => {
    setShowProjectForm(false);
    setEditingProjectIndex(null);
    setProjectDraft(EMPTY_PROJECT);
    setTagInput("");
  };

  const saveProjectDraft = () => {
    if (!projectDraft.title.trim() || !projectDraft.description.trim()) {
      toast.error("Project title and description are required");
      return;
    }

    setForm((prev) => {
      const projects = [...prev.projects];
      if (editingProjectIndex !== null) {
        projects[editingProjectIndex] = projectDraft;
      } else {
        projects.push(projectDraft);
      }
      return {
        ...prev,
        projects: projects.map((project, index) => ({ ...project, order: index })),
      };
    });
    cancelProjectForm();
    toast.success(
      editingProjectIndex !== null
        ? "Project updated in draft — click 'Update Section' to save"
        : "Project added to draft — click 'Update Section' to save",
    );
  };

  const requestRemoveProject = (index: number) => {
    setDeleteProjectIndex(index);
  };

  const confirmRemoveProject = () => {
    if (deleteProjectIndex === null) return;
    setForm((prev) => ({
      ...prev,
      projects: prev.projects
        .filter((_, i) => i !== deleteProjectIndex)
        .map((project, i) => ({ ...project, order: i })),
    }));
    setDeleteProjectIndex(null);
    toast.success("Project removed from draft — click 'Update Section' to save");
  };

  const updateProjectInlineLinks = (links: InlineLink[]) => {
    setProjectDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE SECTION ----------

  const handleSubmit = async () => {
    if (!form.sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }
    if (!form.heroTitle.trim()) {
      toast.error("Hero title is required");
      return;
    }
    if (!form.heroImage.trim()) {
      toast.error("Hero image is required");
      return;
    }

    const payload = {
      sectionTitle: form.sectionTitle,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      heroImage: form.heroImage,
      heroImageAlt: form.heroImageAlt,
      heroInlineLinks: form.heroInlineLinks,
      description: form.description,
      descriptionInlineLinks: form.descriptionInlineLinks,
      isActive: form.isActive,
      projects: form.projects.map(serializeProject),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Project Experience section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Project Experience section created");
      }

      closeModal();
      fetchProjectExperience();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Project Experience section"
            : "Failed to create Project Experience section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async () => {
    if (!entry) return;
    try {
      setTogglingId(entry._id || null);
      await api.patch(`${ENDPOINT}`, {
        isActive: !entry.isActive,
      });
      setEntry((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
      toast.success(entry.isActive ? "Section deactivated" : "Section activated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- DELETE SECTION ----------

  const handleDeleteSection = async () => {
    if (!entry?._id) return;
    try {
      setDeletingSection(true);
      await api.delete(`${ENDPOINT}/${entry._id}`);
      toast.success("Project Experience section deleted");
      setConfirmDeleteSection(false);
      setEntry(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Project Experience section"));
    } finally {
      setDeletingSection(false);
    }
  };

  // ---------- RENDER ----------

  return (
    <section className="min-h-screen bg-[#F8F0F5] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111111",
            color: "#fff",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#67003E", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Project Experience
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the Project Experience section content including project images and tags.
          </p>
        </div>

        {!entry && !loading && (
          <Button
            onClick={openCreateModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Project Experience Section
          </Button>
        )}
      </div>

      {/* LIST - Single Card */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#67003E] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : !entry ? (
          <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No Project Experience content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage project experience content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]">
            <div className="relative h-[140px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[160px]">
              {entry.heroImage ? (
                <Image
                  src={resolveImage(entry.heroImage)}
                  alt={entry.heroImageAlt || entry.heroTitle}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-[26px] w-[26px] text-[#67003E]/40" />
                </div>
              )}

              <button
                onClick={toggleActive}
                disabled={togglingId === entry._id}
                className={`absolute right-[12px] top-[12px] rounded-full px-[10px] py-[5px] text-[11px] font-medium backdrop-blur-sm transition-colors ${
                  entry.isActive
                    ? "bg-[#67003E]/90 text-white"
                    : "bg-black/40 text-white/80"
                }`}
              >
                {togglingId === entry._id
                  ? "..."
                  : entry.isActive
                    ? "Active"
                    : "Inactive"}
              </button>
            </div>

            <CardContent className="p-[16px] sm:p-[20px]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#111111]">
                    {entry.sectionTitle || "Project Experience"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                    {entry.heroTitle} {entry.heroSubtitle}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.projects?.length || 0} Projects</span>
                  </div>
                </div>
              </div>

              <div className="mt-[14px] flex gap-2">
                <Button
                  onClick={openEditModal}
                  variant="outline"
                  className="h-[36px] flex-1 gap-[6px] rounded-[10px] border-[#D4B8A8] text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5]"
                >
                  <Pencil className="h-[13px] w-[13px]" />
                  Edit Section
                </Button>
                <Button
                  onClick={() => setConfirmDeleteSection(true)}
                  variant="outline"
                  className="h-[36px] gap-[6px] rounded-[10px] border-[#F3D0D0] px-[14px] text-[13px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                >
                  <Trash2 className="h-[13px] w-[13px]" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[4px] sm:items-center sm:p-[20px]"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[720px] sm:rounded-[28px] sm:p-[32px] md:max-w-[800px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {editingId ? "Edit Project Experience Section" : "Create Project Experience Section"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                  aria-label="Close"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                {/* SECTION TITLE */}
                <FormField
                  label="Section Title"
                  value={form.sectionTitle}
                  onChange={(value) => setForm({ ...form, sectionTitle: value })}
                  placeholder="Project Experience"
                />

                {/* HERO SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Hero Section
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Hero Title"
                      value={form.heroTitle}
                      onChange={(value) => setForm({ ...form, heroTitle: value })}
                      placeholder="TRUSTED ACROSS MAJOR UAE PROJECTS"
                    />
                    <FormField
                      label="Hero Subtitle"
                      value={form.heroSubtitle}
                      onChange={(value) => setForm({ ...form, heroSubtitle: value })}
                      placeholder="PROJECTS"
                    />
                  </div>

                  <InlineLinkManager
                    links={form.heroInlineLinks}
                    onChange={(links) => setForm({ ...form, heroInlineLinks: links })}
                    label="Hero Inline Links"
                    description="Text within the hero title that will become clickable."
                  />

                  {/* Hero Image */}
                  <div className="mt-3 rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                    {form.heroImage && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(form.heroImage)}
                          alt="Hero preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <FormField
                      label="Image Alt Text"
                      value={form.heroImageAlt}
                      onChange={(value) => setForm({ ...form, heroImageAlt: value })}
                      placeholder="Hero image alt text"
                      className="mb-2"
                    />
                    <input
                      ref={heroImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => heroImageInputRef.current?.click()}
                      disabled={uploadingHeroImage}
                      className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingHeroImage ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {form.heroImage ? "Replace Hero Image" : "Upload Hero Image"}
                    </Button>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Description
                  </h3>

                  <FormField
                    label="Description"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    placeholder="Description text..."
                    textarea
                    rows={2}
                  />

                  <InlineLinkManager
                    links={form.descriptionInlineLinks}
                    onChange={(links) => setForm({ ...form, descriptionInlineLinks: links })}
                    label="Description Inline Links"
                    description="Text within the description that will become clickable."
                  />
                </div>

                {/* PROJECTS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Projects ({form.projects.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddProject}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Project
                    </Button>
                  </div>

                  {showProjectForm && (
                    <div
                      ref={projectFormRef}
                      className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]"
                    >
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingProjectIndex !== null ? "Edit Project" : "New Project"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={projectDraft.title}
                          onChange={(e) => setProjectDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Project Title"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={projectDraft.location}
                          onChange={(e) => setProjectDraft((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="Location (e.g., Dubai, UAE)"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={projectDraft.description}
                        onChange={(e) => setProjectDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Project description"
                        rows={3}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      {/* Project Image Upload */}
                      <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                        {projectDraft.image && (
                          <div className="relative mb-[10px] h-[100px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                            <Image
                              src={resolveImage(projectDraft.image)}
                              alt="Project preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <input
                          ref={projectImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProjectImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => projectImageInputRef.current?.click()}
                          disabled={uploadingProjectImage}
                          className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                        >
                          {uploadingProjectImage ? (
                            <Loader2 className="h-[14px] w-[14px] animate-spin" />
                          ) : (
                            <UploadCloud className="h-[14px] w-[14px]" />
                          )}
                          {projectDraft.image ? "Replace Image" : "Upload Image"}
                        </Button>
                        <p className="mt-1 text-[9px] text-[#888888]">
                          Upload a project image (JPG, PNG).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={projectDraft.imageAlt}
                          onChange={(e) => setProjectDraft((prev) => ({ ...prev, imageAlt: e.target.value }))}
                          placeholder="Image alt text"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={projectDraft.viewProjectText}
                          onChange={(e) => setProjectDraft((prev) => ({ ...prev, viewProjectText: e.target.value }))}
                          placeholder="View Project"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Input
                        value={projectDraft.viewProjectLink}
                        onChange={(e) => setProjectDraft((prev) => ({ ...prev, viewProjectLink: e.target.value }))}
                        placeholder="/projects/project-slug"
                        className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      {/* Tags */}
                      <div className="rounded-[10px] border border-[#E4E4E4] bg-white p-[10px]">
                        <Label className="mb-[4px] block text-[12px] font-medium text-[#2A2A2A]">
                          Tags
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {projectDraft.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1 rounded-full bg-[#67003E]/10 px-3 py-1 text-xs font-medium text-[#67003E]"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(idx)}
                                className="text-[#67003E] hover:text-[#4F0030]"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add tag..."
                            className="h-[36px] flex-1 rounded-[8px] border-[#E4E4E4] bg-white text-[13px]"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            className="h-[36px] rounded-[8px] bg-[#67003E] px-3 text-xs text-white hover:bg-[#4F0030]"
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <InlineLinkManager
                        links={projectDraft.inlineLinks || []}
                        onChange={updateProjectInlineLinks}
                        label="Project Inline Links"
                        description="Text within this project that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveProjectDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingProjectIndex !== null ? "Save Project" : "Add Project"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelProjectForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.projects.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No projects yet. Add your first project above.
                      </p>
                    )}

                    {form.projects.map((project, index) => (
                      <div
                        key={project._id || `${project.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            {project.image && (
                              <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                                <Image
                                  src={resolveImage(project.image)}
                                  alt={project.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-[14px] font-semibold text-[#111111]">
                                {project.title}
                              </p>
                              <p className="text-[12px] text-[#666666]">
                                {project.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-[12px] text-[#666666] line-clamp-1 mt-1">
                            {project.description}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {project.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-[#67003E]/10 px-2 py-0.5 text-[9px] font-medium text-[#67003E]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {(project.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {project.inlineLinks!.length} link{project.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditProject(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => requestRemoveProject(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTIVE SWITCH */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this section on the website
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-[10px] pt-[4px] xs:flex-row xs:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting}
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white px-[18px] text-[14px] text-[#666666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || uploadingHeroImage || uploadingProjectImage}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Section"
                    ) : (
                      "Create Section"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM: REMOVE A PROJECT FROM THE DRAFT */}
      <AnimatePresence>
        {deleteProjectIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => setDeleteProjectIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Remove Project?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{form.projects[deleteProjectIndex]?.title}&quot; from
                the draft. You still need to click <strong>Update Section</strong> to save
                the change.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteProjectIndex(null)}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmRemoveProject}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  Remove Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM: DELETE THE WHOLE SECTION */}
      <AnimatePresence>
        {confirmDeleteSection && entry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => !deletingSection && setConfirmDeleteSection(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Delete Project Experience Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This permanently deletes &quot;{entry.sectionTitle}&quot; and all{" "}
                {entry.projects?.length || 0} projects in it. This cannot be undone.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmDeleteSection(false)}
                  disabled={deletingSection}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteSection}
                  disabled={deletingSection}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  {deletingSection ? "Deleting..." : "Delete Section"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}