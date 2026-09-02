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

const ENDPOINT = "/contact/page";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface LocationCard {
  _id?: string;
  number: string;
  title: string;
  address: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ContactPageData {
  _id?: string;
  pageTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  dubaiLocation: string;
  rasAlKhaimahLocation: string;
  directLine: string;
  directLineLabel: string;
  contactInlineLinks: InlineLink[];
  getInTouchTitle: string;
  getInTouchHeadingOne: string;
  getInTouchHeadingTwo: string;
  getInTouchDescription: string;
  locationCards: LocationCard[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ContactPagePayload {
  pageTitle: string;
  heroTitle: string;
  heroTitleTwo: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  dubaiLocation: string;
  rasAlKhaimahLocation: string;
  directLine: string;
  directLineLabel: string;
  contactInlineLinks: InlineLink[];
  getInTouchTitle: string;
  getInTouchHeadingOne: string;
  getInTouchHeadingTwo: string;
  getInTouchDescription: string;
  locationCards: LocationCard[];
  isActive: boolean;
}

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_LOCATION_CARD: LocationCard = {
  number: "",
  title: "",
  address: "",
  icon: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: ContactPagePayload = {
  pageTitle: "",
  heroTitle: "",
  heroTitleTwo: "",
  heroDescription: "",
  heroImage: "",
  heroImageAlt: "",
  heroInlineLinks: [],
  dubaiLocation: "",
  rasAlKhaimahLocation: "",
  directLine: "",
  directLineLabel: "",
  contactInlineLinks: [],
  getInTouchTitle: "",
  getInTouchHeadingOne: "",
  getInTouchHeadingTwo: "",
  getInTouchDescription: "",
  locationCards: [],
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

function isContactPageData(val: unknown): val is ContactPageData {
  return !!val && typeof val === "object" && "pageTitle" in (val as object);
}

function parseContactPageList(data: unknown): ContactPageData[] {
  if (Array.isArray(data)) return data as ContactPageData[];
  if (isContactPageData(data)) return [data];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidateKeys = [
      "contactPage",
      "data",
      "result",
      "results",
      "item",
      "payload",
    ];

    for (const key of candidateKeys) {
      if (!(key in obj)) continue;
      const val = obj[key];
      if (Array.isArray(val)) return val as ContactPageData[];
      if (isContactPageData(val)) return [val];
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[ContactPageAdminPage] Unrecognized API response shape for GET /contact/page:",
      data,
    );
  }

  return [];
}

function mapEntryToForm(entry: ContactPageData): ContactPagePayload {
  return {
    pageTitle: entry.pageTitle || "",
    heroTitle: entry.heroTitle || "",
    heroTitleTwo: entry.heroTitleTwo || "",
    heroDescription: entry.heroDescription || "",
    heroImage: entry.heroImage ? entry.heroImage.trim() : "",
    heroImageAlt: entry.heroImageAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    dubaiLocation: entry.dubaiLocation || "",
    rasAlKhaimahLocation: entry.rasAlKhaimahLocation || "",
    directLine: entry.directLine || "",
    directLineLabel: entry.directLineLabel || "",
    contactInlineLinks: entry.contactInlineLinks || [],
    getInTouchTitle: entry.getInTouchTitle || "",
    getInTouchHeadingOne: entry.getInTouchHeadingOne || "",
    getInTouchHeadingTwo: entry.getInTouchHeadingTwo || "",
    getInTouchDescription: entry.getInTouchDescription || "",
    locationCards: [...(entry.locationCards || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((card) => ({ ...card, inlineLinks: card.inlineLinks || [] })),
    isActive: entry.isActive ?? true,
  };
}

function serializeLocationCard(card: LocationCard): Omit<LocationCard, "_id"> {
  const { _id, ...rest } = card;
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

export default function ContactPageAdminPage() {
  const [entry, setEntry] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactPagePayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);

  const [showLocationCardForm, setShowLocationCardForm] = useState(false);
  const [locationCardDraft, setLocationCardDraft] = useState<LocationCard>(EMPTY_LOCATION_CARD);
  const [editingLocationCardIndex, setEditingLocationCardIndex] = useState<number | null>(null);

  const heroImageInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchContactPage = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT);
      const entries = parseContactPageList(res.data);
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Contact Page"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactPage();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!entry) {
      toast.error("No Contact Page loaded yet. Try refreshing the page.");
      return;
    }
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingHeroImage) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowLocationCardForm(false);
    setEditingLocationCardIndex(null);
    setLocationCardDraft(EMPTY_LOCATION_CARD);
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

  // ---------- LOCATION CARDS ----------

  const openAddLocationCard = () => {
    setLocationCardDraft({
      ...EMPTY_LOCATION_CARD,
      number: String(form.locationCards.length + 1).padStart(2, "0"),
      order: form.locationCards.length,
      inlineLinks: [],
    });
    setEditingLocationCardIndex(null);
    setShowLocationCardForm(true);
  };

  const openEditLocationCard = (index: number) => {
    setLocationCardDraft({
      ...form.locationCards[index],
      inlineLinks: form.locationCards[index].inlineLinks || [],
    });
    setEditingLocationCardIndex(index);
    setShowLocationCardForm(true);
  };

  const cancelLocationCardForm = () => {
    setShowLocationCardForm(false);
    setEditingLocationCardIndex(null);
    setLocationCardDraft(EMPTY_LOCATION_CARD);
  };

  const saveLocationCardDraft = () => {
    if (!locationCardDraft.title.trim() || !locationCardDraft.address.trim()) {
      toast.error("Location card title and address are required");
      return;
    }

    setForm((prev) => {
      const cards = [...prev.locationCards];
      if (editingLocationCardIndex !== null) {
        cards[editingLocationCardIndex] = locationCardDraft;
      } else {
        cards.push(locationCardDraft);
      }
      return {
        ...prev,
        locationCards: cards.map((card, index) => ({ ...card, order: index })),
      };
    });
    cancelLocationCardForm();
  };

  const removeLocationCard = (index: number) => {
    setForm((prev) => ({
      ...prev,
      locationCards: prev.locationCards
        .filter((_, i) => i !== index)
        .map((card, i) => ({ ...card, order: i })),
    }));
  };

  const updateLocationCardInlineLinks = (links: InlineLink[]) => {
    setLocationCardDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.pageTitle.trim()) {
      toast.error("Page title is required");
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
      pageTitle: form.pageTitle,
      heroTitle: form.heroTitle,
      heroTitleTwo: form.heroTitleTwo,
      heroDescription: form.heroDescription,
      heroImage: form.heroImage,
      heroImageAlt: form.heroImageAlt,
      heroInlineLinks: form.heroInlineLinks,
      dubaiLocation: form.dubaiLocation,
      rasAlKhaimahLocation: form.rasAlKhaimahLocation,
      directLine: form.directLine,
      directLineLabel: form.directLineLabel,
      contactInlineLinks: form.contactInlineLinks,
      getInTouchTitle: form.getInTouchTitle,
      getInTouchHeadingOne: form.getInTouchHeadingOne,
      getInTouchHeadingTwo: form.getInTouchHeadingTwo,
      getInTouchDescription: form.getInTouchDescription,
      locationCards: form.locationCards.map(serializeLocationCard),
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Contact Page updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Contact Page created");
      }

      closeModal();
      fetchContactPage();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Contact Page"
            : "Failed to create Contact Page",
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
      toast.success(entry.isActive ? "Page deactivated" : "Page activated");
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
      toast.success("Contact Page deleted");
      setConfirmDeleteSection(false);
      setEntry(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Contact Page"));
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
            Contact Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the Contact Page content including hero, location cards, and get in touch section.
          </p>
        </div>

        {!entry && !loading && (
          <Button
            onClick={openCreateModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Contact Page
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
                No Contact Page content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a page to manage contact content.
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
                    {entry.pageTitle || "Contact Page"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666] line-clamp-2">
                    {entry.heroTitle} {entry.heroTitleTwo}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.locationCards?.length || 0} Locations</span>
                    <span>•</span>
                    <span>{entry.directLine}</span>
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
                  Edit Page
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
                  {editingId ? "Edit Contact Page" : "Create Contact Page"}
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
                {/* PAGE TITLE */}
                <FormField
                  label="Page Title"
                  value={form.pageTitle}
                  onChange={(value) => setForm({ ...form, pageTitle: value })}
                  placeholder="Contact Mega Quality Laboratory"
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
                      placeholder="LET'S TALK ABOUT YOUR"
                    />
                    <FormField
                      label="Hero Title Line 2"
                      value={form.heroTitleTwo}
                      onChange={(value) => setForm({ ...form, heroTitleTwo: value })}
                      placeholder="PROJECT."
                    />
                  </div>

                  <FormField
                    label="Hero Description"
                    value={form.heroDescription}
                    onChange={(value) => setForm({ ...form, heroDescription: value })}
                    placeholder="Hero description..."
                    textarea
                    rows={3}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.heroInlineLinks}
                    onChange={(links) => setForm({ ...form, heroInlineLinks: links })}
                    label="Hero Inline Links"
                    description="Text within the hero description that will become clickable."
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

                {/* CONTACT INFO */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Dubai Location"
                      value={form.dubaiLocation}
                      onChange={(value) => setForm({ ...form, dubaiLocation: value })}
                      placeholder="United Arab Emirates"
                    />
                    <FormField
                      label="Ras Al Khaimah Location"
                      value={form.rasAlKhaimahLocation}
                      onChange={(value) => setForm({ ...form, rasAlKhaimahLocation: value })}
                      placeholder="United Arab Emirates"
                    />
                    <FormField                      label="Direct Line"
                      value={form.directLine}
                      onChange={(value) => setForm({ ...form, directLine: value })}
                      placeholder="+971 52 652 3220"
                    />
                    <FormField
                      label="Direct Line Label"
                      value={form.directLineLabel}
                      onChange={(value) => setForm({ ...form, directLineLabel: value })}
                      placeholder="DIRECT LINE"
                    />
                  </div>

                  <InlineLinkManager
                    links={form.contactInlineLinks}
                    onChange={(links) => setForm({ ...form, contactInlineLinks: links })}
                    label="Contact Inline Links"
                    description="Text within the contact section that will become clickable."
                  />
                </div>

                {/* GET IN TOUCH */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Get In Touch Section
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Section Title"
                      value={form.getInTouchTitle}
                      onChange={(value) => setForm({ ...form, getInTouchTitle: value })}
                      placeholder="GET IN TOUCH"
                    />
                    <FormField
                      label="Heading Line 1"
                      value={form.getInTouchHeadingOne}
                      onChange={(value) => setForm({ ...form, getInTouchHeadingOne: value })}
                      placeholder="TELL US WHAT YOU NEED"
                    />
                    <FormField
                      label="Heading Line 2"
                      value={form.getInTouchHeadingTwo}
                      onChange={(value) => setForm({ ...form, getInTouchHeadingTwo: value })}
                      placeholder="TESTED."
                    />
                  </div>

                  <FormField
                    label="Description"
                    value={form.getInTouchDescription}
                    onChange={(value) => setForm({ ...form, getInTouchDescription: value })}
                    placeholder="Send Your Project Details And Our Team Can Help Direct Your Enquiry..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />
                </div>

                {/* LOCATION CARDS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Location Cards ({form.locationCards.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddLocationCard}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Location Card
                    </Button>
                  </div>

                  {showLocationCardForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingLocationCardIndex !== null ? "Edit Location Card" : "New Location Card"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3">
                        <Input
                          value={locationCardDraft.number}
                          onChange={(e) => setLocationCardDraft((prev) => ({ ...prev, number: e.target.value }))}
                          placeholder="01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={locationCardDraft.title}
                          onChange={(e) => setLocationCardDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="DUBAI"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={locationCardDraft.icon}
                          onChange={(e) => setLocationCardDraft((prev) => ({ ...prev, icon: e.target.value }))}
                          placeholder="fa-solid fa-location-dot"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={locationCardDraft.address}
                        onChange={(e) => setLocationCardDraft((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Address"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <InlineLinkManager
                        links={locationCardDraft.inlineLinks || []}
                        onChange={updateLocationCardInlineLinks}
                        label="Location Card Inline Links"
                        description="Text within this location card that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveLocationCardDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingLocationCardIndex !== null ? "Save Card" : "Add Card"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelLocationCardForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.locationCards.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No location cards yet. Add your first card above.
                      </p>
                    )}

                    {form.locationCards.map((card, index) => (
                      <div
                        key={card._id || `${card.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            {card.icon && (
                              <span className="text-[#67003E] text-lg">
                                <i className={card.icon} />
                              </span>
                            )}
                            <div>
                              <p className="text-[10px] font-medium uppercase text-[#67003E]">
                                {card.number}
                              </p>
                              <p className="text-[14px] font-semibold text-[#111111]">
                                {card.title}
                              </p>
                            </div>
                          </div>
                          <p className="text-[12px] text-[#666666] line-clamp-1 mt-1">
                            {card.address}
                          </p>
                          {(card.inlineLinks?.length ?? 0) > 0 && (
                            <span className="text-[10px] text-[#67003E]">
                              • {card.inlineLinks!.length} link{card.inlineLinks!.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditLocationCard(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeLocationCard(index)}
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
                      Show this page on the website
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
                    disabled={submitting || uploadingHeroImage}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Page"
                    ) : (
                      "Create Page"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM: DELETE THE WHOLE PAGE */}
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
                Delete Contact Page?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This permanently deletes &quot;{entry.pageTitle}&quot; and all its content. This cannot be undone.
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
                  {deletingSection ? "Deleting..." : "Delete Page"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}