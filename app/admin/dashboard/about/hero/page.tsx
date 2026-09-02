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
  ImagePlus,
  Layers,
  Link as LinkIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Type,
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

const ENDPOINT = "/home-about";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

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
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AboutPayload {
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

type ListResponse = AboutData[] | { about: AboutData[] } | AboutData;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_STAT: StatItem = {
  value: "",
  label: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: AboutPayload = {
  sectionTitle: "",
  heroTitle: "",
  heroTitleTwo: "",
  heroTitleThree: "",
  imageOne: "",
  imageOneAlt: "",
  imageTwo: "",
  imageTwoAlt: "",
  heroInlineLinks: [],
  description: "",
  descriptionInlineLinks: [],
  featureOne: "",
  featureTwo: "",
  featureThree: "",
  featureInlineLinks: [],
  stats: [],
  isActive: true,
};

// ================= HELPERS =================

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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

function parseAboutList(data: unknown): AboutData[] {
  if (Array.isArray(data)) return data as AboutData[];
  if (
    data &&
    typeof data === "object" &&
    "about" in data &&
    Array.isArray((data as { about: AboutData[] }).about)
  ) {
    return (data as { about: AboutData[] }).about;
  }
  if (data && typeof data === "object" && "sectionTitle" in data) {
    return [data as AboutData];
  }
  return [];
}

function mapEntryToForm(entry: AboutData): AboutPayload {
  return {
    sectionTitle: entry.sectionTitle || "",
    heroTitle: entry.heroTitle || "",
    heroTitleTwo: entry.heroTitleTwo || "",
    heroTitleThree: entry.heroTitleThree || "",
    imageOne: entry.imageOne || "",
    imageOneAlt: entry.imageOneAlt || "",
    imageTwo: entry.imageTwo || "",
    imageTwoAlt: entry.imageTwoAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    description: entry.description || "",
    descriptionInlineLinks: entry.descriptionInlineLinks || [],
    featureOne: entry.featureOne || "",
    featureTwo: entry.featureTwo || "",
    featureThree: entry.featureThree || "",
    featureInlineLinks: entry.featureInlineLinks || [],
    stats: [...(entry.stats || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((stat) => ({ ...stat, inlineLinks: stat.inlineLinks || [] })),
    isActive: entry.isActive ?? true,
  };
}

function serializeStat(stat: StatItem): Omit<StatItem, "_id"> {
  const { _id: _unused, ...rest } = stat;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
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

export default function AboutAdminPage() {
  const [entries, setEntries] = useState<AboutData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AboutPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingImageOne, setUploadingImageOne] = useState(false);
  const [uploadingImageTwo, setUploadingImageTwo] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AboutData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showStatForm, setShowStatForm] = useState(false);
  const [statDraft, setStatDraft] = useState<StatItem>(EMPTY_STAT);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);

  const imageOneInputRef = useRef<HTMLInputElement>(null);
  const imageTwoInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseAboutList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load About sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: AboutData) => {
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingImageOne || uploadingImageTwo) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowStatForm(false);
    setEditingStatIndex(null);
    setStatDraft(EMPTY_STAT);
  };

  // ---------- IMAGE UPLOADS ----------

  const handleImageOneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImageOne(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, imageOne: result.url }));
      toast.success("Image 1 uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploadingImageOne(false);
      if (imageOneInputRef.current) imageOneInputRef.current.value = "";
    }
  };

  const handleImageTwoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImageTwo(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, imageTwo: result.url }));
      toast.success("Image 2 uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploadingImageTwo(false);
      if (imageTwoInputRef.current) imageTwoInputRef.current.value = "";
    }
  };

  // ---------- STATS ----------

  const openAddStat = () => {
    setStatDraft({
      ...EMPTY_STAT,
      order: form.stats.length,
      inlineLinks: [],
    });
    setEditingStatIndex(null);
    setShowStatForm(true);
  };

  const openEditStat = (index: number) => {
    setStatDraft({
      ...form.stats[index],
      inlineLinks: form.stats[index].inlineLinks || [],
    });
    setEditingStatIndex(index);
    setShowStatForm(true);
  };

  const cancelStatForm = () => {
    setShowStatForm(false);
    setEditingStatIndex(null);
    setStatDraft(EMPTY_STAT);
  };

  const saveStatDraft = () => {
    if (!statDraft.value.trim() || !statDraft.label.trim()) {
      toast.error("Stat value and label are required");
      return;
    }

    setForm((prev) => {
      const stats = [...prev.stats];
      if (editingStatIndex !== null) {
        stats[editingStatIndex] = statDraft;
      } else {
        stats.push(statDraft);
      }
      return {
        ...prev,
        stats: stats.map((stat, index) => ({ ...stat, order: index })),
      };
    });
    cancelStatForm();
  };

  const removeStat = (index: number) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats
        .filter((_, i) => i !== index)
        .map((stat, i) => ({ ...stat, order: i })),
    }));
  };

  const updateStatInlineLinks = (links: InlineLink[]) => {
    setStatDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }
    if (!form.heroTitle.trim()) {
      toast.error("Hero title is required");
      return;
    }
    if (!form.imageOne.trim()) {
      toast.error("Image One is required");
      return;
    }

    const payload: AboutPayload = {
      ...form,
      stats: form.stats.map(serializeStat),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("About section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("About section created");
      }

      closeModal();
      fetchAbout();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update About section"
            : "Failed to create About section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: AboutData) => {
    try {
      setTogglingId(entry._id || null);
      await api.patch(`${ENDPOINT}`, {
        isActive: !entry.isActive,
      });
      setEntries((prev) =>
        prev.map((item) =>
          item._id === entry._id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
      toast.success(entry.isActive ? "Section deactivated" : "Section activated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- DELETE ----------

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id || null);
      await api.delete(`${ENDPOINT}/${deleteTarget._id}`);
      setEntries((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("About section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete About section"));
    } finally {
      setDeletingId(null);
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
            About Laboratory
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the About Laboratory section content.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add About Section
        </Button>
      </div>

      {/* LIST */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#67003E] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : entries.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No About content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage About Laboratory content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {entries.map((entry) => (
              <Card
                key={entry._id}
                className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]"
              >
                <div className="relative h-[140px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[160px]">
                  {entry.imageOne ? (
                    <Image
                      src={resolveImage(entry.imageOne)}
                      alt={entry.imageOneAlt || entry.heroTitle}
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
                    onClick={() => toggleActive(entry)}
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
                  <h3 className="text-[18px] font-semibold text-[#111111]">
                    {entry.sectionTitle || "About Laboratory"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                    {entry.heroTitle} {entry.heroTitleTwo} {entry.heroTitleThree}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.stats?.length || 0} Stats</span>
                  </div>

                  <div className="mt-[14px] flex gap-2">
                    <Button
                      onClick={() => openEditModal(entry)}
                      variant="outline"
                      className="h-[36px] flex-1 gap-[6px] rounded-[10px] border-[#D4B8A8] text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5]"
                    >
                      <Pencil className="h-[13px] w-[13px]" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(entry)}
                      variant="outline"
                      className="h-[36px] w-[36px] rounded-[10px] border-[#F3D0D0] p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  {editingId ? "Edit About Section" : "Create About Section"}
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
                  placeholder="About The Laboratory"
                />

                {/* HERO TITLES */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Hero Titles
                  </Label>
                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3">
                    <Input
                      value={form.heroTitle}
                      onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                      placeholder="TESTING THAT"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={form.heroTitleTwo}
                      onChange={(e) => setForm({ ...form, heroTitleTwo: e.target.value })}
                      placeholder="SUPPORTS BETTER"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={form.heroTitleThree}
                      onChange={(e) => setForm({ ...form, heroTitleThree: e.target.value })}
                      placeholder="CONSTRUCTION"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                <InlineLinkManager
                  links={form.heroInlineLinks}
                  onChange={(links) => setForm({ ...form, heroInlineLinks: links })}
                  label="Hero Inline Links"
                  description="Text within the hero title that will become clickable."
                />

                {/* IMAGES */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Images
                  </h3>

                  {/* Image One */}
                  <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px] mb-3">
                    <Label className="mb-[4px] block text-[12px] font-medium text-[#2A2A2A]">
                      Image One (Main)
                    </Label>
                    {form.imageOne && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(form.imageOne)}
                          alt="Image One preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <FormField
                      label="Image One Alt Text"
                      value={form.imageOneAlt}
                      onChange={(value) => setForm({ ...form, imageOneAlt: value })}
                      placeholder="Mega Quality Laboratory - Testing Equipment"
                      className="mb-2"
                    />
                    <input
                      ref={imageOneInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageOneUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageOneInputRef.current?.click()}
                      disabled={uploadingImageOne}
                      className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingImageOne ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {form.imageOne ? "Replace Image One" : "Upload Image One"}
                    </Button>
                  </div>

                  {/* Image Two */}
                  <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                    <Label className="mb-[4px] block text-[12px] font-medium text-[#2A2A2A]">
                      Image Two (Overlay)
                    </Label>
                    {form.imageTwo && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(form.imageTwo)}
                          alt="Image Two preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <FormField
                      label="Image Two Alt Text"
                      value={form.imageTwoAlt}
                      onChange={(value) => setForm({ ...form, imageTwoAlt: value })}
                      placeholder="Mega Quality Laboratory - Soil Testing"
                      className="mb-2"
                    />
                    <input
                      ref={imageTwoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageTwoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageTwoInputRef.current?.click()}
                      disabled={uploadingImageTwo}
                      className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingImageTwo ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {form.imageTwo ? "Replace Image Two" : "Upload Image Two"}
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
                    rows={3}
                  />

                  <InlineLinkManager
                    links={form.descriptionInlineLinks}
                    onChange={(links) => setForm({ ...form, descriptionInlineLinks: links })}
                    label="Description Inline Links"
                    description="Text within the description that will become clickable."
                  />
                </div>

                {/* FEATURES */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Features
                  </h3>

                  <FormField
                    label="Feature One"
                    value={form.featureOne}
                    onChange={(value) => setForm({ ...form, featureOne: value })}
                    placeholder="Feature one text..."
                    textarea
                    rows={2}
                    className="mb-3"
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Feature Two"
                      value={form.featureTwo}
                      onChange={(value) => setForm({ ...form, featureTwo: value })}
                      placeholder="Feature two text..."
                    />
                    <FormField
                      label="Feature Three"
                      value={form.featureThree}
                      onChange={(value) => setForm({ ...form, featureThree: value })}
                      placeholder="Feature three text..."
                    />
                  </div>

                  <InlineLinkManager
                    links={form.featureInlineLinks}
                    onChange={(links) => setForm({ ...form, featureInlineLinks: links })}
                    label="Feature Inline Links"
                    description="Text within the features that will become clickable."
                  />
                </div>

                {/* STATS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Stats ({form.stats.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddStat}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Stat
                    </Button>
                  </div>

                  {showStatForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingStatIndex !== null ? "Edit Stat" : "New Stat"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={statDraft.value}
                          onChange={(e) => setStatDraft((prev) => ({ ...prev, value: e.target.value }))}
                          placeholder="2020"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={statDraft.label}
                          onChange={(e) => setStatDraft((prev) => ({ ...prev, label: e.target.value }))}
                          placeholder="Established"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <InlineLinkManager
                        links={statDraft.inlineLinks || []}
                        onChange={updateStatInlineLinks}
                        label="Stat Inline Links"
                        description="Text within this stat that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveStatDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingStatIndex !== null ? "Save Stat" : "Add Stat"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelStatForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.stats.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No stats yet. Add your first stat above.
                      </p>
                    )}

                    {form.stats.map((stat, index) => (
                      <div
                        key={stat._id || `${stat.label}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[18px] font-semibold text-[#67003E]">
                            {stat.value}
                          </p>
                          <p className="text-[14px] text-[#111111]">
                            {stat.label}
                          </p>
                          {(stat.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {stat.inlineLinks!.length} link{stat.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditStat(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeStat(index)}
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
                    disabled={submitting || uploadingImageOne || uploadingImageTwo}
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

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => !deletingId && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Delete About Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.sectionTitle || "About"}&quot; and all its content.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  {deletingId ? "Deleting..." : "Delete Section"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}