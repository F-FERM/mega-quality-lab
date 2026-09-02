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

const ENDPOINT = "/certificate-page";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface TableRow {
  _id?: string;
  label: string;
  value: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface EIACAccreditation {
  _id?: string;
  sectionNumber: string;
  sectionTitle: string;
  mainTitle: string;
  mainTitleTwo: string;
  standardTitle: string;
  description: string;
  inlineLinks: InlineLink[];
  tableHeaders: string[];
  tableRows: TableRow[];
  viewCertificateText: string;
  viewCertificateLink: string;
  footerDescription: string;
  labName: string;
  labSubtitle: string;
  labStandard: string;
  labCertificateNumber: string;
}

interface SharjahRegistration {
  _id?: string;
  sectionNumber: string;
  sectionTitle: string;
  mainTitle: string;
  mainTitleTwo: string;
  mainTitleThree: string;
  programName: string;
  labName: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
  issuedLabel: string;
  expiryLabel: string;
  description: string;
  inlineLinks: InlineLink[];
  tableHeaders: string[];
  tableRows: TableRow[];
  viewCertificateText: string;
  viewCertificateLink: string;
}

interface CertificatePageData {
  _id?: string;
  pageTitle: string;
  eiacAccreditation: EIACAccreditation;
  sharjahRegistration: SharjahRegistration;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface CertificatePagePayload {
  pageTitle: string;
  eiacAccreditation: EIACAccreditation;
  sharjahRegistration: SharjahRegistration;
  isActive: boolean;
}

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_TABLE_ROW: TableRow = {
  label: "",
  value: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_EIAC: EIACAccreditation = {
  sectionNumber: "01",
  sectionTitle: "EIAC Accreditation",
  mainTitle: "ACCREDITED FOR CONFIDENCE.",
  mainTitleTwo: "CONFIDENCE.",
  standardTitle: "ISO/IEC 17025:2017",
  description: "",
  inlineLinks: [],
  tableHeaders: ["CERTIFICATE", "INITIAL DATE", "VALID UNTIL"],
  tableRows: [],
  viewCertificateText: "VIEW FULL CERTIFICATE →",
  viewCertificateLink: "",
  footerDescription: "",
  labName: "",
  labSubtitle: "",
  labStandard: "",
  labCertificateNumber: "",
};

const EMPTY_SHARJAH: SharjahRegistration = {
  sectionNumber: "02",
  sectionTitle: "Registration",
  mainTitle: "SHARJAH LABORATORIES",
  mainTitleTwo: "REGISTRATION",
  mainTitleThree: "PROGRAM.",
  programName: "",
  labName: "",
  certificateNumber: "",
  issuedDate: "",
  expiryDate: "",
  issuedLabel: "Issued",
  expiryLabel: "Expiry",
  description: "",
  inlineLinks: [],
  tableHeaders: ["REGISTRATION CERTIFICATE", "ISSUED", "VALID UNTIL"],
  tableRows: [],
  viewCertificateText: "VIEW FULL CERTIFICATE →",
  viewCertificateLink: "",
};

const EMPTY_FORM: CertificatePagePayload = {
  pageTitle: "",
  eiacAccreditation: EMPTY_EIAC,
  sharjahRegistration: EMPTY_SHARJAH,
  isActive: true,
};

// ================= HELPERS =================

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

function isCertificatePageData(val: unknown): val is CertificatePageData {
  return !!val && typeof val === "object" && "pageTitle" in (val as object);
}

function parseCertificatePageList(data: unknown): CertificatePageData[] {
  if (Array.isArray(data)) return data as CertificatePageData[];
  if (isCertificatePageData(data)) return [data];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidateKeys = [
      "certificatePage",
      "data",
      "result",
      "results",
      "item",
      "payload",
    ];

    for (const key of candidateKeys) {
      if (!(key in obj)) continue;
      const val = obj[key];
      if (Array.isArray(val)) return val as CertificatePageData[];
      if (isCertificatePageData(val)) return [val];
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[CertificatePageAdminPage] Unrecognized API response shape for GET /certificate-page:",
      data,
    );
  }

  return [];
}

function mapEntryToForm(entry: CertificatePageData): CertificatePagePayload {
  return {
    pageTitle: entry.pageTitle || "",
    eiacAccreditation: {
      ...entry.eiacAccreditation,
      sectionNumber: entry.eiacAccreditation?.sectionNumber || "01",
      sectionTitle: entry.eiacAccreditation?.sectionTitle || "EIAC Accreditation",
      mainTitle: entry.eiacAccreditation?.mainTitle || "",
      mainTitleTwo: entry.eiacAccreditation?.mainTitleTwo || "",
      standardTitle: entry.eiacAccreditation?.standardTitle || "ISO/IEC 17025:2017",
      description: entry.eiacAccreditation?.description || "",
      inlineLinks: entry.eiacAccreditation?.inlineLinks || [],
      tableHeaders: entry.eiacAccreditation?.tableHeaders || ["CERTIFICATE", "INITIAL DATE", "VALID UNTIL"],
      tableRows: [...(entry.eiacAccreditation?.tableRows || [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((row) => ({ ...row, inlineLinks: row.inlineLinks || [] })),
      viewCertificateText: entry.eiacAccreditation?.viewCertificateText || "VIEW FULL CERTIFICATE →",
      viewCertificateLink: entry.eiacAccreditation?.viewCertificateLink || "",
      footerDescription: entry.eiacAccreditation?.footerDescription || "",
      labName: entry.eiacAccreditation?.labName || "",
      labSubtitle: entry.eiacAccreditation?.labSubtitle || "",
      labStandard: entry.eiacAccreditation?.labStandard || "",
      labCertificateNumber: entry.eiacAccreditation?.labCertificateNumber || "",
    },
    sharjahRegistration: {
      ...entry.sharjahRegistration,
      sectionNumber: entry.sharjahRegistration?.sectionNumber || "02",
      sectionTitle: entry.sharjahRegistration?.sectionTitle || "Registration",
      mainTitle: entry.sharjahRegistration?.mainTitle || "",
      mainTitleTwo: entry.sharjahRegistration?.mainTitleTwo || "",
      mainTitleThree: entry.sharjahRegistration?.mainTitleThree || "",
      programName: entry.sharjahRegistration?.programName || "",
      labName: entry.sharjahRegistration?.labName || "",
      certificateNumber: entry.sharjahRegistration?.certificateNumber || "",
      issuedDate: entry.sharjahRegistration?.issuedDate || "",
      expiryDate: entry.sharjahRegistration?.expiryDate || "",
      issuedLabel: entry.sharjahRegistration?.issuedLabel || "Issued",
      expiryLabel: entry.sharjahRegistration?.expiryLabel || "Expiry",
      description: entry.sharjahRegistration?.description || "",
      inlineLinks: entry.sharjahRegistration?.inlineLinks || [],
      tableHeaders: entry.sharjahRegistration?.tableHeaders || ["REGISTRATION CERTIFICATE", "ISSUED", "VALID UNTIL"],
      tableRows: [...(entry.sharjahRegistration?.tableRows || [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((row) => ({ ...row, inlineLinks: row.inlineLinks || [] })),
      viewCertificateText: entry.sharjahRegistration?.viewCertificateText || "VIEW FULL CERTIFICATE →",
      viewCertificateLink: entry.sharjahRegistration?.viewCertificateLink || "",
    },
    isActive: entry.isActive ?? true,
  };
}

function serializeTableRow(row: TableRow): Omit<TableRow, "_id"> {
  const { _id, ...rest } = row;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeEIAC(eiac: EIACAccreditation): Omit<EIACAccreditation, "_id"> {
  const { _id, ...rest } = eiac;
  return {
    ...rest,
    tableRows: rest.tableRows.map(serializeTableRow),
  };
}

function serializeSharjah(sharjah: SharjahRegistration): Omit<SharjahRegistration, "_id"> {
  const { _id, ...rest } = sharjah;
  return {
    ...rest,
    tableRows: rest.tableRows.map(serializeTableRow),
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

// ================= TABLE ROW MANAGER =================

function TableRowManager({
  rows,
  onChange,
  label = "Table Rows",
  description = "Rows for the certificate table.",
}: {
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
  label?: string;
  description?: string;
}) {
  const [rowLabel, setRowLabel] = useState("");
  const [rowValue, setRowValue] = useState("");

  const addRow = () => {
    const label = rowLabel.trim();
    const value = rowValue.trim();

    if (!label || !value) {
      toast.error("Label and value are required");
      return;
    }

    const isDuplicate = rows.some(
      (row) => row.label.toLowerCase() === label.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`"${label}" already exists`);
      return;
    }

    onChange([
      ...rows,
      { label, value, order: rows.length, inlineLinks: [] },
    ]);
    setRowLabel("");
    setRowValue("");
    toast.success("Row added");
  };

  const removeRow = (index: number) => {
    const updated = rows
      .filter((_, i) => i !== index)
      .map((row, idx) => ({ ...row, order: idx }));
    onChange(updated);
    toast.success("Row removed");
  };

  return (
    <div className="mt-3 border-t border-[#D4B8A8] pt-3">
      <Label className="mb-2 block text-xs font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <p className="mb-2 text-[10px] text-[#888888]">{description}</p>

      {rows.length > 0 && (
        <div className="mb-2 max-h-[120px] space-y-1 overflow-y-auto">
          {rows.map((row, idx) => (
            <div
              key={`${row.label}-${idx}`}
              className="flex items-center justify-between rounded-[8px] border border-[#E4E4E4] bg-white px-3 py-2 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[#67003E]">{row.label}</span>
                <span className="text-[#999]">→</span>
                <span className="text-[#666]">{row.value}</span>
                {(row.inlineLinks?.length ?? 0) > 0 && (
                  <span className="text-[9px] text-[#67003E]">
                    • {row.inlineLinks!.length} link{row.inlineLinks!.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="text-[#DC2626] hover:text-[#b91c1c]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-3">
        <Input
          value={rowLabel}
          onChange={(e) => setRowLabel(e.target.value)}
          placeholder="Label"
          className="h-9 rounded-[8px] text-xs"
        />
        <Input
          value={rowValue}
          onChange={(e) => setRowValue(e.target.value)}
          placeholder="Value"
          className="h-9 rounded-[8px] text-xs"
        />
        <Button
          type="button"
          onClick={addRow}
          className="h-9 rounded-[8px] bg-[#67003E] px-3 text-xs text-white hover:bg-[#4F0030]"
        >
          <Plus className="h-3 w-3" /> Add Row
        </Button>
      </div>
    </div>
  );
}

// ================= MAIN PAGE =================

export default function CertificatePageAdminPage() {
  const [entry, setEntry] = useState<CertificatePageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertificatePagePayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);

  // ---------- LOAD ----------

  const fetchCertificatePage = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT);
      const entries = parseCertificatePageList(res.data);
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Certificate Page section"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificatePage();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!entry) {
      toast.error("No Certificate Page loaded yet. Try refreshing the page.");
      return;
    }
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.pageTitle.trim()) {
      toast.error("Page title is required");
      return;
    }

    const payload = {
      pageTitle: form.pageTitle,
      eiacAccreditation: serializeEIAC(form.eiacAccreditation),
      sharjahRegistration: serializeSharjah(form.sharjahRegistration),
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Certificate Page updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Certificate Page created");
      }

      closeModal();
      fetchCertificatePage();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Certificate Page"
            : "Failed to create Certificate Page",
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
      toast.success("Certificate Page deleted");
      setConfirmDeleteSection(false);
      setEntry(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Certificate Page"));
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
            Certificate Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the Certificate Page content including EIAC Accreditation and Sharjah Registration.
          </p>
        </div>

        {!entry && !loading && (
          <Button
            onClick={openCreateModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Certificate Page
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
                No Certificate Page content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage certificate page content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]">
            <CardContent className="p-[16px] sm:p-[20px]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#111111]">
                    {entry.pageTitle || "Certificate Page"}
                  </h3>
                  <p className="mt-[4px] text-[14px] text-[#666666]">
                    EIAC: {entry.eiacAccreditation?.labCertificateNumber || "N/A"}
                  </p>
                  <p className="mt-[4px] text-[14px] text-[#666666]">
                    Sharjah: {entry.sharjahRegistration?.certificateNumber || "N/A"}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>EIAC: {entry.eiacAccreditation?.tableRows?.length || 0} rows</span>
                    <span>•</span>
                    <span>Sharjah: {entry.sharjahRegistration?.tableRows?.length || 0} rows</span>
                  </div>
                </div>
                <button
                  onClick={toggleActive}
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
                  {editingId ? "Edit Certificate Page" : "Create Certificate Page"}
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
                  placeholder="Certificates & Accreditations"
                />

                {/* EIAC ACCREDITATION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    EIAC Accreditation
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Section Number"
                      value={form.eiacAccreditation.sectionNumber}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, sectionNumber: value }
                      })}
                      placeholder="01"
                    />
                    <FormField
                      label="Section Title"
                      value={form.eiacAccreditation.sectionTitle}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, sectionTitle: value }
                      })}
                      placeholder="EIAC Accreditation"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="Main Title Line 1"
                      value={form.eiacAccreditation.mainTitle}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, mainTitle: value }
                      })}
                      placeholder="ACCREDITED FOR CONFIDENCE."
                    />
                    <FormField
                      label="Main Title Line 2"
                      value={form.eiacAccreditation.mainTitleTwo}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, mainTitleTwo: value }
                      })}
                      placeholder="CONFIDENCE."
                    />
                  </div>

                  <FormField
                    label="Standard Title"
                    value={form.eiacAccreditation.standardTitle}
                    onChange={(value) => setForm({
                      ...form,
                      eiacAccreditation: { ...form.eiacAccreditation, standardTitle: value }
                    })}
                    placeholder="ISO/IEC 17025:2017"
                    className="mt-3"
                  />

                  <FormField
                    label="Description"
                    value={form.eiacAccreditation.description}
                    onChange={(value) => setForm({
                      ...form,
                      eiacAccreditation: { ...form.eiacAccreditation, description: value }
                    })}
                    placeholder="Description text..."
                    textarea
                    rows={3}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.eiacAccreditation.inlineLinks}
                    onChange={(links) => setForm({
                      ...form,
                      eiacAccreditation: { ...form.eiacAccreditation, inlineLinks: links }
                    })}
                    label="EIAC Inline Links"
                    description="Text within the description that will become clickable."
                  />

                  {/* Table Headers */}
                  <div className="mt-3">
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Table Headers (comma separated)
                    </Label>
                    <Input
                      value={form.eiacAccreditation.tableHeaders.join(", ")}
                      onChange={(e) => setForm({
                        ...form,
                        eiacAccreditation: {
                          ...form.eiacAccreditation,
                          tableHeaders: e.target.value.split(",").map((s) => s.trim())
                        }
                      })}
                      placeholder="CERTIFICATE, INITIAL DATE, VALID UNTIL"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                  </div>

                  <TableRowManager
                    rows={form.eiacAccreditation.tableRows}
                    onChange={(rows) => setForm({
                      ...form,
                      eiacAccreditation: { ...form.eiacAccreditation, tableRows: rows }
                    })}
                    label="EIAC Table Rows"
                    description="Rows for the EIAC certificate table."
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="View Certificate Text"
                      value={form.eiacAccreditation.viewCertificateText}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, viewCertificateText: value }
                      })}
                      placeholder="VIEW FULL CERTIFICATE →"
                    />
                    <FormField
                      label="View Certificate Link"
                      value={form.eiacAccreditation.viewCertificateLink}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, viewCertificateLink: value }
                      })}
                      placeholder="/certificates/lb-test-271"
                    />
                  </div>

                  <FormField
                    label="Footer Description"
                    value={form.eiacAccreditation.footerDescription}
                    onChange={(value) => setForm({
                      ...form,
                      eiacAccreditation: { ...form.eiacAccreditation, footerDescription: value }
                    })}
                    placeholder="Footer description..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="Lab Name"
                      value={form.eiacAccreditation.labName}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, labName: value }
                      })}
                      placeholder="MEGA QUALITY LABORATORY"
                    />
                    <FormField
                      label="Lab Subtitle"
                      value={form.eiacAccreditation.labSubtitle}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, labSubtitle: value }
                      })}
                      placeholder="SOIL AND BUILDING MATERIALS TESTING"
                    />
                    <FormField
                      label="Lab Standard"
                      value={form.eiacAccreditation.labStandard}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, labStandard: value }
                      })}
                      placeholder="ISO/IEC 17025:2017"
                    />
                    <FormField
                      label="Lab Certificate Number"
                      value={form.eiacAccreditation.labCertificateNumber}
                      onChange={(value) => setForm({
                        ...form,
                        eiacAccreditation: { ...form.eiacAccreditation, labCertificateNumber: value }
                      })}
                      placeholder="LB-TEST-271"
                    />
                  </div>
                </div>

                {/* SHARJAH REGISTRATION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Sharjah Registration
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Section Number"
                      value={form.sharjahRegistration.sectionNumber}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, sectionNumber: value }
                      })}
                      placeholder="02"
                    />
                    <FormField
                      label="Section Title"
                      value={form.sharjahRegistration.sectionTitle}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, sectionTitle: value }
                      })}
                      placeholder="Registration"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-3 mt-3">
                    <FormField
                      label="Main Title Line 1"
                      value={form.sharjahRegistration.mainTitle}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, mainTitle: value }
                      })}
                      placeholder="SHARJAH LABORATORIES"
                    />
                    <FormField
                      label="Main Title Line 2"
                      value={form.sharjahRegistration.mainTitleTwo}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, mainTitleTwo: value }
                      })}
                      placeholder="REGISTRATION"
                    />
                    <FormField
                      label="Main Title Line 3"
                      value={form.sharjahRegistration.mainTitleThree}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, mainTitleThree: value }
                      })}
                      placeholder="PROGRAM."
                    />
                  </div>

                  <FormField
                    label="Program Name"
                    value={form.sharjahRegistration.programName}
                    onChange={(value) => setForm({
                      ...form,
                      sharjahRegistration: { ...form.sharjahRegistration, programName: value }
                    })}
                    placeholder="SHARJAH LABORATORIES REGISTRATION PROGRAM"
                    className="mt-3"
                  />

                  <FormField
                    label="Lab Name"
                    value={form.sharjahRegistration.labName}
                    onChange={(value) => setForm({
                      ...form,
                      sharjahRegistration: { ...form.sharjahRegistration, labName: value }
                    })}
                    placeholder="MEGA QUALITY LABORATORY FOR SOIL AND BUILDING MATERIALS TESTING"
                    className="mt-3"
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="Certificate Number"
                      value={form.sharjahRegistration.certificateNumber}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, certificateNumber: value }
                      })}
                      placeholder="NO. 14/2025"
                    />
                    <FormField
                      label="Issued Label"
                      value={form.sharjahRegistration.issuedLabel}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, issuedLabel: value }
                      })}
                      placeholder="Issued"
                    />
                    <FormField
                      label="Issued Date"
                      value={form.sharjahRegistration.issuedDate}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, issuedDate: value }
                      })}
                      placeholder="23/12/2025"
                    />
                    <FormField
                      label="Expiry Label"
                      value={form.sharjahRegistration.expiryLabel}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, expiryLabel: value }
                      })}
                      placeholder="Expiry"
                    />
                    <FormField
                      label="Expiry Date"
                      value={form.sharjahRegistration.expiryDate}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, expiryDate: value }
                      })}
                      placeholder="22/12/2026"
                    />
                  </div>

                  <FormField
                    label="Description"
                    value={form.sharjahRegistration.description}
                    onChange={(value) => setForm({
                      ...form,
                      sharjahRegistration: { ...form.sharjahRegistration, description: value }
                    })}
                    placeholder="Description text..."
                    textarea
                    rows={2}
                    className="mt-3"
                  />

                  <InlineLinkManager
                    links={form.sharjahRegistration.inlineLinks}
                    onChange={(links) => setForm({
                      ...form,
                      sharjahRegistration: { ...form.sharjahRegistration, inlineLinks: links }
                    })}
                    label="Sharjah Inline Links"
                    description="Text within the description that will become clickable."
                  />

                  {/* Table Headers */}
                  <div className="mt-3">
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Table Headers (comma separated)
                    </Label>
                    <Input
                      value={form.sharjahRegistration.tableHeaders.join(", ")}
                      onChange={(e) => setForm({
                        ...form,
                        sharjahRegistration: {
                          ...form.sharjahRegistration,
                          tableHeaders: e.target.value.split(",").map((s) => s.trim())
                        }
                      })}
                      placeholder="REGISTRATION CERTIFICATE, ISSUED, VALID UNTIL"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
                    />
                  </div>

                  <TableRowManager
                    rows={form.sharjahRegistration.tableRows}
                    onChange={(rows) => setForm({
                      ...form,
                      sharjahRegistration: { ...form.sharjahRegistration, tableRows: rows }
                    })}
                    label="Sharjah Table Rows"
                    description="Rows for the Sharjah certificate table."
                  />

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2 mt-3">
                    <FormField
                      label="View Certificate Text"
                      value={form.sharjahRegistration.viewCertificateText}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, viewCertificateText: value }
                      })}
                      placeholder="VIEW FULL CERTIFICATE →"
                    />
                    <FormField
                      label="View Certificate Link"
                      value={form.sharjahRegistration.viewCertificateLink}
                      onChange={(value) => setForm({
                        ...form,
                        sharjahRegistration: { ...form.sharjahRegistration, viewCertificateLink: value }
                      })}
                      placeholder="/certificates/sharjah-14-2025"
                    />
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
                Delete Certificate Page?
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