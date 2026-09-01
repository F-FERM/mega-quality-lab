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

const ENDPOINT = "/footer";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface NavLink {
  _id?: string;
  label: string;
  url: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface ServiceLink {
  _id?: string;
  label: string;
  url: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface Address {
  _id?: string;
  location: string;
  address: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface FooterData {
  _id?: string;
  brandName: string;
  brandLogo: string;
  brandLogoAlt: string;
  navigationTitle: string;
  navLinks: NavLink[];
  servicesTitle: string;
  serviceLinks: ServiceLink[];
  addressTitle: string;
  addresses: Address[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: InlineLink[];
  socialTitle: string;
  socialLinks: SocialLink[];
  copyrightText: string;
  accreditationText: string;
  copyrightInlineLinks: InlineLink[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface FooterPayload {
  brandName: string;
  brandLogo: string;
  brandLogoAlt: string;
  navigationTitle: string;
  navLinks: NavLink[];
  servicesTitle: string;
  serviceLinks: ServiceLink[];
  addressTitle: string;
  addresses: Address[];
  phoneLabel: string;
  phoneNumber: string;
  phoneInlineLinks: InlineLink[];
  socialTitle: string;
  socialLinks: SocialLink[];
  copyrightText: string;
  accreditationText: string;
  copyrightInlineLinks: InlineLink[];
  isActive: boolean;
}

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
] as const;

const EMPTY_NAV_LINK: NavLink = {
  label: "",
  url: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_SERVICE_LINK: ServiceLink = {
  label: "",
  url: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_ADDRESS: Address = {
  location: "",
  address: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_SOCIAL_LINK: SocialLink = {
  platform: "",
  url: "",
  icon: "",
  order: 0,
  inlineLinks: [],
};

const EMPTY_FORM: FooterPayload = {
  brandName: "",
  brandLogo: "",
  brandLogoAlt: "",
  navigationTitle: "",
  navLinks: [],
  servicesTitle: "",
  serviceLinks: [],
  addressTitle: "",
  addresses: [],
  phoneLabel: "",
  phoneNumber: "",
  phoneInlineLinks: [],
  socialTitle: "",
  socialLinks: [],
  copyrightText: "",
  accreditationText: "",
  copyrightInlineLinks: [],
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

function isFooterData(val: unknown): val is FooterData {
  return !!val && typeof val === "object" && "brandName" in (val as object);
}

function parseFooterList(data: unknown): FooterData[] {
  if (Array.isArray(data)) return data as FooterData[];
  if (isFooterData(data)) return [data];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidateKeys = ["footer", "data", "result", "results", "item", "payload"];

    for (const key of candidateKeys) {
      if (!(key in obj)) continue;
      const val = obj[key];
      if (Array.isArray(val)) return val as FooterData[];
      if (isFooterData(val)) return [val];
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[FooterAdminPage] Unrecognized API response shape for GET /footer:",
      data,
    );
  }

  return [];
}

function mapEntryToForm(entry: FooterData): FooterPayload {
  return {
    brandName: entry.brandName || "",
    brandLogo: entry.brandLogo || "",
    brandLogoAlt: entry.brandLogoAlt || "",
    navigationTitle: entry.navigationTitle || "",
    navLinks: [...(entry.navLinks || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((link) => ({ ...link, inlineLinks: link.inlineLinks || [] })),
    servicesTitle: entry.servicesTitle || "",
    serviceLinks: [...(entry.serviceLinks || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((link) => ({ ...link, inlineLinks: link.inlineLinks || [] })),
    addressTitle: entry.addressTitle || "",
    addresses: [...(entry.addresses || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((address) => ({ ...address, inlineLinks: address.inlineLinks || [] })),
    phoneLabel: entry.phoneLabel || "",
    phoneNumber: entry.phoneNumber || "",
    phoneInlineLinks: entry.phoneInlineLinks || [],
    socialTitle: entry.socialTitle || "",
    socialLinks: [...(entry.socialLinks || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((link) => ({ ...link, inlineLinks: link.inlineLinks || [] })),
    copyrightText: entry.copyrightText || "",
    accreditationText: entry.accreditationText || "",
    copyrightInlineLinks: entry.copyrightInlineLinks || [],
    isActive: entry.isActive ?? true,
  };
}

function serializeNavLink(link: NavLink): Omit<NavLink, "_id"> {
  const { _id, ...rest } = link;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeServiceLink(link: ServiceLink): Omit<ServiceLink, "_id"> {
  const { _id, ...rest } = link;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeAddress(address: Address): Omit<Address, "_id"> {
  const { _id, ...rest } = address;
  return { ...rest, inlineLinks: rest.inlineLinks || [] };
}

function serializeSocialLink(link: SocialLink): Omit<SocialLink, "_id"> {
  const { _id, ...rest } = link;
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

// ================= LINK MANAGER =================

function LinkManager({
  links,
  onChange,
  label = "Links",
  description = "Manage your links.",
  placeholderLabel = "Label",
  placeholderUrl = "URL",
}: {
  links: (NavLink | ServiceLink)[];
  onChange: (links: (NavLink | ServiceLink)[]) => void;
  label?: string;
  description?: string;
  placeholderLabel?: string;
  placeholderUrl?: string;
}) {
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addLink = () => {
    const label = linkLabel.trim();
    const url = linkUrl.trim();

    if (!label || !url) {
      toast.error("Label and URL are required");
      return;
    }

    const isDuplicate = links.some(
      (link) => link.label.toLowerCase() === label.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`"${label}" already exists`);
      return;
    }

    onChange([
      ...links,
      { label, url, order: links.length, inlineLinks: [] },
    ]);
    setLinkLabel("");
    setLinkUrl("");
    setEditingIndex(null);
    toast.success("Link added");
  };

  const updateLink = (index: number) => {
    const label = linkLabel.trim();
    const url = linkUrl.trim();

    if (!label || !url) {
      toast.error("Label and URL are required");
      return;
    }

    const updatedLinks = [...links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      label: label,
      url: url,
    };
    onChange(updatedLinks);
    setLinkLabel("");
    setLinkUrl("");
    setEditingIndex(null);
    toast.success("Link updated");
  };

  const removeLink = (index: number) => {
    const updated = links
      .filter((_, i) => i !== index)
      .map((link, idx) => ({ ...link, order: idx }));
    onChange(updated);
    toast.success("Link removed");
  };

  const startEdit = (index: number) => {
    const link = links[index];
    setLinkLabel(link.label);
    setLinkUrl(link.url);
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setLinkLabel("");
    setLinkUrl("");
    setEditingIndex(null);
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
              key={`${link.label}-${idx}`}
              className="flex items-center justify-between rounded-[8px] border border-[#E4E4E4] bg-white px-3 py-2 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[#67003E]">{link.label}</span>
                <span className="text-[#999]">→</span>
                <span className="max-w-[120px] truncate text-[#666]">
                  {link.url}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => startEdit(idx)}
                  className="h-6 w-6 p-0 text-[#67003E] hover:bg-[#F8F0F5]"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeLink(idx)}
                  className="h-6 w-6 p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-3">
          <Input
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            placeholder={placeholderLabel}
            className="h-9 rounded-[8px] text-xs"
          />
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={placeholderUrl}
            className="h-9 rounded-[8px] text-xs"
          />
          {editingIndex !== null ? (
            <div className="flex gap-1">
              <Button
                type="button"
                onClick={() => updateLink(editingIndex)}
                className="h-9 flex-1 rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
              >
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="h-9 rounded-[8px] border-[#E4E4E4] bg-white text-xs text-[#666666]"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={addLink}
              className="h-9 rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
            >
              <Plus className="h-3 w-3" /> Add
            </Button>
          )}
        </div>
      </div>
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

// ================= ADDRESS MANAGER =================

function AddressManager({
  addresses,
  onChange,
}: {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}) {
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addAddress = () => {
    const loc = location.trim();
    const addr = address.trim();

    if (!loc || !addr) {
      toast.error("Location and address are required");
      return;
    }

    const isDuplicate = addresses.some(
      (a) => a.location.toLowerCase() === loc.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`"${loc}" already exists`);
      return;
    }

    onChange([
      ...addresses,
      { location: loc, address: addr, order: addresses.length, inlineLinks: [] },
    ]);
    setLocation("");
    setAddress("");
    setEditingIndex(null);
    toast.success("Address added");
  };

  const updateAddress = (index: number) => {
    const loc = location.trim();
    const addr = address.trim();

    if (!loc || !addr) {
      toast.error("Location and address are required");
      return;
    }

    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      location: loc,
      address: addr,
    };
    onChange(updatedAddresses);
    setLocation("");
    setAddress("");
    setEditingIndex(null);
    toast.success("Address updated");
  };

  const removeAddress = (index: number) => {
    const updated = addresses
      .filter((_, i) => i !== index)
      .map((addr, idx) => ({ ...addr, order: idx }));
    onChange(updated);
    toast.success("Address removed");
  };

  const startEdit = (index: number) => {
    const addr = addresses[index];
    setLocation(addr.location);
    setAddress(addr.address);
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setLocation("");
    setAddress("");
    setEditingIndex(null);
  };

  const updateAddressInlineLinks = (index: number, inlineLinks: InlineLink[]) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      inlineLinks: inlineLinks,
    };
    onChange(updatedAddresses);
  };

  return (
    <div className="mt-3 border-t border-[#D4B8A8] pt-3">
      <Label className="mb-2 block text-xs font-medium text-[#2A2A2A]">
        Addresses
      </Label>
      <p className="mb-2 text-[10px] text-[#888888]">Manage footer addresses.</p>

      {addresses.length > 0 && (
        <div className="mb-2 max-h-[150px] space-y-2 overflow-y-auto">
          {addresses.map((addr, idx) => (
            <div
              key={`${addr.location}-${idx}`}
              className="flex flex-col gap-1 rounded-[8px] border border-[#E4E4E4] bg-white p-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#67003E]">{addr.location}</span>
                  <span className="text-[#999]">→</span>
                  <span className="max-w-[120px] truncate text-[#666]">
                    {addr.address}
                  </span>
                  {(addr.inlineLinks?.length ?? 0) > 0 && (
                    <span className="text-[9px] text-[#67003E]">
                      • {addr.inlineLinks!.length} link{addr.inlineLinks!.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEdit(idx)}
                    className="h-6 w-6 p-0 text-[#67003E] hover:bg-[#F8F0F5]"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeAddress(idx)}
                    className="h-6 w-6 p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <InlineLinkManager
                links={addr.inlineLinks || []}
                onChange={(newLinks) => updateAddressInlineLinks(idx, newLinks)}
                label="Address Inline Links"
                description="Text within this address that will become clickable."
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-3">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="h-9 rounded-[8px] text-xs"
          />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="h-9 rounded-[8px] text-xs"
          />
          {editingIndex !== null ? (
            <div className="flex gap-1">
              <Button
                type="button"
                onClick={() => updateAddress(editingIndex)}
                className="h-9 flex-1 rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
              >
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="h-9 rounded-[8px] border-[#E4E4E4] bg-white text-xs text-[#666666]"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={addAddress}
              className="h-9 rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
            >
              <Plus className="h-3 w-3" /> Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= SOCIAL LINK MANAGER WITH FULL CRUD =================

function SocialLinkManager({
  links,
  onChange,
}: {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIcon(true);
      const result = await fileUpload(file);
      setIconPreview(result.url);
      toast.success("Icon uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload icon"));
    } finally {
      setUploadingIcon(false);
      if (iconInputRef.current) iconInputRef.current.value = "";
    }
  };

  const addLink = () => {
    const plat = platform.trim();
    const linkUrl = url.trim();

    if (!plat || !linkUrl) {
      toast.error("Platform and URL are required");
      return;
    }

    if (!iconPreview) {
      toast.error("Please upload an icon image");
      return;
    }

    const isDuplicate = links.some(
      (link) => link.platform.toLowerCase() === plat.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`"${plat}" already exists`);
      return;
    }

    onChange([
      ...links,
      {
        platform: plat,
        url: linkUrl,
        icon: iconPreview,
        order: links.length,
        inlineLinks: [],
      },
    ]);
    setPlatform("");
    setUrl("");
    setIconPreview("");
    setEditingIndex(null);
    toast.success("Social link added");
  };

  const updateLink = (index: number) => {
    const plat = platform.trim();
    const linkUrl = url.trim();

    if (!plat || !linkUrl) {
      toast.error("Platform and URL are required");
      return;
    }

    if (!iconPreview) {
      toast.error("Please upload an icon image");
      return;
    }

    const updatedLinks = [...links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      platform: plat,
      url: linkUrl,
      icon: iconPreview,
    };
    onChange(updatedLinks);
    setPlatform("");
    setUrl("");
    setIconPreview("");
    setEditingIndex(null);
    toast.success("Social link updated");
  };

  const removeLink = (index: number) => {
    const updated = links
      .filter((_, i) => i !== index)
      .map((link, idx) => ({ ...link, order: idx }));
    onChange(updated);
    toast.success("Social link removed");
  };

  const startEdit = (index: number) => {
    const link = links[index];
    setPlatform(link.platform);
    setUrl(link.url);
    setIconPreview(link.icon || "");
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setPlatform("");
    setUrl("");
    setIconPreview("");
    setEditingIndex(null);
  };

  const updateSocialLinkInlineLinks = (index: number, inlineLinks: InlineLink[]) => {
    const updatedLinks = [...links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      inlineLinks: inlineLinks,
    };
    onChange(updatedLinks);
  };

  return (
    <div className="mt-3 border-t border-[#D4B8A8] pt-3">
      <Label className="mb-2 block text-xs font-medium text-[#2A2A2A]">
        Social Links
      </Label>
      <p className="mb-2 text-[10px] text-[#888888]">
        Manage social media links with custom icon images.
      </p>

      {links.length > 0 && (
        <div className="mb-2 max-h-[200px] space-y-2 overflow-y-auto">
          {links.map((link, idx) => (
            <div
              key={`${link.platform}-${idx}`}
              className="flex flex-col gap-2 rounded-[8px] border border-[#E4E4E4] bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {link.icon && (
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-[#E4E4E4] bg-white">
                      <Image
                        src={resolveImage(link.icon)}
                        alt={link.platform}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-[#67003E]">{link.platform}</span>
                    <span className="ml-2 text-[#999]">→</span>
                    <span className="ml-2 text-[#666]">{link.url}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEdit(idx)}
                    className="h-7 px-2 text-[10px] border-[#D4B8A8] text-[#67003E] hover:bg-[#F8F0F5]"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeLink(idx)}
                    className="h-7 px-2 text-[10px] border-[#F3D0D0] text-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Inline Links for this social link */}
              {(link.inlineLinks?.length ?? 0) > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {link.inlineLinks?.map((inlineLink, ilIdx) => (
                    <span
                      key={ilIdx}
                      className="inline-flex items-center gap-1 rounded bg-[#F8F0F5] px-2 py-0.5 text-[9px] text-[#67003E]"
                    >
                      {inlineLink.text}
                      {inlineLink.openInNewTab && (
                        <ExternalLink className="h-2.5 w-2.5" />
                      )}
                    </span>
                  ))}
                  <span className="text-[9px] text-[#999]">
                    • {link.inlineLinks?.length || 0} link{link.inlineLinks?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              
              {/* Inline Link Manager for this social link */}
              <div className="mt-1">
                <InlineLinkManager
                  links={link.inlineLinks || []}
                  onChange={(newLinks) => updateSocialLinkInlineLinks(idx, newLinks)}
                  label="Social Link Inline Links"
                  description="Text within this social link that will become clickable."
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
          <Input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Platform (e.g., Facebook)"
            className="h-9 rounded-[8px] text-xs"
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="h-9 rounded-[8px] text-xs"
          />
        </div>

        {/* Icon Upload */}
        <div className="rounded-[8px] border border-[#D4B8A8] bg-[#F8F0F5] p-2">
          <div className="flex items-center gap-3">
            {iconPreview && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-[#D4B8A8] bg-white">
                <Image
                  src={resolveImage(iconPreview)}
                  alt="Icon preview"
                  fill
                  unoptimized
                  className="object-contain p-1"
                />
              </div>
            )}
            <input
              ref={iconInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => iconInputRef.current?.click()}
              disabled={uploadingIcon}
              className="h-9 flex-1 gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[11px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
            >
              {uploadingIcon ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <UploadCloud className="h-3 w-3" />
              )}
              {iconPreview ? "Replace Icon" : "Upload Icon"}
            </Button>
            {iconPreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIconPreview("");
                }}
                className="h-9 rounded-[8px] border-[#F3D0D0] bg-white text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="mt-1 text-[8px] text-[#888888]">
            Upload a square image (PNG, JPG, SVG). Recommended size: 35x35px.
          </p>
        </div>

        <div className="flex gap-2">
          {editingIndex !== null ? (
            <>
              <Button
                type="button"
                onClick={() => updateLink(editingIndex)}
                className="h-9 flex-1 rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
              >
                Update Social Link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="h-9 rounded-[8px] border-[#E4E4E4] bg-white text-xs text-[#666666]"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={addLink}
              disabled={!iconPreview}
              className="h-9 w-full rounded-[8px] bg-[#67003E] text-xs text-white hover:bg-[#4F0030]"
            >
              <Plus className="h-3 w-3" /> Add Social Link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= MAIN PAGE =================

export default function FooterAdminPage() {
  const [entry, setEntry] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FooterPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINT);
      const entries = parseFooterList(res.data);
      if (entries.length > 0) {
        setEntry(entries[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load Footer"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!entry) {
      toast.error("No Footer loaded yet. Try refreshing the page.");
      return;
    }
    setEditingId(entry._id || null);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingLogo) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ---------- LOGO UPLOAD ----------

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, brandLogo: result.url }));
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload logo"));
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!form.brandLogo.trim()) {
      toast.error("Brand logo is required");
      return;
    }

    const payload = {
      brandName: form.brandName,
      brandLogo: form.brandLogo,
      brandLogoAlt: form.brandLogoAlt,
      navigationTitle: form.navigationTitle,
      navLinks: form.navLinks.map(serializeNavLink),
      servicesTitle: form.servicesTitle,
      serviceLinks: form.serviceLinks.map(serializeServiceLink),
      addressTitle: form.addressTitle,
      addresses: form.addresses.map(serializeAddress),
      phoneLabel: form.phoneLabel,
      phoneNumber: form.phoneNumber,
      phoneInlineLinks: form.phoneInlineLinks,
      socialTitle: form.socialTitle,
      socialLinks: form.socialLinks.map(serializeSocialLink),
      copyrightText: form.copyrightText,
      accreditationText: form.accreditationText,
      copyrightInlineLinks: form.copyrightInlineLinks,
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`${ENDPOINT}`, payload);
        toast.success("Footer updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Footer created");
      }

      closeModal();
      fetchFooter();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update Footer"
            : "Failed to create Footer",
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
      toast.success(entry.isActive ? "Footer deactivated" : "Footer activated");
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
      toast.success("Footer deleted");
      setConfirmDeleteSection(false);
      setEntry(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete Footer"));
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
            Footer
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the footer content including navigation, services, addresses, social links with icons, and copyright.
          </p>
        </div>

        {!entry && !loading && (
          <Button
            onClick={openCreateModal}
            className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Footer
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
                No Footer content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a footer to manage your site footer content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]">
            <div className="relative h-[120px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[140px]">
              {entry.brandLogo ? (
                <Image
                  src={resolveImage(entry.brandLogo)}
                  alt={entry.brandLogoAlt || entry.brandName}
                  fill
                  unoptimized
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
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
                    {entry.brandName || "Footer"}
                  </h3>
                  <div className="mt-[8px] flex flex-wrap gap-3 text-[12px] text-[#999]">
                    <span>{entry.navLinks?.length || 0} Navigation Links</span>
                    <span>•</span>
                    <span>{entry.serviceLinks?.length || 0} Service Links</span>
                    <span>•</span>
                    <span>{entry.addresses?.length || 0} Addresses</span>
                    <span>•</span>
                    <span>{entry.socialLinks?.length || 0} Social Links</span>
                  </div>
                  <p className="mt-[4px] text-[13px] text-[#666666] line-clamp-1">
                    {entry.phoneLabel}: {entry.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="mt-[14px] flex gap-2">
                <Button
                  onClick={openEditModal}
                  variant="outline"
                  className="h-[36px] flex-1 gap-[6px] rounded-[10px] border-[#D4B8A8] text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5]"
                >
                  <Pencil className="h-[13px] w-[13px]" />
                  Edit Footer
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
                  {editingId ? "Edit Footer" : "Create Footer"}
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
                {/* BRAND SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Brand
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Brand Name"
                      value={form.brandName}
                      onChange={(value) => setForm({ ...form, brandName: value })}
                      placeholder="MEGA QUALITY LAB"
                    />
                    <FormField
                      label="Brand Logo Alt Text"
                      value={form.brandLogoAlt}
                      onChange={(value) => setForm({ ...form, brandLogoAlt: value })}
                      placeholder="MEGA QUALITY LAB Logo"
                    />
                  </div>

                  {/* Brand Logo Upload */}
                  <div className="mt-3 rounded-[10px] border border-[#D4B8A8] bg-[#F8F0F5] p-[10px]">
                    {form.brandLogo && (
                      <div className="relative mb-[10px] h-[80px] w-full overflow-hidden rounded-[8px] bg-[#E8D5E0]">
                        <Image
                          src={resolveImage(form.brandLogo)}
                          alt="Logo preview"
                          fill
                          unoptimized
                          className="object-contain p-2"
                        />
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="h-[38px] w-full gap-[6px] rounded-[8px] border-[#D4B8A8] bg-white text-[12px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="h-[14px] w-[14px] animate-spin" />
                      ) : (
                        <UploadCloud className="h-[14px] w-[14px]" />
                      )}
                      {form.brandLogo ? "Replace Logo" : "Upload Logo"}
                    </Button>
                  </div>
                </div>

                {/* NAVIGATION LINKS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <FormField
                    label="Navigation Title"
                    value={form.navigationTitle}
                    onChange={(value) => setForm({ ...form, navigationTitle: value })}
                    placeholder="NAVIGATION"
                  />
                  <LinkManager
                    links={form.navLinks}
                    onChange={(links) => setForm({ ...form, navLinks: links })}
                    label="Navigation Links"
                    description="Links for the navigation section."
                    placeholderLabel="Home"
                    placeholderUrl="/"
                  />
                </div>

                {/* SERVICE LINKS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <FormField
                    label="Services Title"
                    value={form.servicesTitle}
                    onChange={(value) => setForm({ ...form, servicesTitle: value })}
                    placeholder="SERVICES"
                  />
                  <LinkManager
                    links={form.serviceLinks}
                    onChange={(links) => setForm({ ...form, serviceLinks: links })}
                    label="Service Links"
                    description="Links for the services section."
                    placeholderLabel="Material Testing"
                    placeholderUrl="/services/material-testing"
                  />
                </div>

                {/* ADDRESS SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <FormField
                    label="Address Title"
                    value={form.addressTitle}
                    onChange={(value) => setForm({ ...form, addressTitle: value })}
                    placeholder="ADDRESS"
                  />
                  <AddressManager
                    addresses={form.addresses}
                    onChange={(addresses) => setForm({ ...form, addresses: addresses })}
                  />
                </div>

                {/* PHONE SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Phone
                  </h3>

                  <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                    <FormField
                      label="Phone Label"
                      value={form.phoneLabel}
                      onChange={(value) => setForm({ ...form, phoneLabel: value })}
                      placeholder="PHONE"
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
                    onChange={(links) => setForm({ ...form, phoneInlineLinks: links })}
                    label="Phone Inline Links"
                    description="Text within the phone section that will become clickable."
                  />
                </div>

                {/* SOCIAL LINKS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <FormField
                    label="Social Title"
                    value={form.socialTitle}
                    onChange={(value) => setForm({ ...form, socialTitle: value })}
                    placeholder="FOLLOW US"
                  />
                  <SocialLinkManager
                    links={form.socialLinks}
                    onChange={(links) => setForm({ ...form, socialLinks: links })}
                  />
                </div>

                {/* COPYRIGHT SECTION */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px] mb-3">
                    Copyright
                  </h3>

                  <FormField
                    label="Copyright Text"
                    value={form.copyrightText}
                    onChange={(value) => setForm({ ...form, copyrightText: value })}
                    placeholder="© 2025 MEGA QUALITY LABORATORY FOR SOIL AND BUILDING MATERIALS TESTING"
                    textarea
                    rows={2}
                    className="mb-3"
                  />

                  <FormField
                    label="Accreditation Text"
                    value={form.accreditationText}
                    onChange={(value) => setForm({ ...form, accreditationText: value })}
                    placeholder="EIAC ACCREDITED — ISO/IEC 17025:2017 — LB-TEST-271"
                    className="mb-3"
                  />

                  <InlineLinkManager
                    links={form.copyrightInlineLinks}
                    onChange={(links) => setForm({ ...form, copyrightInlineLinks: links })}
                    label="Copyright Inline Links"
                    description="Text within the copyright section that will become clickable."
                  />
                </div>

                {/* ACTIVE SWITCH */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this footer on the website
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
                    disabled={submitting || uploadingLogo}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Footer"
                    ) : (
                      "Create Footer"
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
                Delete Footer?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This permanently deletes the footer and all its content. This cannot be undone.
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
                  {deletingSection ? "Deleting..." : "Delete Footer"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}