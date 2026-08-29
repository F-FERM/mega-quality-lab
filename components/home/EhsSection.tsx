"use client";

const PILLARS = [
  {
    category: "People",
    title: "Occupational Health & Safety",
    description:
      "Protocols Supporting The Safety Of Laboratory And Field Personnel.",
  },
  {
    category: "Environment",
    title: "Responsible Practices",
    description:
      "Environmentally Responsible Handling Of Samples And Laboratory Operations.",
  },
  {
    category: "Process",
    title: "Controlled Operations",
    description:
      "Safe, Controlled Laboratory Processes From Intake Through Disposal.",
  },
];

function EhsSection() {
  return (
    <section
      className="w-full bg-[#FDE1F0]"
      style={{
        paddingTop: "93px",
        paddingBottom: "92px",
        paddingLeft: "228px",
        paddingRight: "228px",
        gap: "10px",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-col" style={{ gap: "10px" }}>
  {/* Eyebrow */}
  <div className="mb-2 flex items-center gap-3">
    <span className="h-px w-8 bg-[#67003E]" />
    <span
      className="font-poppins font-normal capitalize"
      style={{
        fontSize: "24px",
        lineHeight: "100%",
        letterSpacing: "0px",
        color: "#67003E",
      }}
    >
      EHS
    </span>
  </div>

  {/* Heading */}
  <h2
    className="mb-2 font-poppins font-bold uppercase leading-[112%] text-black"
    style={{
      width: "1012px",
      maxWidth: "100%",
      fontSize: "60px",
      letterSpacing: "0px",
    }}
  >
    Safety. Responsibility. Sustainability.
  </h2>

  {/* Sub copy */}
  <p
    className="mb-16 font-poppins font-medium capitalize"
    style={{
      width: "870px",
      maxWidth: "100%",
      fontSize: "22px",
      lineHeight: "120%",
      letterSpacing: "0px",
      color: "#727272",
    }}
  >
    Documented Laboratory Equipment Used In Testing Operations.
    Specifications Shown Are Limited To What Has Been Verified By The
    Laboratory.
  </p>

  {/* Three pillars */}
  <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
    {PILLARS.map((pillar) => (
      <div key={pillar.category} className="flex flex-col">
        <span className="mb-6 h-px w-full bg-[#989898]" />
        <span
          className="mb-2 font-poppins font-normal capitalize"
          style={{
            fontSize: "18px",
            lineHeight: "100%",
            letterSpacing: "0px",
            color: "#67003E",
          }}
        >
          {pillar.category}
        </span>
        <h3
          className="mb-3 font-poppins font-semibold capitalize text-black"
          style={{
            fontSize: "26px",
            lineHeight: "120%",
            letterSpacing: "0px",
          }}
        >
          {pillar.title}
        </h3>
       <p
  className="font-poppins font-normal capitalize"
  style={{
    fontSize: "18px",
    lineHeight: "120%",
    letterSpacing: "0px",
    color: "#656565",
  }}
>
  {pillar.description}
</p>
      </div>
    ))}
  </div>
</div>
    </section>
  );
}

export default EhsSection;