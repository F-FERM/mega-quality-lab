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

const ENDPOINT = "/home";
const ABOUT_ENDPOINT = "/home-about";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface FeatureCard {
  _id?: string;
  number: string;
  label: string;
  title: string;
  description: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface StatItem {
  _id?: string;
  value: string;
  label: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface AboutLaboratoryPayload {
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

interface TestingHeroPayload {
  heroTitleOne: string;
  heroTitleTwo: string;
  heroTitleThree: string;
  heroDescription: string;
  heroDescriptionTwo: string;
  heroImage: string;
  heroImageAlt: string;
  heroInlineLinks: InlineLink[];
  requestTestButtonText: string;
  requestTestButtonLink: string;
  exploreServicesButtonText: string;
  exploreServicesButtonLink: string;
  qualityTitle: string;
  qualityTitleTwo: string;
  featureCards: FeatureCard[];
  isActive: boolean;
}

interface TestingHero extends TestingHeroPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AboutLaboratory extends AboutLaboratoryPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type ListResponse = TestingHero[] | { testingHeroes: TestingHero[] } | TestingHero;

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_CARD: FeatureCard = {
  number: "",
  label: "",
  title: "",
  description: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_STAT: StatItem = {
  value: "",
  label: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_ABOUT: AboutLaboratoryPayload = {
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

const EMPTY_FORM: TestingHeroPayload = {
  heroTitleOne: "",
  heroTitleTwo: "",
  heroTitleThree: "",
  heroDescription: "",
  heroDescriptionTwo: "",
  heroImage: "",
  heroImageAlt: "",
  heroInlineLinks: [],
  requestTestButtonText: "REQUEST A TEST",
  requestTestButtonLink: "/request-test",
  exploreServicesButtonText: "EXPLORE SERVICES",
  exploreServicesButtonLink: "/services",
  qualityTitle: "",
  qualityTitleTwo: "",
  featureCards: [],
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

function parseTestingHeroList(data: unknown): TestingHero[] {
  if (Array.isArray(data)) return data as TestingHero[];
  if (
    data &&
    typeof data === "object" &&
    "testingHeroes" in data &&
    Array.isArray((data as { testingHeroes: TestingHero[] }).testingHeroes)
  ) {
    return (data as { testingHeroes: TestingHero[] }).testingHeroes;
  }
  if (data && typeof data === "object" && "heroTitleOne" in data) {
    return [data as TestingHero];
  }
  return [];
}

function mapEntryToForm(entry: TestingHero): TestingHeroPayload {
  return {
    heroTitleOne: entry.heroTitleOne || "",
    heroTitleTwo: entry.heroTitleTwo || "",
    heroTitleThree: entry.heroTitleThree || "",
    heroDescription: entry.heroDescription || "",
    heroDescriptionTwo: entry.heroDescriptionTwo || "",
    heroImage: entry.heroImage || "",
    heroImageAlt: entry.heroImageAlt || "",
    heroInlineLinks: entry.heroInlineLinks || [],
    requestTestButtonText: entry.requestTestButtonText || "REQUEST A TEST",
    requestTestButtonLink: entry.requestTestButtonLink || "/request-test",
    exploreServicesButtonText:
      entry.exploreServicesButtonText || "EXPLORE SERVICES",
    exploreServicesButtonLink: entry.exploreServicesButtonLink || "/services",
    qualityTitle: entry.qualityTitle || "",
    qualityTitleTwo: entry.qualityTitleTwo || "",
    featureCards: [...(entry.featureCards || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((card) => ({ ...card, inlineLinks: card.inlineLinks || [] })),
    isActive: entry.isActive ?? true,
  };
}

function mapAboutToForm(entry: AboutLaboratory): AboutLaboratoryPayload {
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

function serializeFeatureCard(card: FeatureCard): Omit<FeatureCard, "_id"> {
  const { _id: _unused, ...rest } = card;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
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

export default function TestingHeroAdminPage() {
  const [entries, setEntries] = useState<TestingHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutLaboratory | null>(null);
  const [aboutLoading, setAboutLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestingHeroPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TestingHero | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDraft, setCardDraft] = useState<FeatureCard>(EMPTY_CARD);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  // About Laboratory state
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState<AboutLaboratoryPayload>(EMPTY_ABOUT);
  const [aboutSubmitting, setAboutSubmitting] = useState(false);
  const [aboutTogglingId, setAboutTogglingId] = useState<string | null>(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [uploadingAboutImageTwo, setUploadingAboutImageTwo] = useState(false);
  const [showStatForm, setShowStatForm] = useState(false);
  const [statDraft, setStatDraft] = useState<StatItem>(EMPTY_STAT);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageOneInputRef = useRef<HTMLInputElement>(null);
  const aboutImageTwoInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchTestingHeroes = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseTestingHeroList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load testing hero sections"));
    } finally {
      setLoading(false);
    }
  };

  const fetchAboutLaboratory = async () => {
    try {
      setAboutLoading(true);
      const res = await api.get(ABOUT_ENDPOINT);
      if (res.data && typeof res.data === "object") {
        setAboutData(res.data as AboutLaboratory);
        setAboutForm(mapAboutToForm(res.data as AboutLaboratory));
      }
    } catch (err) {
      console.error("Failed to fetch about laboratory:", err);
      setAboutData(null);
      setAboutForm(EMPTY_ABOUT);
    } finally {
      setAboutLoading(false);
    }
  };

  useEffect(() => {
    fetchTestingHeroes();
    fetchAboutLaboratory();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: TestingHero) => {
    setEditingId(entry._id);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingHeroImage) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowCardForm(false);
    setEditingCardIndex(null);
    setCardDraft(EMPTY_CARD);
  };

  // ---------- ABOUT MODAL ----------

  const openAboutEditModal = () => {
    if (aboutData) {
      setAboutForm(mapAboutToForm(aboutData));
    } else {
      setAboutForm(EMPTY_ABOUT);
    }
    setAboutModalOpen(true);
  };

  const closeAboutModal = () => {
    if (aboutSubmitting || uploadingAboutImage || uploadingAboutImageTwo) return;
    setAboutModalOpen(false);
    setShowStatForm(false);
    setEditingStatIndex(null);
    setStatDraft(EMPTY_STAT);
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

  // ---------- ABOUT IMAGES ----------

  const handleAboutImageOneUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAboutImage(true);
      const result = await fileUpload(file);
      setAboutForm((prev) => ({ ...prev, imageOne: result.url }));
      toast.success("Image one uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image one"));
    } finally {
      setUploadingAboutImage(false);
      if (aboutImageOneInputRef.current) aboutImageOneInputRef.current.value = "";
    }
  };

  const handleAboutImageTwoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAboutImageTwo(true);
      const result = await fileUpload(file);
      setAboutForm((prev) => ({ ...prev, imageTwo: result.url }));
      toast.success("Image two uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image two"));
    } finally {
      setUploadingAboutImageTwo(false);
      if (aboutImageTwoInputRef.current) aboutImageTwoInputRef.current.value = "";
    }
  };

  // ---------- STATS ----------

  const openAddStat = () => {
    setStatDraft({
      ...EMPTY_STAT,
      order: aboutForm.stats.length,
      inlineLinks: [],
    });
    setEditingStatIndex(null);
    setShowStatForm(true);
  };

  const openEditStat = (index: number) => {
    setStatDraft({
      ...aboutForm.stats[index],
      inlineLinks: aboutForm.stats[index].inlineLinks || [],
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

    setAboutForm((prev) => {
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
    setAboutForm((prev) => ({
      ...prev,
      stats: prev.stats
        .filter((_, i) => i !== index)
        .map((stat, i) => ({ ...stat, order: i })),
    }));
  };

  const updateStatInlineLinks = (links: InlineLink[]) => {
    setStatDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- FEATURE CARDS ----------

  const openAddCard = () => {
    setCardDraft({
      ...EMPTY_CARD,
      number: String(form.featureCards.length + 1).padStart(2, "0"),
      order: form.featureCards.length,
      inlineLinks: [],
    });
    setEditingCardIndex(null);
    setShowCardForm(true);
  };

  const openEditCard = (index: number) => {
    setCardDraft({
      ...form.featureCards[index],
      inlineLinks: form.featureCards[index].inlineLinks || [],
    });
    setEditingCardIndex(index);
    setShowCardForm(true);
  };

  const cancelCardForm = () => {
    setShowCardForm(false);
    setEditingCardIndex(null);
    setCardDraft(EMPTY_CARD);
  };

  const saveCardDraft = () => {
    if (!cardDraft.title.trim() || !cardDraft.description.trim()) {
      toast.error("Feature card title and description are required");
      return;
    }

    setForm((prev) => {
      const cards = [...prev.featureCards];
      if (editingCardIndex !== null) {
        cards[editingCardIndex] = cardDraft;
      } else {
        cards.push(cardDraft);
      }
      return {
        ...prev,
        featureCards: cards.map((card, index) => ({ ...card, order: index })),
      };
    });
    cancelCardForm();
  };

  const removeCard = (index: number) => {
    setForm((prev) => ({
      ...prev,
      featureCards: prev.featureCards
        .filter((_, i) => i !== index)
        .map((card, i) => ({ ...card, order: i })),
    }));
  };

  const updateCardInlineLinks = (links: InlineLink[]) => {
    setCardDraft((prev) => ({ ...prev, inlineLinks: links }));
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.heroTitleOne.trim()) {
      toast.error("Hero title (line 1) is required");
      return;
    }
    if (!form.heroDescription.trim()) {
      toast.error("Hero description is required");
      return;
    }
    if (!form.heroImage.trim()) {
      toast.error("Hero image is required");
      return;
    }

    const payload: TestingHeroPayload = {
      ...form,
      featureCards: form.featureCards.map(serializeFeatureCard),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Testing hero section updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Testing hero section created");
      }

      closeModal();
      fetchTestingHeroes();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update testing hero section"
            : "Failed to create testing hero section",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- ABOUT SUBMIT (PATCH only) ----------

  const handleAboutSubmit = async () => {
    if (!aboutForm.sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }
    if (!aboutForm.heroTitle.trim()) {
      toast.error("Hero title is required");
      return;
    }
    if (!aboutForm.description.trim()) {
      toast.error("Description is required");
      return;
    }

    const payload: AboutLaboratoryPayload = {
      ...aboutForm,
      stats: aboutForm.stats.map(serializeStat),
    };

    try {
      setAboutSubmitting(true);

      if (aboutData && aboutData._id) {
        // Use PATCH for updates
        await api.patch(`${ABOUT_ENDPOINT}`, payload);
        toast.success("About Laboratory section updated");
      } else {
        // Create new if no ID exists
        await api.post(ABOUT_ENDPOINT, payload);
        toast.success("About Laboratory section created");
      }

      closeAboutModal();
      fetchAboutLaboratory();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          aboutData && aboutData._id
            ? "Failed to update About Laboratory section"
            : "Failed to create About Laboratory section",
        ),
      );
    } finally {
      setAboutSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: TestingHero) => {
    try {
      setTogglingId(entry._id);
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
      setDeletingId(deleteTarget._id);
      await api.delete(`${ENDPOINT}/${deleteTarget._id}`);
      setEntries((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Testing hero section deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete testing hero section"));
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
            Testing Hero & About Laboratory
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the testing page hero, feature cards, and about laboratory section.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={openCreateModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Hero
          </Button>
          <Button
            onClick={openAboutEditModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-[#67003E] bg-transparent text-[14px] font-medium text-[#67003E] hover:bg-[#67003E] hover:text-white hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Pencil className="h-[18px] w-[18px]" />
            {aboutData ? "Edit About" : "Add About"}
          </Button>
        </div>
      </div>

      {/* ABOUT LABORATORY SECTION */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        <h2 className="mb-4 text-[18px] font-semibold text-[#111111]">About Laboratory</h2>
        {aboutLoading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#67003E] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : aboutData ? (
          <Card className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]">
            <CardContent className="p-[16px] sm:p-[20px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#111111]">
                    {aboutData.sectionTitle}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666]">
                    {aboutData.heroTitle} {aboutData.heroTitleTwo} {aboutData.heroTitleThree}
                  </p>
                  <p className="mt-[8px] text-[13px] text-[#888888]">
                    {aboutData.stats?.length || 0} stats
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${aboutData.isActive ? 'text-[#16A34A]' : 'text-[#888888]'}`}>
                    {aboutData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    onClick={openAboutEditModal}
                    variant="outline"
                    className="h-[36px] gap-[6px] rounded-[10px] border-[#D4B8A8] text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5]"
                  >
                    <Pencil className="h-[13px] w-[13px]" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No about laboratory content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Add content for the about laboratory section.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* TESTING HERO LIST */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        <h2 className="mb-4 text-[18px] font-semibold text-[#111111]">Testing Hero Sections</h2>
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#67003E] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : entries.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No testing hero content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage the hero and feature cards.
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
                      alt={entry.heroImageAlt || entry.heroTitleOne}
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
                    {entry.featureCards?.length ?? 0} cards
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
                    {entry.heroTitleOne} {entry.heroTitleTwo}
                  </h3>
                  <p className="mt-[8px] line-clamp-2 text-[13px] leading-[1.6] text-[#666666]">
                    {entry.heroDescription}
                  </p>
                  <p className="mt-[8px] text-[11px] text-[#999]">
                    {entry.featureCards?.length || 0} feature cards
                    {entry.featureCards?.some(
                      (card) => (card.inlineLinks?.length ?? 0) > 0,
                    ) && <span className="ml-2 text-[#67003E]">• with links</span>}
                  </p>

                  {(entry.qualityTitle || entry.qualityTitleTwo) && (
                    <div className="mt-[12px] rounded-[12px] bg-[#F8F0F5] p-[12px]">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#67003E]">
                        Quality section
                      </p>
                      <p className="mt-[4px] text-[14px] font-semibold text-[#111111]">
                        {entry.qualityTitle}
                        {entry.qualityTitleTwo}
                      </p>
                    </div>
                  )}

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

      {/* ==================== ABOUT LABORATORY MODAL ==================== */}
      <AnimatePresence>
        {aboutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[4px] sm:items-center sm:p-[20px]"
            onClick={closeAboutModal}
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
                  {aboutData && aboutData._id ? "Edit About Laboratory" : "Create About Laboratory"}
                </h2>
                <button
                  onClick={closeAboutModal}
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
                  value={aboutForm.sectionTitle}
                  onChange={(value) => setAboutForm({ ...aboutForm, sectionTitle: value })}
                  placeholder="About The Laboratory"
                />

                {/* Hero Titles */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Hero Title
                  </Label>
                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3">
                    <Input
                      value={aboutForm.heroTitle}
                      onChange={(e) => setAboutForm({ ...aboutForm, heroTitle: e.target.value })}
                      placeholder="Line 1"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={aboutForm.heroTitleTwo}
                      onChange={(e) => setAboutForm({ ...aboutForm, heroTitleTwo: e.target.value })}
                      placeholder="Line 2"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                    <Input
                      value={aboutForm.heroTitleThree}
                      onChange={(e) => setAboutForm({ ...aboutForm, heroTitleThree: e.target.value })}
                      placeholder="Line 3"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                {/* Hero Inline Links */}
                <InlineLinkManager
                  links={aboutForm.heroInlineLinks}
                  onChange={(links) => setAboutForm({ ...aboutForm, heroInlineLinks: links })}
                  label="Hero Inline Links"
                  description="Text within the hero title that will become clickable."
                />

                {/* Description */}
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Description
                  </Label>
                  <Textarea
                    value={aboutForm.description}
                    onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                    placeholder="Description text..."
                    rows={3}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                  <InlineLinkManager
                    links={aboutForm.descriptionInlineLinks}
                    onChange={(links) => setAboutForm({ ...aboutForm, descriptionInlineLinks: links })}
                    label="Description Inline Links"
                    description="Text within the description that will become clickable."
                  />
                </div>

                {/* Features */}
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Features
                  </Label>
                  <Textarea
                    value={aboutForm.featureOne}
                    onChange={(e) => setAboutForm({ ...aboutForm, featureOne: e.target.value })}
                    placeholder="Feature one..."
                    rows={2}
                    className="mb-[8px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                  <Textarea
                    value={aboutForm.featureTwo}
                    onChange={(e) => setAboutForm({ ...aboutForm, featureTwo: e.target.value })}
                    placeholder="Feature two..."
                    rows={2}
                    className="mb-[8px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                  <Textarea
                    value={aboutForm.featureThree}
                    onChange={(e) => setAboutForm({ ...aboutForm, featureThree: e.target.value })}
                    placeholder="Feature three..."
                    rows={2}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                  <InlineLinkManager
                    links={aboutForm.featureInlineLinks}
                    onChange={(links) => setAboutForm({ ...aboutForm, featureInlineLinks: links })}
                    label="Feature Inline Links"
                    description="Text within the features that will become clickable."
                  />
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-[#D4B8A8] bg-[#F8F0F5] p-[14px] sm:p-[16px]">
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <ImagePlus className="h-[13px] w-[13px]" /> Image One
                    </Label>
                    {aboutForm.imageOne && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[12px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(aboutForm.imageOne)}
                          alt="Image one preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Input
                      value={aboutForm.imageOneAlt}
                      onChange={(e) => setAboutForm({ ...aboutForm, imageOneAlt: e.target.value })}
                      placeholder="Image one alt text"
                      className="mb-[10px] h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                    />
                    <input
                      ref={aboutImageOneInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageOneUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => aboutImageOneInputRef.current?.click()}
                      disabled={uploadingAboutImage}
                      className="h-[44px] w-full gap-[8px] rounded-[12px] border-[#D4B8A8] bg-white text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingAboutImage ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {aboutForm.imageOne ? "Replace" : "Upload"}
                    </Button>
                  </div>

                  <div className="rounded-[14px] border border-[#D4B8A8] bg-[#F8F0F5] p-[14px] sm:p-[16px]">
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <ImagePlus className="h-[13px] w-[13px]" /> Image Two
                    </Label>
                    {aboutForm.imageTwo && (
                      <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[12px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(aboutForm.imageTwo)}
                          alt="Image two preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Input
                      value={aboutForm.imageTwoAlt}
                      onChange={(e) => setAboutForm({ ...aboutForm, imageTwoAlt: e.target.value })}
                      placeholder="Image two alt text"
                      className="mb-[10px] h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                    />
                    <input
                      ref={aboutImageTwoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageTwoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => aboutImageTwoInputRef.current?.click()}
                      disabled={uploadingAboutImageTwo}
                      className="h-[44px] w-full gap-[8px] rounded-[12px] border-[#D4B8A8] bg-white text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingAboutImageTwo ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {aboutForm.imageTwo ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>

                {/* STATS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Stats
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
                          placeholder="Value (e.g., 2020)"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={statDraft.label}
                          onChange={(e) => setStatDraft((prev) => ({ ...prev, label: e.target.value }))}
                          placeholder="Label (e.g., Established)"
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
                    {aboutForm.stats.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No stats yet. Add your first stat above.
                      </p>
                    )}

                    {aboutForm.stats.map((stat, index) => (
                      <div
                        key={stat._id || `${stat.value}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[16px] font-semibold text-[#67003E]">
                            {stat.value}
                          </p>
                          <p className="text-[13px] text-[#666666]">
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
                    checked={aboutForm.isActive}
                    onCheckedChange={(checked) => setAboutForm({ ...aboutForm, isActive: checked })}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-[10px] pt-[4px] xs:flex-row xs:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeAboutModal}
                    disabled={aboutSubmitting}
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white px-[18px] text-[14px] text-[#666666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAboutSubmit}
                    disabled={aboutSubmitting || uploadingAboutImage || uploadingAboutImageTwo}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {aboutSubmitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : aboutData && aboutData._id ? (
                      "Update About"
                    ) : (
                      "Create About"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TESTING HERO CREATE/EDIT MODAL */}
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
                  {editingId ? "Edit Testing Hero" : "Create Testing Hero"}
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
                {/* HERO TITLES */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Hero Title
                  </Label>
                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3">
                    <Input
                      value={form.heroTitleOne}
                      onChange={(e) => setForm({ ...form, heroTitleOne: e.target.value })}
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

                {/* DESCRIPTION + INLINE LINKS */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <AlignLeft className="h-[13px] w-[13px]" /> Hero Description
                  </Label>
                  <Textarea
                    value={form.heroDescription}
                    onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                    placeholder="Independent Soil, Construction Material And Building Testing Services..."
                    rows={2}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                  <InlineLinkManager
                    links={form.heroInlineLinks}
                    onChange={(links) => setForm({ ...form, heroInlineLinks: links })}
                    label="Hero Inline Links"
                    description="Text within the hero description that will become clickable."
                  />
                </div>

                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Hero Description (Extended)
                  </Label>
                  <Textarea
                    value={form.heroDescriptionTwo}
                    onChange={(e) => setForm({ ...form, heroDescriptionTwo: e.target.value })}
                    rows={3}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
                  />
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                  <FormField
                    label="Request Test — Text"
                    value={form.requestTestButtonText}
                    onChange={(value) => setForm({ ...form, requestTestButtonText: value })}
                  />
                  <FormField
                    label="Request Test — Link"
                    value={form.requestTestButtonLink}
                    onChange={(value) => setForm({ ...form, requestTestButtonLink: value })}
                  />
                  <FormField
                    label="Explore Services — Text"
                    value={form.exploreServicesButtonText}
                    onChange={(value) => setForm({ ...form, exploreServicesButtonText: value })}
                  />
                  <FormField
                    label="Explore Services — Link"
                    value={form.exploreServicesButtonLink}
                    onChange={(value) => setForm({ ...form, exploreServicesButtonLink: value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                  <FormField
                    label="Quality Section Title — Line 1"
                    value={form.qualityTitle}
                    onChange={(value) => setForm({ ...form, qualityTitle: value })}
                    placeholder="QUALITY YOU CAN "
                  />
                  <FormField
                    label="Quality Section Title — Line 2"
                    value={form.qualityTitleTwo}
                    onChange={(value) => setForm({ ...form, qualityTitleTwo: value })}
                    placeholder="VERIFY"
                  />
                </div>

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

                {/* FEATURE CARDS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Feature Cards
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddCard}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Card
                    </Button>
                  </div>

                  {showCardForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#D4B8A8] bg-[#F8F0F5] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingCardIndex !== null ? "Edit Feature Card" : "New Feature Card"}
                      </h4>

                      <div className="grid grid-cols-2 gap-[10px] xs:grid-cols-4">
                        <Input
                          value={cardDraft.number}
                          onChange={(e) => setCardDraft((prev) => ({ ...prev, number: e.target.value }))}
                          placeholder="01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={cardDraft.label}
                          onChange={(e) => setCardDraft((prev) => ({ ...prev, label: e.target.value }))}
                          placeholder="Label"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <Input
                          value={cardDraft.title}
                          onChange={(e) => setCardDraft((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Title"
                          className="col-span-2 h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                      </div>

                      <Textarea
                        value={cardDraft.description}
                        onChange={(e) => setCardDraft((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Card description"
                        rows={2}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <InlineLinkManager
                        links={cardDraft.inlineLinks || []}
                        onChange={updateCardInlineLinks}
                        label="Card Inline Links"
                        description="Text within this card's title and description that will become clickable."
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveCardDraft}
                          className="h-[40px] rounded-[10px] bg-[#67003E] text-[13px] font-medium text-white hover:bg-[#4F0030]"
                        >
                          {editingCardIndex !== null ? "Save Card" : "Add Card"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelCardForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.featureCards.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No feature cards yet. Add your first card above.
                      </p>
                    )}

                    {form.featureCards.map((card, index) => (
                      <div
                        key={card._id || `${card.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[10px] bg-[#F8F0F5] text-[15px] font-semibold text-[#67003E]">
                          {card.number || "--"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                            {card.label}
                            {(card.inlineLinks?.length ?? 0) > 0 && (
                              <span className="ml-2 text-[#67003E]">
                                • {card.inlineLinks!.length} link{card.inlineLinks!.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </p>
                          <p className="truncate text-[13px] font-semibold text-[#111111]">
                            {card.title}
                          </p>
                          <p className="line-clamp-2 text-[12px] text-[#666666]">
                            {card.description}
                          </p>
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditCard(index)}
                            className="h-[34px] rounded-[8px] border-[#D4B8A8] px-[10px] text-[12px] text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeCard(index)}
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
                    disabled={submitting || uploadingHeroImage}
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
                Delete Testing Hero Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.heroTitleOne}&quot; and its feature cards.
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