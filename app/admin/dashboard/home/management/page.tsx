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

const ENDPOINT = "/home-management-process";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

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
  __v?: number;
}

interface ManagementProcessPayload {
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
}

type ListResponse = ManagementProcessData[] | { managementProcess: ManagementProcessData[] } | ManagementProcessData;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_PROCESS_STEP: ProcessStep = {
  stepNumber: "",
  title: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: ManagementProcessPayload = {
  managementTitle: "",
  managementSubtitle: "",
  managementSubtitleTwo: "",
  managementSubtitleThree: "",
  managementDescription: "",
  managingDirectorName: "",
  managingDirectorTitle: "",
  managingDirectorImage: "",
  managingDirectorImageAlt: "",
  managementInlineLinks: [],
  additionalInfo: "",
  additionalInfoInlineLinks: [],
  processTitle: "",
  processSubtitle: "",
  processSteps: [],
  processInlineLinks: [],
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

function parseManagementProcessList(data: unknown): ManagementProcessData[] {
  if (Array.isArray(data)) return data as ManagementProcessData[];
  if (
    data &&
    typeof data === "object" &&
    "managementProcess" in data &&
    Array.isArray((data as { managementProcess: ManagementProcessData[] }).managementProcess)
  ) {
    return (data as { managementProcess: ManagementProcessData[] }).managementProcess;
  }
  if (data && typeof data === "object" && "managementTitle" in data) {
    return [data as ManagementProcessData];
  }
  return [];
}

function mapEntryToForm(entry: ManagementProcessData): ManagementProcessPayload {
  return {
    managementTitle: entry.managementTitle || "",
    managementSubtitle: entry.managementSubtitle || "",
    managementSubtitleTwo: entry.managementSubtitleTwo || "",
    managementSubtitleThree: entry.managementSubtitleThree || "",
    managementDescription: entry.managementDescription || "",
    managingDirectorName: entry.managingDirectorName || "",
    managingDirectorTitle: entry.managingDirectorTitle || "",
    managingDirectorImage: entry.managingDirectorImage || "",
    managingDirectorImageAlt: entry.managingDirectorImageAlt || "",
    managementInlineLinks: entry.managementInlineLinks || [],
    additionalInfo: entry.additionalInfo || "",
    additionalInfoInlineLinks: entry.additionalInfoInlineLinks || [],
    processTitle: entry.processTitle || "",
    processSubtitle: entry.processSubtitle || "",
    processSteps: [...(entry.processSteps || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((step) => ({ ...step, inlineLinks: step.inlineLinks || [] })),
    processInlineLinks: entry.processInlineLinks || [],
    isActive: entry.isActive ?? true,
  };
}

function serializeProcessStep(step: ProcessStep): Omit<ProcessStep, "_id"> {
  const { _id: _unused, ...rest } = step;
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

export default function ManagementProcessAdminPage() {
  const [entries, setEntries] = useState<ManagementProcessData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ManagementProcessPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ManagementProcessData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showProcessStepForm, setShowProcessStepForm] = useState(false);
  const [processStepDraft, setProcessStepDraft] = useState<ProcessStep>(EMPTY_PROCESS_STEP);
  const [editingProcessStepIndex, setEditingProcessStepIndex] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchManagementProcess = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseManagementProcessList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Management & Process sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagementProcess();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: ManagementProcessData) => {
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingImage) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowProcessStepForm(false);
    setEditingProcessStepIndex(null);
    setProcessStepDraft(EMPTY_PROCESS_STEP);
  };

  // ---------- IMAGE UPLOAD ----------

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, managingDirectorImage: result.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // ---------- PROCESS STEPS ----------

  const openAddProcessStep = () => {
    setProcessStepDraft({
      ...EMPTY_PROCESS_STEP,
      stepNumber: String(form.processSteps.length + 1).padStart(2, "0"),
      order: form.processSteps.length,
      inlineLinks: [],
    });
    setEditingProcessStepIndex(null);
    setShowProcessStepForm(true);
  };

  const openEditProcessStep = (index: number) => {
    setProcessStepDraft({
      ...form.processSteps[index],
      inlineLinks: form.processSteps[index].inlineLinks || [],
    });
    setEditingProcessStepIndex(index);
    setShowProcessStepForm(true);
  };

  const cancelProcessStepForm = () => {
    setShowProcessStepForm(false);
    setEditingProcessStepIndex(null);
    setProcessStepDraft(EMPTY_PROCESS_STEP);
  };

  const saveProcessStepDraft = () => {
    if (!processStepDraft.title.trim()) {
      toast.error("Step title is required");
      return;
    }

    setForm((prev) => {
      const steps = [...prev.processSteps];
      if (editingProcessStepIndex !== null) {
        steps[editingProcessStepIndex] = processStepDraft;
      } else {
        steps.push(processStepDraft);
      }
      return {
        ...prev,
        processSteps: steps.map((step, index) => ({ ...step, order: index })),
      };
    });
    cancelProcessStepForm();
  };

  const removeProcessStep = (index: number) => {
    setForm((prev) => ({
      ...prev,
      processSteps: prev.processSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i })),
    }));
  };

  const updateProcessStepInlineLinks = (links: InlineLink[]) => {
    setProcessStepDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.managementTitle.trim()) {
      toast.error("Management title is required");
      return;
    }
    if (!form.managementDescription.trim()) {
      toast.error("Management description is required");
      return;
    }

    const payload: ManagementProcessPayload = {
      ...form,
      processSteps: form.processSteps.map(serializeProcessStep),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Management & Process section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Management & Process section created");
      }

      closeModal();
      fetchManagementProcess();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Management & Process section"
            : "Failed to create Management & Process section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: ManagementProcessData) => {
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
      toast.success("Management & Process section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Management & Process section"));
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
            Management & Process
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage management team details and testing process steps.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Section
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
                No Management & Process content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage management team and process steps.
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
                  {entry.managingDirectorImage ? (
                    <Image
                      src={resolveImage(entry.managingDirectorImage)}
                      alt={entry.managingDirectorImageAlt || entry.managingDirectorName || "Management"}
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
                    {entry.managementTitle || "Management & Process"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                    {entry.managementSubtitle} {entry.managementSubtitleTwo} {entry.managementSubtitleThree}
                  </p>
                  {entry.managingDirectorName && (
                    <p className="mt-[8px] text-[12px] font-medium text-[#67003E]">
                      {entry.managingDirectorName} • {entry.managingDirectorTitle}
                    </p>
                  )}
                  <p className="mt-[4px] text-[11px] text-[#999]">
                    {entry.processSteps?.length || 0} process steps
                  </p>

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
                  {editingId ? "Edit Management & Process Section" : "Create Management & Process Section"}
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
                {/* MANAGEMENT SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Management Section
                  </h3>

                  <FormField
                    label="Management Title"
                    value={form.managementTitle}
                    onChange={(value) => setForm({ ...form, managementTitle: value })}
                    placeholder="Management"
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3 mt-3">
                    <FormField
                      label="Subtitle Line 1"
                      value={form.managementSubtitle}
                      onChange={(value) => setForm({ ...form, managementSubtitle: value })}
                      placeholder="EXPERIENCED"
                    />
                    <FormField
                      label="Subtitle Line 2"
                      value={form.managementSubtitleTwo}
                      onChange={(value) => setForm({ ...form, managementSubtitleTwo: value })}
                      placeholder="PEOPLE."
                    />
                    <FormField
                      label="Subtitle Line 3"
                      value={form.managementSubtitleThree}
                      onChange={(value) => setForm({ ...form, managementSubtitleThree: value })}
                      placeholder="RELIABLE RESULTS."
                    />
                  </div>

                  <FormField
                    label="Management Description"
                    value={form.managementDescription}
                    onChange={(value) => setForm({ ...form, managementDescription: value })}
                    placeholder="Management description..."
                    textarea
                    rows={3}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.managementInlineLinks}
                    onChange={(links) => setForm({ ...form, managementInlineLinks: links })}
                    label="Management Inline Links"
                    description="Text within the management description that will become clickable."
                  />
                </div>

                {/* MANAGING DIRECTOR */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Managing Director
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Director Name"
                      value={form.managingDirectorName}
                      onChange={(value) => setForm({ ...form, managingDirectorName: value })}
                      placeholder="ABDULLAH MOHAMMAD"
                    />
                    <FormField
                      label="Director Title"
                      value={form.managingDirectorTitle}
                      onChange={(value) => setForm({ ...form, managingDirectorTitle: value })}
                      placeholder="MANAGING DIRECTOR"
                    />
                  </div>

                  <FormField
                    label="Image Alt Text"
                    value={form.managingDirectorImageAlt}
                    onChange={(value) => setForm({ ...form, managingDirectorImageAlt: value })}
                    placeholder="Abdullah Mohammad - Managing Director"
                    className="mt-3"
                  />

                  {/* Image Upload */}
                  <div className="mt-3 rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                    {form.managingDirectorImage && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(form.managingDirectorImage)}
                          alt="Managing Director preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {form.managingDirectorImage ? "Replace Image" : "Upload Image"}
                    </Button>
                  </div>
                </div>

                {/* ADDITIONAL INFO */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Additional Information
                  </h3>

                  <FormField
                    label="Additional Info Text"
                    value={form.additionalInfo}
                    onChange={(value) => setForm({ ...form, additionalInfo: value })}
                    placeholder="Additional Technical Personnel Profiles Available On Request."
                    textarea
                    rows={2}
                  />

                  <InlineLinkManager
                    links={form.additionalInfoInlineLinks}
                    onChange={(links) => setForm({ ...form, additionalInfoInlineLinks: links })}
                    label="Additional Info Inline Links"
                    description="Text within the additional info that will become clickable."
                  />
                </div>

                {/* PROCESS SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Process Section
                  </h3>

                  <FormField
                    label="Process Title"
                    value={form.processTitle}
                    onChange={(value) => setForm({ ...form, processTitle: value })}
                    placeholder="Testing Process"
                  />

                  <FormField
                    label="Process Subtitle"
                    value={form.processSubtitle}
                    onChange={(value) => setForm({ ...form, processSubtitle: value })}
                    placeholder="FROM FIELD INVESTIGATION TO FINAL REPORT"
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.processInlineLinks}
                    onChange={(links) => setForm({ ...form, processInlineLinks: links })}
                    label="Process Inline Links"
                    description="Text within the process section that will become clickable."
                  />
                </div>

                {/* PROCESS STEPS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Process Steps ({form.processSteps.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddProcessStep}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Step
                    </Button>
                  </div>

                  {showProcessStepForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingProcessStepIndex !== null ? "Edit Process Step" : "New Process Step"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={processStepDraft.stepNumber}
                          onChange={(e) => setProcessStepDraft((prev) => ({ ...prev, stepNumber: e.target.value }))}
                          placeholder="01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={processStepDraft.title}
                          onChange={(e) => setProcessStepDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="SITE INVESTIGATION"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <InlineLinkManager
                        links={processStepDraft.inlineLinks || []}
                        onChange={updateProcessStepInlineLinks}
                        label="Step Inline Links"
                        description="Text within this step that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveProcessStepDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingProcessStepIndex !== null ? "Save Step" : "Add Step"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelProcessStepForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.processSteps.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No process steps yet. Add your first step above.
                      </p>
                    )}

                    {form.processSteps.map((step, index) => (
                      <div
                        key={step._id || `${step.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase text-[#67003E]">
                            Step {step.stepNumber}
                          </p>
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {step.title}
                          </p>
                          {(step.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {step.inlineLinks!.length} link{step.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditProcessStep(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeProcessStep(index)}
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
                    disabled={submitting || uploadingImage}
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
                Delete Management & Process Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.managementTitle || "Management & Process"}&quot; and all its data.
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