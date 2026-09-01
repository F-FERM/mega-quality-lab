"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

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
}

interface ServiceOption {
  value: string;
  label: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

type FormFields = {
  fullName: string;
  companyName: string;
  email: string;
  contactNo: string;
  serviceRequired: string;
  projectDetails: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

// ================= FALLBACK =================

const defaultData: ContactPageData = {
  pageTitle: "Contact Mega Quality Laboratory",
  heroTitle: "LET'S TALK ABOUT YOUR",
  heroTitleTwo: "PROJECT.",
  heroDescription: "From Soil Investigation To Construction Material Testing, Connect With Our Technical Team To Discuss Your Project Requirements And Laboratory Testing Needs.",
  heroImage: "",
  heroImageAlt: "Contact Mega Quality Laboratory",
  heroInlineLinks: [],
  dubaiLocation: "United Arab Emirates",
  rasAlKhaimahLocation: "United Arab Emirates",
  directLine: "+971 52 652 3220",
  directLineLabel: "DIRECT LINE",
  contactInlineLinks: [],
  getInTouchTitle: "GET IN TOUCH",
  getInTouchHeadingOne: "TELL US WHAT YOU NEED",
  getInTouchHeadingTwo: "TESTED.",
  getInTouchDescription: "Send Your Project Details And Our Team Can Help Direct Your Enquiry To The Appropriate Testing Or Investigation Service.",
  locationCards: [
    { number: "01", title: "DUBAI", address: "Plot 284-242, Warehouse 3, Al Tayy, Dubai UAE", icon: "fa-solid fa-location-dot", order: 0, inlineLinks: [] },
    { number: "02", title: "RAK", address: "Ras Al Khaimah, United Arab Emirates", icon: "fa-solid fa-location-dot", order: 1, inlineLinks: [] },
    { number: "03", title: "CALL", address: "+971 52 652 3220", icon: "fa-solid fa-phone", order: 2, inlineLinks: [] },
  ],
  isActive: true,
};

const FALLBACK_SERVICE_OPTIONS: ServiceOption[] = [
  { value: "Soil Testing", label: "Soil Testing" },
  { value: "Concrete Testing", label: "Concrete Testing" },
  { value: "Steel Testing", label: "Steel Testing" },
  { value: "Cement Testing", label: "Cement Testing" },
  { value: "Aggregate Testing", label: "Aggregate Testing" },
  { value: "Non-Destructive Testing", label: "Non-Destructive Testing" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ================= TOAST =================

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      className="fixed z-50 flex items-start gap-3"
      style={{
        top: "24px",
        right: "24px",
        maxWidth: "380px",
        borderRadius: "14px",
        padding: "16px 18px",
        background: "#FFFFFF",
        boxShadow: "0px 8px 24px 0px #00000026",
        borderLeft: `4px solid ${isSuccess ? "#1E7A34" : "#B00020"}`,
        animation: "toastSlideIn 0.25s ease-out",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: "24px",
          height: "24px",
          background: isSuccess ? "#1E7A3420" : "#B0002020",
        }}
      >
        {isSuccess ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#1E7A34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="#B00020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <p
        className="font-poppins flex-1 text-black"
        style={{ fontSize: "15px", lineHeight: "140%" }}
      >
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="shrink-0 text-[#929292] hover:text-black"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ================= SKELETON =================

function ProjectEnquirySectionSkeleton() {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10 bg-[#FFCEEBB2]">
      <div className="mx-auto flex w-full flex-col items-start gap-12 lg:flex-row lg:gap-16" style={{ maxWidth: "1464px" }}>
        <div className="flex w-full flex-col" style={{ maxWidth: "574px" }}>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-14 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-14 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-8 flex w-full flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex w-full items-baseline border-t border-[#585858] py-6">
                <div className="w-[200px] h-5 animate-pulse rounded bg-gray-200" />
                <div className="flex flex-col gap-2">
                  <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col animate-pulse" style={{ maxWidth: "870px", borderRadius: "30px", padding: "63px 35px", gap: "22px", background: "#81818152" }}>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-14 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
          <div className="h-14 w-full animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

// ================= MAIN COMPONENT =================

function ProjectEnquirySection() {
  const [data, setData] = useState<ContactPageData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>(FALLBACK_SERVICE_OPTIONS);
  const [formData, setFormData] = useState<FormFields>({
    fullName: "",
    companyName: "",
    email: "",
    contactNo: "",
    serviceRequired: "",
    projectDetails: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/contact/page");
        const raw = res.data;

        let responseData: any = null;
        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        if (responseData) {
          setData({
            _id: responseData._id,
            pageTitle: responseData.pageTitle || defaultData.pageTitle,
            heroTitle: responseData.heroTitle || defaultData.heroTitle,
            heroTitleTwo: responseData.heroTitleTwo || defaultData.heroTitleTwo,
            heroDescription: responseData.heroDescription || defaultData.heroDescription,
            heroImage: responseData.heroImage || "",
            heroImageAlt: responseData.heroImageAlt || defaultData.heroImageAlt,
            heroInlineLinks: responseData.heroInlineLinks || [],
            dubaiLocation: responseData.dubaiLocation || defaultData.dubaiLocation,
            rasAlKhaimahLocation: responseData.rasAlKhaimahLocation || defaultData.rasAlKhaimahLocation,
            directLine: responseData.directLine || defaultData.directLine,
            directLineLabel: responseData.directLineLabel || defaultData.directLineLabel,
            contactInlineLinks: responseData.contactInlineLinks || [],
            getInTouchTitle: responseData.getInTouchTitle || defaultData.getInTouchTitle,
            getInTouchHeadingOne: responseData.getInTouchHeadingOne || defaultData.getInTouchHeadingOne,
            getInTouchHeadingTwo: responseData.getInTouchHeadingTwo || defaultData.getInTouchHeadingTwo,
            getInTouchDescription: responseData.getInTouchDescription || defaultData.getInTouchDescription,
            locationCards: responseData.locationCards || defaultData.locationCards,
            isActive: responseData.isActive ?? true,
          });
        } else {
          setData(defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch Contact Page:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await api.get("/home-services");
        const raw = res.data;

        let responseData: any = null;
        if (Array.isArray(raw) && raw.length > 0) {
          responseData = raw.find((item) => item?.isActive) || raw[0];
        } else if (raw && typeof raw === "object") {
          responseData = raw;
        }

        const services = responseData?.services;
        if (Array.isArray(services) && services.length > 0) {
          const options: ServiceOption[] = services
            .slice()
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((s: any) => ({ value: s.title, label: s.title }));
          setServiceOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch Home Services:", err);
        setServiceOptions(FALLBACK_SERVICE_OPTIONS);
      }
    };

    fetchData();
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear that field's error as soon as the user edits it
    setErrors((prev) => {
      if (!prev[name as keyof FormFields]) return prev;
      const next = { ...prev };
      delete next[name as keyof FormFields];
      return next;
    });
  };

  const validate = (fields: FormFields): FormErrors => {
    const next: FormErrors = {};

    if (!fields.fullName.trim()) next.fullName = "Full name is required.";
    if (!fields.companyName.trim()) next.companyName = "Company name is required.";

    if (!fields.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(fields.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!fields.contactNo.trim()) next.contactNo = "Phone number is required.";
    if (!fields.serviceRequired.trim()) next.serviceRequired = "Please choose a service.";
    if (!fields.projectDetails.trim()) next.projectDetails = "Project details are required.";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/contact/enquiry", {
        fullName: formData.fullName,
        companyName: formData.companyName,
        email: formData.email,
        serviceRequired: formData.serviceRequired,
        phoneNumber: formData.contactNo,
        projectDetails: formData.projectDetails,
      });

      setToast({ type: "success", message: "Your enquiry has been sent successfully." });
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        contactNo: "",
        serviceRequired: "",
        projectDetails: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      setToast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ProjectEnquirySectionSkeleton />;
  }

  const { getInTouchTitle, getInTouchHeadingOne, getInTouchHeadingTwo, getInTouchDescription, locationCards } = data;

  const fieldLabelStyle = {
    fontSize: "18px",
    lineHeight: "120%",
    letterSpacing: "0px",
  };

  const getInputStyle = (hasError: boolean) => ({
    height: "60px",
    borderRadius: "10px",
    padding: "19px 24px",
    background: "#FFFFFF66",
    boxShadow: "0px 0px 4px 0px #00000040",
    fontSize: "18px",
    lineHeight: "120%",
    letterSpacing: "0px",
    border: hasError ? "1px solid #B00020" : "1px solid transparent",
  });

  const errorTextStyle = {
    fontSize: "14px",
    lineHeight: "120%",
    color: "#B00020",
  };

  // Format location display
  const formattedLocations = locationCards.map((card) => ({
    index: `${card.number} / ${card.title}`,
    title: card.title,
    address: card.address,
  }));

  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10 bg-[#FFCEEBB2]">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <div
        className="mx-auto flex w-full flex-col items-start gap-12 lg:flex-row lg:gap-16"
        style={{ maxWidth: "1464px" }}
      >
        {/* Left column */}
        <div className="flex w-full flex-col" style={{ maxWidth: "574px" }}>
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#67003E]" />
            <span
              className="font-poppins font-normal capitalize text-[#67003E]"
              style={{ fontSize: "24px", lineHeight: "100%", letterSpacing: "0px" }}
            >
              {getInTouchTitle}
            </span>
          </div>

          {/* Heading */}
         <h2
  className="font-poppins font-bold uppercase text-black w-full"
  style={{
    maxWidth: "574px",
    minHeight: "134px",
    fontSize: "60px",
    lineHeight: "112%",
    letterSpacing: "0px",
  }}
>
  {getInTouchHeadingOne}
  {""}
  <span className="text-[#FFA8D9]">{getInTouchHeadingTwo}</span>
</h2>

          {/* Description */}
          <p
            className="mt-6 font-poppins font-medium capitalize text-[#727272]"
            style={{
              width: "574px",
              maxWidth: "100%",
              fontSize: "22px",
              lineHeight: "120%",
              letterSpacing: "0px",
            }}
          >
            {getInTouchDescription}
          </p>

          {/* Locations */}
          <div className="mt-8 flex w-full flex-col">
            {formattedLocations.map((loc) => (
              <div
                key={loc.index}
                className="flex w-full items-baseline border-t border-[#585858] py-6"
              >
                <span
                  className="w-[200px] shrink-0 font-poppins font-normal capitalize text-[#67003E]"
                  style={{ fontSize: "18px", lineHeight: "100%", letterSpacing: "0px" }}
                >
                  {loc.index}
                </span>
                <div className="flex flex-col items-start" style={{ gap: "10px" }}>
                  <span
                    className="font-poppins font-semibold capitalize text-black"
                    style={{ fontSize: "26px", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {loc.title}
                  </span>
                  <span
                    className="font-poppins font-light capitalize text-black"
                    style={{ fontSize: "18px", lineHeight: "120%", letterSpacing: "0px" }}
                  >
                    {loc.address}
                  </span>
                </div>
              </div>
            ))}
            <div className="w-full border-t border-[#D9D9D9]" />
          </div>
        </div>

        {/* Right column — form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full flex-col"
          style={{
            maxWidth: "870px",
            borderRadius: "30px",
            paddingTop: "63px",
            paddingRight: "35px",
            paddingBottom: "63px",
            paddingLeft: "36px",
            gap: "22px",
            boxShadow: "0px 0px 4px 0px #00000040",
            background: "#81818152",
          }}
        >
          <h3
            className="font-poppins font-semibold uppercase text-black"
            style={{ fontSize: "32px", lineHeight: "120%", letterSpacing: "0px" }}
          >
            Project Enquiry
          </h3>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="fullName"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Full Name 
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none w-full"
                style={getInputStyle(Boolean(errors.fullName))}
              />
              {errors.fullName && (
                <span id="fullName-error" className="font-poppins" style={errorTextStyle}>
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="companyName"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Company 
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none w-full"
                style={getInputStyle(Boolean(errors.companyName))}
              />
              {errors.companyName && (
                <span id="companyName-error" className="font-poppins" style={errorTextStyle}>
                  {errors.companyName}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="email"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Email 
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none w-full"
                style={getInputStyle(Boolean(errors.email))}
              />
              {errors.email && (
                <span id="email-error" className="font-poppins" style={errorTextStyle}>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="contactNo"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Phone 
              </label>
              <input
                id="contactNo"
                name="contactNo"
                type="tel"
                placeholder="Phone No"
                value={formData.contactNo}
                onChange={handleChange}
                aria-invalid={Boolean(errors.contactNo)}
                aria-describedby={errors.contactNo ? "contactNo-error" : undefined}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none w-full"
                style={getInputStyle(Boolean(errors.contactNo))}
              />
              {errors.contactNo && (
                <span id="contactNo-error" className="font-poppins" style={errorTextStyle}>
                  {errors.contactNo}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="serviceRequired"
              className="font-poppins font-normal capitalize text-black"
              style={fieldLabelStyle}
            >
              Service Required 
            </label>
            <div className="relative">
              <select
                id="serviceRequired"
                name="serviceRequired"
                value={formData.serviceRequired}
                onChange={handleChange}
                aria-invalid={Boolean(errors.serviceRequired)}
                aria-describedby={errors.serviceRequired ? "serviceRequired-error" : undefined}
                className="font-poppins w-full appearance-none focus:outline-none"
                style={{
                  ...getInputStyle(Boolean(errors.serviceRequired)),
                  color: formData.serviceRequired ? "#000000" : "#5C5C5C",
                }}
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {serviceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="#5C5C5C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {errors.serviceRequired && (
              <span id="serviceRequired-error" className="font-poppins" style={errorTextStyle}>
                {errors.serviceRequired}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="projectDetails"
              className="font-poppins font-normal capitalize text-black"
              style={fieldLabelStyle}
            >
              Project Details 
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              placeholder="Tell us about your project, location and required testing..."
              value={formData.projectDetails}
              onChange={handleChange}
              rows={5}
              aria-invalid={Boolean(errors.projectDetails)}
              aria-describedby={errors.projectDetails ? "projectDetails-error" : undefined}
              className="font-poppins placeholder-[#5C5C5C] focus:outline-none w-full"
              style={{ ...getInputStyle(Boolean(errors.projectDetails)), height: "auto", resize: "vertical" }}
            />
            {errors.projectDetails && (
              <span id="projectDetails-error" className="font-poppins" style={errorTextStyle}>
                {errors.projectDetails}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="font-poppins mt-2 flex items-center justify-center uppercase text-white transition-opacity hover:opacity-90 w-full disabled:opacity-60"
            style={{
              maxWidth: "100%",
              height: "60px",
              borderRadius: "20px",
              paddingTop: "15px",
              paddingRight: "42px",
              paddingBottom: "16px",
              paddingLeft: "42px",
              gap: "10px",
              background: "#67003E",
              fontWeight: 500,
              fontSize: "22px",
              lineHeight: "120%",
              letterSpacing: "0px",
              textAlign: "center",
            }}
          >
            {isSubmitting ? "Sending..." : "Send Project Enquiry"}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4 9h10M9 4l5 5-5 5"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProjectEnquirySection;