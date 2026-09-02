"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  AlignLeft,
  CircleDot,
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

const ENDPOINT = "/home-ndt-equipment";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface NDTModule {
  _id?: string;
  moduleNumber: string;
  title: string;
  image: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EquipmentCategory {
  _id?: string;
  title: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EquipmentItem {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface NDTEquipmentPayload {
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  ndtModules: NDTModule[];
  materialTestingTitle: string;
  materialTestingInlineLinks: InlineLink[];
  equipmentTitle: string;
  equipmentTitleTwo: string;
  equipmentDescription: string;
  equipmentInlineLinks: InlineLink[];
  equipmentCategories: EquipmentCategory[];
  equipmentItems: EquipmentItem[];
  isActive: boolean;
}

interface NDTEquipment extends NDTEquipmentPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type ListResponse = NDTEquipment[] | { ndtEquipment: NDTEquipment[] } | NDTEquipment;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_MODULE: NDTModule = {
  moduleNumber: "",
  title: "",
  image: "",
  description: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_CATEGORY: EquipmentCategory = {
  title: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_EQUIPMENT_ITEM: EquipmentItem = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  imageAlt: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: NDTEquipmentPayload = {
  sectionTitle: "",
  heroTitle: "",
  heroTitleTwo: "",
  heroTitleThree: "",
  heroImage: "",
  heroImageAlt: "",
  heroInlineLinks: [],
  ndtModules: [],
  materialTestingTitle: "",
  materialTestingInlineLinks: [],
  equipmentTitle: "",
  equipmentTitleTwo: "",
  equipmentDescription: "",
  equipmentInlineLinks: [],
  equipmentCategories: [],
  equipmentItems: [],
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

function parseNDTEquipmentList(data: unknown): NDTEquipment[] {
  if (Array.isArray(data)) return data as NDTEquipment[];
  if (
    data &&
    typeof data === "object" &&
    "ndtEquipment" in data &&
    Array.isArray((data as { ndtEquipment: NDTEquipment[] }).ndtEquipment)
  ) {
    return (data as { ndtEquipment: NDTEquipment[] }).ndtEquipment;
  }
  if (data && typeof data === "object" && "sectionTitle" in data) {
    return [data as NDTEquipment];
  }
  return [];
}

function mapEntryToForm(entry: NDTEquipment): NDTEquipmentPayload {
  return {
    sectionTitle: entry.sectionTitle || "",
    heroTitle: entry.heroTitle || "",
    heroTitleTwo: entry.heroTitleTwo || "",
    heroTitleThree: entry.heroTitleThree || "",
    heroImage: entry.heroImage || "",
    heroImageAlt: entry.heroImageAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    ndtModules: [...(entry.ndtModules || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((module) => ({ ...module, inlineLinks: module.inlineLinks || [] })),
    materialTestingTitle: entry.materialTestingTitle || "",
    materialTestingInlineLinks: entry.materialTestingInlineLinks || [],
    equipmentTitle: entry.equipmentTitle || "",
    equipmentTitleTwo: entry.equipmentTitleTwo || "",
    equipmentDescription: entry.equipmentDescription || "",
    equipmentInlineLinks: entry.equipmentInlineLinks || [],
    equipmentCategories: [...(entry.equipmentCategories || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((category) => ({ ...category, inlineLinks: category.inlineLinks || [] })),
    equipmentItems: [...(entry.equipmentItems || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({ ...item, inlineLinks: item.inlineLinks || [] })),
    isActive: entry.isActive ?? true,
  };
}

function serializeModule(module: NDTModule): Omit<NDTModule, "_id"> {
  const { _id: _unused, ...rest } = module;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeCategory(category: EquipmentCategory): Omit<EquipmentCategory, "_id"> {
  const { _id: _unused, ...rest } = category;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeEquipmentItem(item: EquipmentItem): Omit<EquipmentItem, "_id"> {
  const { _id: _unused, ...rest } = item;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

// ================= REUSABLE FORM FIELD =================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
      />
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

export default function NDTEquipmentAdminPage() {
  const [entries, setEntries] = useState<NDTEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NDTEquipmentPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingModuleImage, setUploadingModuleImage] = useState(false);
  const [uploadingEquipmentImage, setUploadingEquipmentImage] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<NDTEquipment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleDraft, setModuleDraft] = useState<NDTModule>(EMPTY_MODULE);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<EquipmentCategory>(EMPTY_CATEGORY);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);

  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [equipmentDraft, setEquipmentDraft] = useState<EquipmentItem>(EMPTY_EQUIPMENT_ITEM);
  const [editingEquipmentIndex, setEditingEquipmentIndex] = useState<number | null>(null);

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const moduleImageInputRef = useRef<HTMLInputElement>(null);
  const equipmentImageInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchNDTEquipment = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseNDTEquipmentList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load NDT Equipment sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNDTEquipment();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: NDTEquipment) => {
    setEditingId(entry._id);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingHeroImage || uploadingModuleImage || uploadingEquipmentImage) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModuleForm(false);
    setEditingModuleIndex(null);
    setModuleDraft(EMPTY_MODULE);
    setShowCategoryForm(false);
    setEditingCategoryIndex(null);
    setCategoryDraft(EMPTY_CATEGORY);
    setShowEquipmentForm(false);
    setEditingEquipmentIndex(null);
    setEquipmentDraft(EMPTY_EQUIPMENT_ITEM);
  };

  // ---------- HERO IMAGE ----------

  const handleHeroImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  // ---------- MODULE IMAGE ----------

  const handleModuleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingModuleImage(true);
      const result = await fileUpload(file);
      setModuleDraft((prev) => ({ ...prev, image: result.url }));
      toast.success("Module image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload module image"));
    } finally {
      setUploadingModuleImage(false);
      if (moduleImageInputRef.current) moduleImageInputRef.current.value = "";
    }
  };

  // ---------- EQUIPMENT IMAGE ----------

  const handleEquipmentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingEquipmentImage(true);
      const result = await fileUpload(file);
      setEquipmentDraft((prev) => ({ ...prev, image: result.url }));
      toast.success("Equipment image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload equipment image"));
    } finally {
      setUploadingEquipmentImage(false);
      if (equipmentImageInputRef.current) equipmentImageInputRef.current.value = "";
    }
  };

  // ---------- NDT MODULES ----------

  const openAddModule = () => {
    setModuleDraft({
      ...EMPTY_MODULE,
      moduleNumber: `MODULE ${String(form.ndtModules.length + 1).padStart(2, "0")}`,
      order: form.ndtModules.length,
      inlineLinks: [],
    });
    setEditingModuleIndex(null);
    setShowModuleForm(true);
  };

  const openEditModule = (index: number) => {
    setModuleDraft({
      ...form.ndtModules[index],
      inlineLinks: form.ndtModules[index].inlineLinks || [],
    });
    setEditingModuleIndex(index);
    setShowModuleForm(true);
  };

  const cancelModuleForm = () => {
    setShowModuleForm(false);
    setEditingModuleIndex(null);
    setModuleDraft(EMPTY_MODULE);
  };

  const saveModuleDraft = () => {
    if (!moduleDraft.title.trim() || !moduleDraft.description.trim()) {
      toast.error("Module title and description are required");
      return;
    }

    setForm((prev) => {
      const modules = [...prev.ndtModules];
      if (editingModuleIndex !== null) {
        modules[editingModuleIndex] = moduleDraft;
      } else {
        modules.push(moduleDraft);
      }
      return {
        ...prev,
        ndtModules: modules.map((module, index) => ({ ...module, order: index })),
      };
    });
    cancelModuleForm();
  };

  const removeModule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ndtModules: prev.ndtModules
        .filter((_, i) => i !== index)
        .map((module, i) => ({ ...module, order: i })),
    }));
  };

  const updateModuleInlineLinks = (links: InlineLink[]) => {
    setModuleDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- EQUIPMENT CATEGORIES ----------

  const openAddCategory = () => {
    setCategoryDraft({
      ...EMPTY_CATEGORY,
      order: form.equipmentCategories.length,
      inlineLinks: [],
    });
    setEditingCategoryIndex(null);
    setShowCategoryForm(true);
  };

  const openEditCategory = (index: number) => {
    setCategoryDraft({
      ...form.equipmentCategories[index],
      inlineLinks: form.equipmentCategories[index].inlineLinks || [],
    });
    setEditingCategoryIndex(index);
    setShowCategoryForm(true);
  };

  const cancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryIndex(null);
    setCategoryDraft(EMPTY_CATEGORY);
  };

  const saveCategoryDraft = () => {
    if (!categoryDraft.title.trim()) {
      toast.error("Category title is required");
      return;
    }

    setForm((prev) => {
      const categories = [...prev.equipmentCategories];
      if (editingCategoryIndex !== null) {
        categories[editingCategoryIndex] = categoryDraft;
      } else {
        categories.push(categoryDraft);
      }
      return {
        ...prev,
        equipmentCategories: categories.map((category, index) => ({ ...category, order: index })),
      };
    });
    cancelCategoryForm();
  };

  const removeCategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      equipmentCategories: prev.equipmentCategories
        .filter((_, i) => i !== index)
        .map((category, i) => ({ ...category, order: i })),
    }));
  };

  const updateCategoryInlineLinks = (links: InlineLink[]) => {
    setCategoryDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- EQUIPMENT ITEMS ----------

  const openAddEquipment = () => {
    setEquipmentDraft({
      ...EMPTY_EQUIPMENT_ITEM,
      order: form.equipmentItems.length,
      inlineLinks: [],
    });
    setEditingEquipmentIndex(null);
    setShowEquipmentForm(true);
  };

  const openEditEquipment = (index: number) => {
    setEquipmentDraft({
      ...form.equipmentItems[index],
      inlineLinks: form.equipmentItems[index].inlineLinks || [],
    });
    setEditingEquipmentIndex(index);
    setShowEquipmentForm(true);
  };

  const cancelEquipmentForm = () => {
    setShowEquipmentForm(false);
    setEditingEquipmentIndex(null);
    setEquipmentDraft(EMPTY_EQUIPMENT_ITEM);
  };

  const saveEquipmentDraft = () => {
    if (!equipmentDraft.title.trim() || !equipmentDraft.description.trim()) {
      toast.error("Equipment title and description are required");
      return;
    }

    setForm((prev) => {
      const items = [...prev.equipmentItems];
      if (editingEquipmentIndex !== null) {
        items[editingEquipmentIndex] = equipmentDraft;
      } else {
        items.push(equipmentDraft);
      }
      return {
        ...prev,
        equipmentItems: items.map((item, index) => ({ ...item, order: index })),
      };
    });
    cancelEquipmentForm();
  };

  const removeEquipment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      equipmentItems: prev.equipmentItems
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i })),
    }));
  };

  const updateEquipmentInlineLinks = (links: InlineLink[]) => {
    setEquipmentDraft((prev) => ({ ...prev, inlineLinks: links }));
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
    if (!form.heroImage.trim()) {
      toast.error("Hero image is required");
      return;
    }

    const payload: NDTEquipmentPayload = {
      ...form,
      ndtModules: form.ndtModules.map(serializeModule),
      equipmentCategories: form.equipmentCategories.map(serializeCategory),
      equipmentItems: form.equipmentItems.map(serializeEquipmentItem),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("NDT Equipment section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("NDT Equipment section created");
      }

      closeModal();
      fetchNDTEquipment();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update NDT Equipment section"
            : "Failed to create NDT Equipment section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: NDTEquipment) => {
    try {
      setTogglingId(entry._id);
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
      setDeletingId(deleteTarget._id);
      await api.delete(`${ENDPOINT}/${deleteTarget._id}`);
      setEntries((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("NDT Equipment section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete NDT Equipment section"));
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
            NDT & Equipment
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage Non-Destructive Testing modules and equipment inventory.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add NDT Section
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
                No NDT & Equipment content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage NDT modules and equipment.
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
                <div className="relative h-[220px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[240px]">
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

                  <div className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full bg-black/50 px-[10px] py-[5px] text-[11px] font-medium text-white backdrop-blur-sm">
                    {entry.ndtModules?.length ?? 0} modules
                  </div>

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
                    {entry.sectionTitle}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666]">
                    {entry.heroTitle} {entry.heroTitleTwo}
                  </p>
                  <p className="mt-[8px] text-[11px] text-[#999]">
                    {entry.ndtModules?.length || 0} NDT modules
                    {entry.equipmentItems?.length > 0 && (
                      <span className="ml-2">
                        • {entry.equipmentItems.length} equipment items
                      </span>
                    )}
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
                  {editingId ? "Edit NDT Equipment Section" : "Create NDT Equipment Section"}
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
                {/* Section Title */}
                <FormField
                  label="Section Title"
                  value={form.sectionTitle}
                  onChange={(value) => setForm({ ...form, sectionTitle: value })}
                  placeholder="Non-Destructive Testing"
                />

                {/* Hero Titles */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Hero Title
                  </Label>
                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3">
                    <Input
                      value={form.heroTitle}
                      onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                      placeholder="Line 1"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={form.heroTitleTwo}
                      onChange={(e) => setForm({ ...form, heroTitleTwo: e.target.value })}
                      placeholder="Line 2"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={form.heroTitleThree}
                      onChange={(e) => setForm({ ...form, heroTitleThree: e.target.value })}
                      placeholder="Line 3"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                {/* Hero Inline Links */}
                <InlineLinkManager
                  links={form.heroInlineLinks}
                  onChange={(links) => setForm({ ...form, heroInlineLinks: links })}
                  label="Hero Inline Links"
                  description="Text within the hero title that will become clickable."
                />

                {/* HERO IMAGE */}
                <div className="rounded-[14px] border border-[#D4B8A8] bg-[#F8F0F5] p-[14px] sm:p-[16px]">
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ImagePlus className="h-[13px] w-[13px]" /> Hero Image
                  </Label>
                  {form.heroImage && (
                    <div className="relative mb-[10px] h-[140px] w-full overflow-hidden rounded-[12px] bg-[#E8D5E0] sm:h-[160px]">
                      <Image
                        src={resolveImage(form.heroImage)}
                        alt="Hero preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    value={form.heroImageAlt}
                    onChange={(e) => setForm({ ...form, heroImageAlt: e.target.value })}
                    placeholder="Image alt text"
                    className="mb-[10px] h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
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
                    className="h-[44px] w-full gap-[8px] rounded-[12px] border-[#D4B8A8] bg-white text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E] sm:w-auto sm:px-[16px]"
                  >
                    {uploadingHeroImage ? (
                      <Loader2 className="h-[14px] w-[14px] animate-spin" />
                    ) : (
                      <UploadCloud className="h-[14px] w-[14px]" />
                    )}
                    {form.heroImage ? "Replace Hero Image" : "Upload Hero Image"}
                  </Button>
                </div>

                {/* NDT MODULES */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      NDT Modules ({form.ndtModules.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddModule}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Module
                    </Button>
                  </div>

                  {showModuleForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingModuleIndex !== null ? "Edit Module" : "New Module"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={moduleDraft.moduleNumber}
                          onChange={(e) => setModuleDraft((prev) => ({ ...prev, moduleNumber: e.target.value }))}
                          placeholder="MODULE 01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={moduleDraft.title}
                          onChange={(e) => setModuleDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Title"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={moduleDraft.description}
                        onChange={(e) => setModuleDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Module description"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      {/* Module Image */}
                      <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                        {moduleDraft.image && (
                          <div className="relative mb-[10px] h-[100px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                            <Image
                              src={resolveImage(moduleDraft.image)}
                              alt="Module preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <input
                          ref={moduleImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleModuleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => moduleImageInputRef.current?.click()}
                          disabled={uploadingModuleImage}
                          className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                        >
                          {uploadingModuleImage ? (
                            <Loader2 className="h-[14px] w-[14px] animate-spin" />
                          ) : (
                            <UploadCloud className="h-[14px] w-[14px]" />
                          )}
                          {moduleDraft.image ? "Replace Image" : "Upload Image"}
                        </Button>
                      </div>

                      <InlineLinkManager
                        links={moduleDraft.inlineLinks || []}
                        onChange={updateModuleInlineLinks}
                        label="Module Inline Links"
                        description="Text within this module that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveModuleDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingModuleIndex !== null ? "Save Module" : "Add Module"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelModuleForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.ndtModules.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No NDT modules yet. Add your first module above.
                      </p>
                    )}

                    {form.ndtModules.map((module, index) => (
                      <div
                        key={module._id || `${module.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase text-[#67003E]">
                            {module.moduleNumber}
                          </p>
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {module.title}
                          </p>
                          <p className="text-[12px] text-[#666666] line-clamp-1">
                            {module.description}
                          </p>
                          {(module.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {module.inlineLinks!.length} link{module.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditModule(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeModule(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Testing Title */}
                <FormField
                  label="Material Testing Title"
                  value={form.materialTestingTitle}
                  onChange={(value) => setForm({ ...form, materialTestingTitle: value })}
                  placeholder="Material Testing"
                />

                <InlineLinkManager
                  links={form.materialTestingInlineLinks}
                  onChange={(links) => setForm({ ...form, materialTestingInlineLinks: links })}
                  label="Material Testing Inline Links"
                  description="Text within material testing that will become clickable."
                />

                {/* Equipment Section */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Equipment Section
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Equipment Title Line 1"
                      value={form.equipmentTitle}
                      onChange={(value) => setForm({ ...form, equipmentTitle: value })}
                      placeholder="WHERE PRECISION MEETS"
                    />
                    <FormField
                      label="Equipment Title Line 2"
                      value={form.equipmentTitleTwo}
                      onChange={(value) => setForm({ ...form, equipmentTitleTwo: value })}
                      placeholder="EQUIPMENT"
                    />
                  </div>

                  <div className="mt-3">
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Equipment Description
                    </Label>
                    <Textarea
                      value={form.equipmentDescription}
                      onChange={(e) => setForm({ ...form, equipmentDescription: e.target.value })}
                      placeholder="Equipment description..."
                      rows={2}
                      className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                    />
                  </div>

                  <InlineLinkManager
                    links={form.equipmentInlineLinks}
                    onChange={(links) => setForm({ ...form, equipmentInlineLinks: links })}
                    label="Equipment Inline Links"
                    description="Text within equipment section that will become clickable."
                  />
                </div>

                {/* Equipment Categories */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Equipment Categories ({form.equipmentCategories.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddCategory}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Category
                    </Button>
                  </div>

                  {showCategoryForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingCategoryIndex !== null ? "Edit Category" : "New Category"}
                      </h4>

                      <Input
                        value={categoryDraft.title}
                        onChange={(e) => setCategoryDraft((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Category title"
                        className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <InlineLinkManager
                        links={categoryDraft.inlineLinks || []}
                        onChange={updateCategoryInlineLinks}
                        label="Category Inline Links"
                        description="Text within this category that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveCategoryDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingCategoryIndex !== null ? "Save Category" : "Add Category"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelCategoryForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.equipmentCategories.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No equipment categories yet.
                      </p>
                    )}

                    {form.equipmentCategories.map((category, index) => (
                      <div
                        key={category._id || `${category.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {category.title}
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
                            onClick={() => openEditCategory(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeCategory(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Items */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Equipment Items ({form.equipmentItems.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddEquipment}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Equipment
                    </Button>
                  </div>

                  {showEquipmentForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingEquipmentIndex !== null ? "Edit Equipment" : "New Equipment"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={equipmentDraft.title}
                          onChange={(e) => setEquipmentDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Title"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={equipmentDraft.subtitle}
                          onChange={(e) => setEquipmentDraft((prev) => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Subtitle"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={equipmentDraft.description}
                        onChange={(e) => setEquipmentDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Equipment description"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <Input
                        value={equipmentDraft.imageAlt}
                        onChange={(e) => setEquipmentDraft((prev) => ({ ...prev, imageAlt: e.target.value }))}
                        placeholder="Image alt text"
                        className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      {/* Equipment Image */}
                      <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                        {equipmentDraft.image && (
                          <div className="relative mb-[10px] h-[100px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                            <Image
                              src={resolveImage(equipmentDraft.image)}
                              alt="Equipment preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <input
                          ref={equipmentImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEquipmentImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => equipmentImageInputRef.current?.click()}
                          disabled={uploadingEquipmentImage}
                          className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                        >
                          {uploadingEquipmentImage ? (
                            <Loader2 className="h-[14px] w-[14px] animate-spin" />
                          ) : (
                            <UploadCloud className="h-[14px] w-[14px]" />
                          )}
                          {equipmentDraft.image ? "Replace Image" : "Upload Image"}
                        </Button>
                      </div>

                      <InlineLinkManager
                        links={equipmentDraft.inlineLinks || []}
                        onChange={updateEquipmentInlineLinks}
                        label="Equipment Inline Links"
                        description="Text within this equipment item that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveEquipmentDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingEquipmentIndex !== null ? "Save Equipment" : "Add Equipment"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEquipmentForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.equipmentItems.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No equipment items yet. Add your first equipment above.
                      </p>
                    )}

                    {form.equipmentItems.map((item, index) => (
                      <div
                        key={item._id || `${item.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[12px] text-[#666666]">
                              {item.subtitle}
                            </p>
                          )}
                          <p className="text-[12px] text-[#888888] line-clamp-1">
                            {item.description}
                          </p>
                          {(item.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {item.inlineLinks!.length} link{item.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditEquipment(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeEquipment(index)}
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
                    disabled={submitting || uploadingHeroImage || uploadingModuleImage || uploadingEquipmentImage}
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
                Delete NDT Equipment Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.sectionTitle}&quot; and all its modules and equipment.
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