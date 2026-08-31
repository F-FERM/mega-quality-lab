"use client";

const CARDS = [
  {
    tag: "PILLAR 01",
    title: "Accuracy",
    description:
      "Testing Performed According To Applicable Standards And Documented Methods.",
  },
  {
    tag: "PILLAR 02",
    title: "Impartiality",
    description:
      "Independent And Objective Testing Practices, Free From Undue Influence.",
  },
  {
    tag: "PILLAR 03",
    title: "Continuous Improvement",
    description:
      "Ongoing Review Of Processes, Technical Competence And Customer Requirements.",
  },
];

function QualitySystem() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#67003E]" />
          <span
            className="font-poppins font-normal capitalize"
            style={{
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#67003E",
            }}
          >
            Material Testing
          </span>
          <span className="h-px w-12 bg-[#67003E]" />
        </div>

        {/* Heading */}
        <h2
          className="
            mx-auto
            mb-6
            max-w-[1200px]
            text-center
            font-poppins
            font-bold
            uppercase
            leading-[112%]
            text-black
            text-[32px]
            sm:text-[40px]
            md:text-[48px]
            xl:text-[60px]
          "
          style={{ letterSpacing: "0px" }}
        >
          Quality Is Not A Claim. It&apos;s A{" "}
          <span className="text-[#FFA8D9]">System.</span>
        </h2>

        {/* Sub copy */}
        <p
          className="
            mx-auto
            mb-16
            max-w-[820px]
            text-center
            font-poppins
            font-medium
            capitalize
            text-lg
            sm:text-xl
            xl:text-[22px]
          "
          style={{
            lineHeight: "120%",
            letterSpacing: "0px",
            color: "#727272",
          }}
        >
          Documented Laboratory Equipment Used In Testing Operations.
          Specifications Shown Are Limited To What Has Been Verified By The
          Laboratory.
        </p>

        {/* Cards */}
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 md:grid-cols-3 xl:gap-y-12">
          {CARDS.map((card) => (
            <div
              key={card.tag}
              className="flex flex-col justify-center rounded-[40px] border border-[#D9D9D9] bg-white
                         p-6 sm:p-8 xl:p-10
                         transition-all duration-300 ease-out cursor-pointer
                         hover:-translate-y-6 hover:border hover:border-[#D9D9D9] hover:shadow-2xl hover:shadow-black/15"
            >
              <span
                className="mb-6 font-poppins font-normal capitalize sm:mb-7 xl:mb-8"
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
                className="mb-2 font-poppins font-semibold capitalize text-black sm:mb-3"
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
                  lineHeight: "120%",
                  letterSpacing: "0px",
                  color: "#686868",
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QualitySystem;
