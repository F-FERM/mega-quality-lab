"use client"

const CARDS = [
  {
    tag: "01 / Accred",
    title: "EIAC Accredited",
    description:
      "ISO/IEC 17025:2017 — Certificate LB-TEST-271, valid 19 Feb 2025 – 18 Feb 2028.",
  },
  {
    tag: "02 / Reg",
    title: "Sharjah Municipality",
    description:
      "Registered under the Sharjah Laboratories Registration Program.",
  },
  {
    tag: "03 / Team",
    title: "Technical Expertise",
    description:
      "Experienced laboratory professionals across geotechnical and materials testing.",
  },
  {
    tag: "04 / Reach",
    title: "UAE Project Experience",
    description: "Dubai · Abu Dhabi · Sharjah · Ras Al Khaimah",
  },
];

function QualityVerify() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <h2
        className="mx-auto mb-14 max-w-4xl text-center font-poppins font-bold uppercase text-black
                   text-[28px] leading-[112%]
                   sm:text-[36px]
                   md:text-[48px]
                   xl:text-[60px]
                   sm:mb-20 xl:mb-24"
        style={{ letterSpacing: "0px" }}
      >
        Quality You Can{" "}
        <span style={{ color: "#FFA8D9" }}>Verify</span>
      </h2>

      <div className="mx-auto grid w-full max-w-[1464px] grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 xl:gap-y-12 md:grid-cols-2">
        {CARDS.map((card) => (
          <div
            key={card.tag}
            className="flex flex-col justify-center rounded-[40px] border border-[#D9D9D9] bg-white
                       p-6 sm:p-8 xl:pt-12 xl:pb-12 xl:pl-10 xl:pr-[162px]
                       transition-all duration-300 ease-out cursor-pointer
                       hover:-translate-y-6  hover:border hover:border-[#D9D9D9] hover:shadow-2xl hover:shadow-black/15"
          >
            <span
              className="font-poppins font-normal capitalize mb-6 sm:mb-7 xl:mb-8"
              style={{
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#67003E",
              }}
            >
              {card.tag}
            </span>

            <h3
              className="font-poppins font-semibold capitalize text-black mb-2 sm:mb-3"
              style={{
                fontSize: "32px",
                lineHeight: "120%",
                letterSpacing: "0px",
              }}
            >
              {card.title}
            </h3>

            <p
              className="font-poppins font-normal capitalize"
              style={{
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#686868",
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QualityVerify;
