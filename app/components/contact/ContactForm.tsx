"use client";

import { useState } from "react";

interface LocationItem {
  index: string;
  title: string;
  address: string;
}

interface ProjectEnquirySectionProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  locations?: LocationItem[];
  formTitle?: string;
}

const defaultLocations: LocationItem[] = [
  {
    index: "01 / DUBAI",
    title: "Dubai Laboratory",
    address: "Plot 284-242, Warehouse 3, Al Ttay, Dubai, UAE",
  },
  {
    index: "02 / RAK",
    title: "Ras Al Khaimah",
    address: "Ras Al Khaimah, United Arab Emirates",
  },
  {
    index: "03 / CALL",
    title: "+971 52 652 3220",
    address: "For Project And Testing Enquiries",
  },
];

const SERVICE_OPTIONS = [
  { value: "soil-investigation", label: "Soil Investigation" },
  { value: "construction-materials", label: "Construction Material Testing" },
  { value: "concrete-testing", label: "Concrete Testing" },
  { value: "other", label: "Other" },
];

function ProjectEnquirySection({
  eyebrow = "Get In Touch",
  headingLine1 = "Tell Us What",
  headingLine2 = "You Need Tested.",
  description = "Send your project details and our team can help direct your enquiry to the appropriate testing or investigation service.",
  locations = defaultLocations,
  formTitle = "Project Enquiry",
}: ProjectEnquirySectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up submission endpoint
    console.log(formData);
  };

  const fieldLabelStyle = {
    fontSize: "18px",
    lineHeight: "120%",
    letterSpacing: "0px",
  };

  const inputStyle = {
    height: "60px",
    borderRadius: "10px",
    padding: "19px 24px",
    background: "#FFFFFF66",
    boxShadow: "0px 0px 4px 0px #00000040",
    fontSize: "18px",
    lineHeight: "120%",
    letterSpacing: "0px",
  };

  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-10 bg-[#FFCEEBB2]
">
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
              {eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-poppins font-bold uppercase text-black"
            style={{ fontSize: "60px", lineHeight: "112%", letterSpacing: "0px" }}
          >
            {headingLine1}
            <br />
            <span className="text-[#FFA8D9]">{headingLine2}</span>
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
            {description}
          </p>

          {/* Locations */}
         {/* Locations */}
{/* Locations */}
<div className="mt-8 flex w-full flex-col">
  {locations.map((loc) => (
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
            {formTitle}
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
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none"
                style={inputStyle}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="company"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none"
                style={inputStyle}
              />
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
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none"
                style={inputStyle}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-poppins font-normal capitalize text-black"
                style={fieldLabelStyle}
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone No"
                value={formData.phone}
                onChange={handleChange}
                className="font-poppins placeholder-[#5C5C5C] focus:outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="service"
              className="font-poppins font-normal capitalize text-black"
              style={fieldLabelStyle}
            >
              Service Required
            </label>
            <div className="relative">
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="font-poppins w-full appearance-none focus:outline-none"
                style={{
                  ...inputStyle,
                  background: "#81818152",
                  color: formData.service ? "#000000" : "#5C5C5C",
                }}
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {SERVICE_OPTIONS.map((opt) => (
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
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="details"
              className="font-poppins font-normal capitalize text-black"
              style={fieldLabelStyle}
            >
              Project Details
            </label>
            <textarea
              id="details"
              name="details"
              placeholder="Tell us about your project, location and required testing..."
              value={formData.details}
              onChange={handleChange}
              rows={5}
              className="font-poppins placeholder-[#5C5C5C] focus:outline-none"
              style={{ ...inputStyle, height: "auto", resize: "vertical" }}
            />
          </div>

       <button
  type="submit"
  className="font-poppins mt-2 flex items-center justify-center uppercase text-white transition-opacity hover:opacity-90"
  style={{
    width: "755px",
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
  Send Project Enquiry
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
