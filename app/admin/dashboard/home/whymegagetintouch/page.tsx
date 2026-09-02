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

const ENDPOINT = "/home-why-mega";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface WhyFeature {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface Location {
  _id?: string;
  name: string;
  address: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface PhoneInlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface WhyMegaData {
  _id?: string;
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  whyFeatures: WhyFeature[];
  ctaTitle: string;
  ctaDescription: string;
  ctaHeadingOne: string;
  ctaHeadingTwo: string;
  requestTestButtonText: string;
  requestTestButtonLink: string;
  talkToEngineerButtonText: string;
  talkToEngineerButtonLink: string;
  ctaInlineLinks: InlineLink[];
  locations: Location[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: PhoneInlineLink[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface WhyMegaPayload {
  sectionTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  whyFeatures: WhyFeature[];
  ctaTitle: string;
  ctaDescription: string;
  ctaHeadingOne: string;
  ctaHeadingTwo: string;
  requestTestButtonText: string;
  requestTestButtonLink: string;
  talkToEngineerButtonText: string;
  talkToEngineerButtonLink: string;
  ctaInlineLinks: InlineLink[];
  locations: Location[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: PhoneInlineLink[];
  isActive: boolean;
}

type ListResponse = WhyMegaData[] | { whyMega: WhyMegaData[] } | WhyMegaData;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_FEATURE: WhyFeature = {
  title: "",
  description: "",
  icon: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_LOCATION: Location = {
  name: "",
  address: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: WhyMegaPayload = {
  sectionTitle: "",
  heroTitle: "",
  heroTitleTwo: "",
  heroImage: "",
  heroImageAlt: "",
  heroInlineLinks: [],
  whyFeatures: [],
  ctaTitle: "",
  ctaDescription: "",
  ctaHeadingOne: "",
  ctaHeadingTwo: "",
  requestTestButtonText: "",
  requestTestButtonLink: "",
  talkToEngineerButtonText: "",
  talkToEngineerButtonLink: "",
  ctaInlineLinks: [],
  locations: [],
  phoneLabel: "",
  phoneNumber: "",
  phoneInlineLinks: [],
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

function parseWhyMegaList(data: unknown): WhyMegaData[] {
  if (Array.isArray(data)) return data as WhyMegaData[];
  if (
    data &&
    typeof data === "object" &&
    "whyMega" in data &&
    Array.isArray((data as { whyMega: WhyMegaData[] }).whyMega)
  ) {
    return (data as { whyMega: WhyMegaData[] }).whyMega;
  }
  if (data && typeof data === "object" && "sectionTitle" in data) {
    return [data as WhyMegaData];
  }
  return [];
}

function mapEntryToForm(entry: WhyMegaData): WhyMegaPayload {
  return {
    sectionTitle: entry.sectionTitle || "",
    heroTitle: entry.heroTitle || "",
    heroTitleTwo: entry.heroTitleTwo || "",
    heroImage: entry.heroImage || "",
    heroImageAlt: entry.heroImageAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    whyFeatures: [...(entry.whyFeatures || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((feature) => ({ ...feature, inlineLinks: feature.inlineLinks || [] })),
    ctaTitle: entry.ctaTitle || "",
    ctaDescription: entry.ctaDescription || "",
    ctaHeadingOne: entry.ctaHeadingOne || "",
    ctaHeadingTwo: entry.ctaHeadingTwo || "",
    requestTestButtonText: entry.requestTestButtonText || "",
    requestTestButtonLink: entry.requestTestButtonLink || "",
    talkToEngineerButtonText: entry.talkToEngineerButtonText || "",
    talkToEngineerButtonLink: entry.talkToEngineerButtonLink || "",
    ctaInlineLinks: entry.ctaInlineLinks || [],
    locations: [...(entry.locations || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((location) => ({ ...location, inlineLinks: location.inlineLinks || [] })),
    phoneLabel: entry.phoneLabel || "",
    phoneNumber: entry.phoneNumber || "",
    phoneInlineLinks: entry.phoneInlineLinks || [],
    isActive: entry.isActive ?? true,
  };
}

function serializeFeature(feature: WhyFeature): Omit<WhyFeature, "_id"> {
  const { _id: _unused, ...rest } = feature;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeLocation(location: Location): Omit<Location, "_id"> {
  const { _id: _unused, ...rest } = location;
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

export default function WhyMegaAdminPage() {
  const [entries, setEntries] = useState<WhyMegaData[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WhyMegaPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFeatureIcon, setUploadingFeatureIcon] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<WhyMegaData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [featureDraft, setFeatureDraft] = useState<WhyFeature>(EMPTY_FEATURE);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationDraft, setLocationDraft] = useState<Location>(EMPTY_LOCATION);
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const featureIconInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchWhyMega = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseWhyMegaList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Why Mega sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhyMega();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: WhyMegaData) => {
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingImage || uploadingFeatureIcon) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowFeatureForm(false);
    setEditingFeatureIndex(null);
    setFeatureDraft(EMPTY_FEATURE);
    setShowLocationForm(false);
    setEditingLocationIndex(null);
    setLocationDraft(EMPTY_LOCATION);
  };

  // ---------- IMAGE UPLOAD ----------

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, heroImage: result.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // ---------- FEATURE ICON UPLOAD ----------

  const handleFeatureIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFeatureIcon(true);
      const result = await fileUpload(file);
      setFeatureDraft((prev) => ({ ...prev, icon: result.url }));
      toast.success("Icon uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload icon"));
    } finally {
      setUploadingFeatureIcon(false);
      if (featureIconInputRef.current) featureIconInputRef.current.value = "";
    }
  };

  // ---------- FEATURES ----------

  const openAddFeature = () => {
    setFeatureDraft({
      ...EMPTY_FEATURE,
      order: form.whyFeatures.length,
      inlineLinks: [],
    });
    setEditingFeatureIndex(null);
    setShowFeatureForm(true);
  };

  const openEditFeature = (index: number) => {
    setFeatureDraft({
      ...form.whyFeatures[index],
      inlineLinks: form.whyFeatures[index].inlineLinks || [],
    });
    setEditingFeatureIndex(index);
    setShowFeatureForm(true);
  };

  const cancelFeatureForm = () => {
    setShowFeatureForm(false);
    setEditingFeatureIndex(null);
    setFeatureDraft(EMPTY_FEATURE);
  };

  const saveFeatureDraft = () => {
    if (!featureDraft.title.trim() || !featureDraft.description.trim()) {
      toast.error("Feature title and description are required");
      return;
    }

    setForm((prev) => {
      const features = [...prev.whyFeatures];
      if (editingFeatureIndex !== null) {
        features[editingFeatureIndex] = featureDraft;
      } else {
        features.push(featureDraft);
      }
      return {
        ...prev,
        whyFeatures: features.map((feature, index) => ({ ...feature, order: index })),
      };
    });
    cancelFeatureForm();
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      whyFeatures: prev.whyFeatures
        .filter((_, i) => i !== index)
        .map((feature, i) => ({ ...feature, order: i })),
    }));
  };

  const updateFeatureInlineLinks = (links: InlineLink[]) => {
    setFeatureDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- LOCATIONS ----------

  const openAddLocation = () => {
    setLocationDraft({
      ...EMPTY_LOCATION,
      order: form.locations.length,
      inlineLinks: [],
    });
    setEditingLocationIndex(null);
    setShowLocationForm(true);
  };

  const openEditLocation = (index: number) => {
    setLocationDraft({
      ...form.locations[index],
      inlineLinks: form.locations[index].inlineLinks || [],
    });
    setEditingLocationIndex(index);
    setShowLocationForm(true);
  };

  const cancelLocationForm = () => {
    setShowLocationForm(false);
    setEditingLocationIndex(null);
    setLocationDraft(EMPTY_LOCATION);
  };

  const saveLocationDraft = () => {
    if (!locationDraft.name.trim() || !locationDraft.address.trim()) {
      toast.error("Location name and address are required");
      return;
    }

    setForm((prev) => {
      const locations = [...prev.locations];
      if (editingLocationIndex !== null) {
        locations[editingLocationIndex] = locationDraft;
      } else {
        locations.push(locationDraft);
      }
      return {
        ...prev,
        locations: locations.map((location, index) => ({ ...location, order: index })),
      };
    });
    cancelLocationForm();
  };

  const removeLocation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations
        .filter((_, i) => i !== index)
        .map((location, i) => ({ ...location, order: i })),
    }));
  };

  const updateLocationInlineLinks = (links: InlineLink[]) => {
    setLocationDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- PHONE INLINE LINKS ----------

  const updatePhoneInlineLinks = (links: PhoneInlineLink[]) => {
    setForm((prev) => ({ ...prev, phoneInlineLinks: links }));
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

    const payload: WhyMegaPayload = {
      ...form,
      whyFeatures: form.whyFeatures.map(serializeFeature),
      locations: form.locations.map(serializeLocation),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Why Mega section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Why Mega section created");
      }

      closeModal();
      fetchWhyMega();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Why Mega section"
            : "Failed to create Why Mega section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: WhyMegaData) => {
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
      toast.success("Why Mega section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Why Mega section"));
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
            Why Mega
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the Why Mega section content including features with icons.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Why Mega Section
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
                No Why Mega content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage Why Mega content.
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
                <div className="relative h-[160px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[180px]">
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
                    {entry.sectionTitle || "Why Mega"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                    {entry.heroTitle} {entry.heroTitleTwo}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.whyFeatures?.length || 0} Features</span>
                    <span>•</span>
                    <span>{entry.locations?.length || 0} Locations</span>
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
                  {editingId ? "Edit Why Mega Section" : "Create Why Mega Section"}
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
                  placeholder="Why Mega"
                />

                {/* HERO SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Hero Section
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Hero Title Line 1"
                      value={form.heroTitle}
                      onChange={(value) => setForm({ ...form, heroTitle: value })}
                      placeholder="WHY ENGINEERING TEAMS CHOOSE"
                    />
                    <FormField
                      label="Hero Title Line 2"
                      value={form.heroTitleTwo}
                      onChange={(value) => setForm({ ...form, heroTitleTwo: value })}
                      placeholder="MEGA"
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
                      {form.heroImage ? "Replace Hero Image" : "Upload Hero Image"}
                    </Button>
                  </div>
                </div>

                {/* WHY FEATURES */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Why Features ({form.whyFeatures.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddFeature}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Feature
                    </Button>
                  </div>

                  {showFeatureForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingFeatureIndex !== null ? "Edit Feature" : "New Feature"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={featureDraft.title}
                          onChange={(e) => setFeatureDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="INDEPENDENT TESTING"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Textarea
                          value={featureDraft.description}
                          onChange={(e) => setFeatureDraft((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Feature description"
                          rows={2}
                          className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      {/* Feature Icon Upload */}
                      <div className="rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                        {featureDraft.icon && (
                          <div className="relative mb-[10px] h-[63px] w-[63px] overflow-hidden rounded-full border border-dashed border-[#D4A017] bg-white">
                            <Image
                              src={resolveImage(featureDraft.icon)}
                              alt="Feature icon preview"
                              fill
                              unoptimized
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            ref={featureIconInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFeatureIconUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => featureIconInputRef.current?.click()}
                            disabled={uploadingFeatureIcon}
                            className="h-[38px] flex-1 gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            {uploadingFeatureIcon ? (
                              <Loader2 className="h-[14px] w-[14px] animate-spin" />
                            ) : (
                              <UploadCloud className="h-[14px] w-[14px]" />
                            )}
                            {featureDraft.icon ? "Replace Icon" : "Upload Icon"}
                          </Button>
                          {featureDraft.icon && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setFeatureDraft((prev) => ({ ...prev, icon: "" }))}
                              className="h-[38px] rounded-[8px] border-[#F3D0D0] bg-white text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-1 text-[9px] text-[#888888]">
                          Upload a square image (PNG, JPG, SVG). Recommended size: 63x63px.
                        </p>
                      </div>

                      <InlineLinkManager
                        links={featureDraft.inlineLinks || []}
                        onChange={updateFeatureInlineLinks}
                        label="Feature Inline Links"
                        description="Text within this feature that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveFeatureDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingFeatureIndex !== null ? "Save Feature" : "Add Feature"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelFeatureForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.whyFeatures.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No features yet. Add your first feature above.
                      </p>
                    )}

                    {form.whyFeatures.map((feature, index) => (
                      <div
                        key={feature._id || `${feature.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            {feature.icon && (
                              <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full border border-dashed border-[#D4A017] bg-white">
                                <Image
                                  src={resolveImage(feature.icon)}
                                  alt={feature.title}
                                  fill
                                  unoptimized
                                  className="object-contain p-1"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-[14px] font-semibold text-[#111111]">
                                {feature.title}
                              </p>
                              <p className="text-[12px] text-[#666666] line-clamp-1">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          {(feature.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {feature.inlineLinks!.length} link{feature.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditFeature(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeFeature(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    CTA Section
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="CTA Title"
                      value={form.ctaTitle}
                      onChange={(value) => setForm({ ...form, ctaTitle: value })}
                      placeholder="Get In Touch"
                    />
                    <FormField
                      label="CTA Heading Line 1"
                      value={form.ctaHeadingOne}
                      onChange={(value) => setForm({ ...form, ctaHeadingOne: value })}
                      placeholder="HAVE A PROJECT THAT NEEDS"
                    />
                    <FormField
                      label="CTA Heading Line 2"
                      value={form.ctaHeadingTwo}
                      onChange={(value) => setForm({ ...form, ctaHeadingTwo: value })}
                      placeholder="TESTING?"
                    />
                    <FormField
                      label="Request Test Button Text"
                      value={form.requestTestButtonText}
                      onChange={(value) => setForm({ ...form, requestTestButtonText: value })}
                      placeholder="REQUEST A TEST"
                    />
                  </div>

                  <FormField
                    label="CTA Description"
                    value={form.ctaDescription}
                    onChange={(value) => setForm({ ...form, ctaDescription: value })}
                    placeholder="CTA description..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="Request Test Button Link"
                      value={form.requestTestButtonLink}
                      onChange={(value) => setForm({ ...form, requestTestButtonLink: value })}
                      placeholder="/request-a-test"
                    />
                    <FormField
                      label="Talk to Engineer Button Text"
                      value={form.talkToEngineerButtonText}
                      onChange={(value) => setForm({ ...form, talkToEngineerButtonText: value })}
                      placeholder="TALK TO AN ENGINEER"
                    />
                    <FormField
                      label="Talk to Engineer Button Link"
                      value={form.talkToEngineerButtonLink}
                      onChange={(value) => setForm({ ...form, talkToEngineerButtonLink: value })}
                      placeholder="/contact"
                    />
                  </div>

                  <InlineLinkManager
                    links={form.ctaInlineLinks}
                    onChange={(links) => setForm({ ...form, ctaInlineLinks: links })}
                    label="CTA Inline Links"
                    description="Text within the CTA that will become clickable."
                  />
                </div>

                {/* LOCATIONS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Locations ({form.locations.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddLocation}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Location
                    </Button>
                  </div>

                  {showLocationForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingLocationIndex !== null ? "Edit Location" : "New Location"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={locationDraft.name}
                          onChange={(e) => setLocationDraft((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Dubai"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={locationDraft.address}
                          onChange={(e) => setLocationDraft((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="Dubai, United Arab Emirates"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <InlineLinkManager
                        links={locationDraft.inlineLinks || []}
                        onChange={updateLocationInlineLinks}
                        label="Location Inline Links"
                        description="Text within this location that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveLocationDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingLocationIndex !== null ? "Save Location" : "Add Location"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelLocationForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.locations.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No locations yet. Add your first location above.
                      </p>
                    )}

                    {form.locations.map((location, index) => (
                      <div
                        key={location._id || `${location.name}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-[#111111]">
                            {location.name}
                          </p>
                          <p className="text-[12px] text-[#666666]">
                            {location.address}
                          </p>
                          {(location.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {location.inlineLinks!.length} link{location.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditLocation(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeLocation(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PHONE */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Phone
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Phone Label"
                      value={form.phoneLabel}
                      onChange={(value) => setForm({ ...form, phoneLabel: value })}
                      placeholder="Phone"
                    />
                    <FormField
                      label="Phone Number"
                      value={form.phoneNumber}
                      onChange={(value) => setForm({ ...form, phoneNumber: value })}
                      placeholder="+971 52 652 3220"
                    />
                  </div>

                  <InlineLinkManager
                    links={form.phoneInlineLinks}
                    onChange={updatePhoneInlineLinks}
                    label="Phone Inline Links"
                    description="Text within the phone that will become clickable."
                  />
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
                    disabled={submitting || uploadingImage || uploadingFeatureIcon}
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
                Delete Why Mega Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.sectionTitle || "Why Mega"}&quot; and all its content.
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