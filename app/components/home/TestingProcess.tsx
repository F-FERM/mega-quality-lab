"use client";

const STEPS = [
  { number: "01", title: "Site Investigation" },
  { number: "02", title: "Sample Collection" },
  { number: "03", title: "Laboratory Testing" },
  { number: "04", title: "Quality Review" },
  { number: "05", title: "Technical Report" },
];

// Layout constants (px) — derived from the reference design
const CARD_W = 470;
const CARD_H = 274;
const GAP_UP = 44; // connector length: top card -> spine
const GAP_DOWN = 36; // connector length: spine -> bottom card
const SPINE_H = 11;
const CONTAINER_W = 1464;
const TOP_ROW_Y = 0;
const SPINE_Y = CARD_H + GAP_UP;
const BOTTOM_ROW_Y = SPINE_Y + SPINE_H + GAP_DOWN;
const CONTAINER_H = BOTTOM_ROW_Y + CARD_H;

function TestingProcess() {
  return (
    <section className="w-full bg-[#FCE4F2] px-4 py-16 sm:px-6 sm:py-20 md:py-24 xl:py-28">
      <div className="mx-auto w-full max-w-[1464px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
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
            Testing Process
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mb-14
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
          style={{
            letterSpacing: "0px",
            width: "863px",
            maxWidth: "100%",
            height: "134px",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
          From Field Investigation To Final Report
        </h2>

        {/* ===== Desktop / tablet timeline ===== */}
        <div className="hidden overflow-x-auto md:block">
          <div
            className="relative mx-auto"
            style={{ width: CONTAINER_W, height: CONTAINER_H }}
          >
            {/* Spine */}
            <div
              className="absolute rounded-full bg-[#67003E]"
              style={{
                left: 0,
                top: SPINE_Y,
                width: CONTAINER_W,
                height: SPINE_H,
              }}
            />

            {STEPS.map((step, i) => {
              const frac = (i + 1) / 6;
              const centerX = frac * CONTAINER_W;
              const left = centerX - CARD_W / 2;
              const isTop = i % 2 === 0;

              const connectorTop = isTop ? CARD_H : SPINE_Y;
              const connectorHeight = isTop
                ? GAP_UP + SPINE_H
                : GAP_DOWN + SPINE_H;

              return (
                <div key={step.number}>
                  {/* Connector tick */}
                  <div
                    className="absolute bg-[#67003E]"
                    style={{
                      left: centerX - 1,
                      top: connectorTop,
                      width: 11,
                      height: connectorHeight,
                    }}
                  />

                  {/* Card */}
                  <div
                    className="absolute flex flex-col justify-between bg-[#67003E]"
                    style={{
                      left,
                      top: isTop ? TOP_ROW_Y : BOTTOM_ROW_Y,
                      width: CARD_W,
                      height: CARD_H,
                      paddingTop: "59px",
                      paddingRight: "56px",
                      paddingBottom: "59px",
                      paddingLeft: "56px",
                      gap: "10px",
                      borderRadius: "30px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="h-px w-10 bg-[#FC0198]" />
                      <span
                        className="font-poppins font-medium capitalize"
                        style={{
                          fontSize: "58px",
                          lineHeight: "100%",
                          letterSpacing: "0px",
                          color: "#FC0198",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h3
                      className="font-poppins font-semibold uppercase text-white"
                      style={{
                        fontSize: "28px",
                        lineHeight: "120%",
                        letterSpacing: "0px",
                      }}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Mobile stacked fallback ===== */}
        <div className="flex flex-col gap-6 md:hidden">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-[30px] bg-[#67003E] p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="h-px w-10 bg-[#FC0198]" />
                <span
                  className="font-poppins font-medium capitalize"
                  style={{
                    fontSize: "48px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#FC0198",
                  }}
                >
                  {step.number}
                </span>
              </div>

              <h3
                className="font-poppins font-semibold uppercase text-white"
                style={{
                  fontSize: "24px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                }}
              >
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestingProcess;
