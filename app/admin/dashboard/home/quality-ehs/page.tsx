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

const ENDPOINT = "/home-quality-ehs";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface Pillar {
  _id?: string;
  pillarNumber: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EHSCategory {
  _id?: string;
  category: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface QualityEHSData {
  _id?: string;
  qualityTitle: string;
  qualityDescription: string;
  qualityInlineLinks: InlineLink[];
  pillars: Pillar[];
  ehsTitle: string;
  ehsDescription: string;
  ehsInlineLinks: InlineLink[];
  ehsCategories: EHSCategory[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface QualityEHSPayload {
  qualityTitle: string;
  qualityDescription: string;
  qualityInlineLinks: InlineLink[];
  pillars: Pillar[];
  ehsTitle: string;
  ehsDescription: string;
  ehsInlineLinks: InlineLink[];
  ehsCategories: EHSCategory[];
  isActive: boolean;
}

type ListResponse = QualityEHSData[] | { qualityEHS: QualityEHSData[] } | QualityEHSData;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_PILLAR: Pillar = {
  pillarNumber: "",
  title: "",
  description: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_EHS_CATEGORY: EHSCategory = {
  category: "",
  title: "",
  description: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: QualityEHSPayload = {
  qualityTitle: "",
  qualityDescription: "",
  qualityInlineLinks: [],
  pillars: [],
  ehsTitle: "",
  ehsDescription: "",
  ehsInlineLinks: [],
  ehsCategories: [],
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

function parseQualityEHSList(data: unknown): QualityEHSData[] {
  if (Array.isArray(data)) return data as QualityEHSData[];
  if (
    data &&
    typeof data === "object" &&
    "qualityEHS" in data &&
    Array.isArray((data as { qualityEHS: QualityEHSData[] }).qualityEHS)
  ) {
    return (data as { qualityEHS: QualityEHSData[] }).qualityEHS;
  }
  if (data && typeof data === "object" && "qualityTitle" in data) {
    return [data as QualityEHSData];
  }
  return [];
}

function mapEntryToForm(entry: QualityEHSData): QualityEHSPayload {
  return {
    qualityTitle: entry.qualityTitle || "",
    qualityDescription: entry.qualityDescription || "",
    qualityInlineLinks: entry.qualityInlineLinks || [],
    pillars: [...(entry.pillars || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((pillar) => ({ ...pillar, inlineLinks: pillar.inlineLinks || [] })),
    ehsTitle: entry.ehsTitle || "",
    ehsDescription: entry.ehsDescription || "",
    ehsInlineLinks: entry.ehsInlineLinks || [],
    ehsCategories: [...(entry.ehsCategories || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((category) => ({ ...category, inlineLinks: category.inlineLinks || [] })),
    isActive: entry.isActive ?? true,
  };
}

function serializePillar(pillar: Pillar): Omit<Pillar, "_id"> {
  const { _id: _unused, ...rest } = pillar;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeEHSCategory(category: EHSCategory): Omit<EHSCategory, "_id"> {
  const { _id: _unused, ...rest } = category;
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

export default function QualityEHSAdminPage() {
  const [entries, setEntries] = useState<QualityEHSData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QualityEHSPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<QualityEHSData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showPillarForm, setShowPillarForm] = useState(false);
  const [pillarDraft, setPillarDraft] = useState<Pillar>(EMPTY_PILLAR);
  const [editingPillarIndex, setEditingPillarIndex] = useState<number | null>(null);

  const [showEHSCategoryForm, setShowEHSCategoryForm] = useState(false);
  const [ehsCategoryDraft, setEhsCategoryDraft] = useState<EHSCategory>(EMPTY_EHS_CATEGORY);
  const [editingEHSCategoryIndex, setEditingEHSCategoryIndex] = useState<number | null>(null);

  // ---------- LOAD ----------

  const fetchQualityEHS = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseQualityEHSList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Quality & EHS sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualityEHS();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: QualityEHSData) => {
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowPillarForm(false);
    setEditingPillarIndex(null);
    setPillarDraft(EMPTY_PILLAR);
    setShowEHSCategoryForm(false);
    setEditingEHSCategoryIndex(null);
    setEhsCategoryDraft(EMPTY_EHS_CATEGORY);
  };

  // ---------- PILLARS ----------

  const openAddPillar = () => {
    setPillarDraft({
      ...EMPTY_PILLAR,
      pillarNumber: `PILLAR ${String(form.pillars.length + 1).padStart(2, "0")}`,
      order: form.pillars.length,
      inlineLinks: [],
    });
    setEditingPillarIndex(null);
    setShowPillarForm(true);
  };

  const openEditPillar = (index: number) => {
    setPillarDraft({
      ...form.pillars[index],
      inlineLinks: form.pillars[index].inlineLinks || [],
    });
    setEditingPillarIndex(index);
    setShowPillarForm(true);
  };

  const cancelPillarForm = () => {
    setShowPillarForm(false);
    setEditingPillarIndex(null);
    setPillarDraft(EMPTY_PILLAR);
  };

  const savePillarDraft = () => {
    if (!pillarDraft.title.trim() || !pillarDraft.description.trim()) {
      toast.error("Pillar title and description are required");
      return;
    }

    setForm((prev) => {
      const pillars = [...prev.pillars];
      if (editingPillarIndex !== null) {
        pillars[editingPillarIndex] = pillarDraft;
      } else {
        pillars.push(pillarDraft);
      }
      return {
        ...prev,
        pillars: pillars.map((pillar, index) => ({ ...pillar, order: index })),
      };
    });
    cancelPillarForm();
  };

  const removePillar = (index: number) => {
    setForm((prev) => ({
      ...prev,
      pillars: prev.pillars
        .filter((_, i) => i !== index)
        .map((pillar, i) => ({ ...pillar, order: i })),
    }));
  };

  const updatePillarInlineLinks = (links: InlineLink[]) => {
    setPillarDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- EHS CATEGORIES ----------

  const openAddEHSCategory = () => {
    setEhsCategoryDraft({
      ...EMPTY_EHS_CATEGORY,
      order: form.ehsCategories.length,
      inlineLinks: [],
    });
    setEditingEHSCategoryIndex(null);
    setShowEHSCategoryForm(true);
  };

  const openEditEHSCategory = (index: number) => {
    setEhsCategoryDraft({
      ...form.ehsCategories[index],
      inlineLinks: form.ehsCategories[index].inlineLinks || [],
    });
    setEditingEHSCategoryIndex(index);
    setShowEHSCategoryForm(true);
  };

  const cancelEHSCategoryForm = () => {
    setShowEHSCategoryForm(false);
    setEditingEHSCategoryIndex(null);
    setEhsCategoryDraft(EMPTY_EHS_CATEGORY);
  };

  const saveEHSCategoryDraft = () => {
    if (!ehsCategoryDraft.category.trim() || !ehsCategoryDraft.title.trim()) {
      toast.error("Category and title are required");
      return;
    }

    setForm((prev) => {
      const categories = [...prev.ehsCategories];
      if (editingEHSCategoryIndex !== null) {
        categories[editingEHSCategoryIndex] = ehsCategoryDraft;
      } else {
        categories.push(ehsCategoryDraft);
      }
      return {
        ...prev,
        ehsCategories: categories.map((category, index) => ({ ...category, order: index })),
      };
    });
    cancelEHSCategoryForm();
  };

  const removeEHSCategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ehsCategories: prev.ehsCategories
        .filter((_, i) => i !== index)
        .map((category, i) => ({ ...category, order: i })),
    }));
  };

  const updateEHSCategoryInlineLinks = (links: InlineLink[]) => {
    setEhsCategoryDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.qualityTitle.trim()) {
      toast.error("Quality title is required");
      return;
    }
    if (!form.qualityDescription.trim()) {
      toast.error("Quality description is required");
      return;
    }

    const payload: QualityEHSPayload = {
      ...form,
      pillars: form.pillars.map(serializePillar),
      ehsCategories: form.ehsCategories.map(serializeEHSCategory),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}/${editingId}`, payload);
        toast.success("Quality & EHS section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Quality & EHS section created");
      }

      closeModal();
      fetchQualityEHS();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Quality & EHS section"
            : "Failed to create Quality & EHS section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: QualityEHSData) => {
    try {
      setTogglingId(entry._id || null);
      await api.patch(`${ENDPOINT}/${entry._id}`, {
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
      toast.success("Quality & EHS section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Quality & EHS section"));
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
            Quality & EHS
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage Quality pillars and EHS categories.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Quality & EHS Section
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
                No Quality & EHS content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage Quality pillars and EHS categories.
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
                <CardContent className="p-[16px] sm:p-[20px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#111111]">
                        {entry.qualityTitle || "Quality & EHS"}
                      </h3>
                      <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                        {entry.qualityDescription}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleActive(entry)}
                      disabled={togglingId === entry._id}
                      className={`rounded-full px-[10px] py-[5px] text-[11px] font-medium transition-colors ${
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

                  <div className="mt-[10px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.pillars?.length || 0} Quality Pillars</span>
                    <span>•</span>
                    <span>{entry.ehsCategories?.length || 0} EHS Categories</span>
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
                  {editingId ? "Edit Quality & EHS Section" : "Create Quality & EHS Section"}
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
                {/* QUALITY SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Quality Section
                  </h3>

                  <FormField
                    label="Quality Title"
                    value={form.qualityTitle}
                    onChange={(value) => setForm({ ...form, qualityTitle: value })}
                    placeholder="QUALITY IS NOT A CLAIM. IT'S A SYSTEM."
                  />

                  <FormField
                    label="Quality Description"
                    value={form.qualityDescription}
                    onChange={(value) => setForm({ ...form, qualityDescription: value })}
                    placeholder="Quality description..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.qualityInlineLinks}
                    onChange={(links) => setForm({ ...form, qualityInlineLinks: links })}
                    label="Quality Inline Links"
                    description="Text within the quality section that will become clickable."
                  />
                </div>

                {/* QUALITY PILLARS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Quality Pillars ({form.pillars.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddPillar}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Pillar
                    </Button>
                  </div>

                  {showPillarForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingPillarIndex !== null ? "Edit Pillar" : "New Pillar"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={pillarDraft.pillarNumber}
                          onChange={(e) => setPillarDraft((prev) => ({ ...prev, pillarNumber: e.target.value }))}
                          placeholder="PILLAR 01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={pillarDraft.title}
                          onChange={(e) => setPillarDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Title"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={pillarDraft.description}
                        onChange={(e) => setPillarDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Pillar description"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <InlineLinkManager
                        links={pillarDraft.inlineLinks || []}
                        onChange={updatePillarInlineLinks}
                        label="Pillar Inline Links"
                        description="Text within this pillar that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={savePillarDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingPillarIndex !== null ? "Save Pillar" : "Add Pillar"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelPillarForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.pillars.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No pillars yet. Add your first pillar above.
                      </p>
                    )}

                    {form.pillars.map((pillar, index) => (
                      <div
                        key={pillar._id || `${pillar.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase text-[#67003E]">
                            {pillar.pillarNumber}
                          </p>
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {pillar.title}
                          </p>
                          <p className="text-[12px] text-[#666666] line-clamp-1">
                            {pillar.description}
                          </p>
                          {(pillar.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {pillar.inlineLinks!.length} link{pillar.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditPillar(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removePillar(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EHS SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    EHS Section
                  </h3>

                  <FormField
                    label="EHS Title"
                    value={form.ehsTitle}
                    onChange={(value) => setForm({ ...form, ehsTitle: value })}
                    placeholder="SAFETY. RESPONSIBILITY. SUSTAINABILITY."
                  />

                  <FormField
                    label="EHS Description"
                    value={form.ehsDescription}
                    onChange={(value) => setForm({ ...form, ehsDescription: value })}
                    placeholder="EHS description..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.ehsInlineLinks}
                    onChange={(links) => setForm({ ...form, ehsInlineLinks: links })}
                    label="EHS Inline Links"
                    description="Text within the EHS section that will become clickable."
                  />
                </div>

                {/* EHS CATEGORIES */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      EHS Categories ({form.ehsCategories.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddEHSCategory}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Category
                    </Button>
                  </div>

                  {showEHSCategoryForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingEHSCategoryIndex !== null ? "Edit EHS Category" : "New EHS Category"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={ehsCategoryDraft.category}
                          onChange={(e) => setEhsCategoryDraft((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder="Category (e.g. People)"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={ehsCategoryDraft.title}
                          onChange={(e) => setEhsCategoryDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Title"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={ehsCategoryDraft.description}
                        onChange={(e) => setEhsCategoryDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Category description"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <InlineLinkManager
                        links={ehsCategoryDraft.inlineLinks || []}
                        onChange={updateEHSCategoryInlineLinks}
                        label="EHS Category Inline Links"
                        description="Text within this category that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveEHSCategoryDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingEHSCategoryIndex !== null ? "Save Category" : "Add Category"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEHSCategoryForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.ehsCategories.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No EHS categories yet. Add your first category above.
                      </p>
                    )}

                    {form.ehsCategories.map((category, index) => (
                      <div
                        key={category._id || `${category.category}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase text-[#67003E]">
                            {category.category}
                          </p>
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {category.title}
                          </p>
                          <p className="text-[12px] text-[#666666] line-clamp-1">
                            {category.description}
                          </p>
                          {(category.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {category.inlineLinks!.length} link{category.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditEHSCategory(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeEHSCategory(index)}
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
                    disabled={submitting}
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
                Delete Quality & EHS Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.qualityTitle || "Quality & EHS"}&quot; and all its pillars and categories.
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