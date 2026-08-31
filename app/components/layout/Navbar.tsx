"use client"
import { useState } from "react";
import Image from "next/image";
import LOGO from "../../../public/images/Logo.png"
import { Button } from "../common/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Certification", href: "/certification" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-[#00000033]">
      <div
        className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-2.5
                   min-h-[70px] py-3 px-4
                   sm:min-h-[80px] sm:py-4 sm:px-6
                   md:min-h-[90px] md:px-8
                   lg:min-h-[100px] lg:px-12
                   xl:min-h-[110px] xl:py-5 xl:px-16
                   2xl:min-h-[115px] 2xl:px-20"
      >
        {/* Logo section */}
        <a href="#home" className="flex shrink-0 items-center gap-1">
          <Image
            src={LOGO}
            alt="Mega Quality Lab"
            width={315}
            height={60}
            priority
            className="h-9 w-auto sm:h-10 md:h-12 xl:h-14 2xl:h-[60px]"
            style={{ objectFit: "contain" }}
          />
        </a>

        {/* Nav links: only from xl, once there's real room for all 6 + logo + button */}
        <ul className="hidden shrink-0 items-center gap-5 xl:flex 2xl:gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className="whitespace-nowrap font-poppins transition-colors duration-200 text-sm 2xl:text-base"
                style={{
                  fontWeight: 500,
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: activeLink === link.label ? "#FC0198" : "#EBEBEB",
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA button: same breakpoint as the links so they always appear together */}
        <Button
          type="button"
          variant="navbarCta"
          className="hidden xl:inline-flex"
        >
          Request a Test
        </Button>

        {/* Mobile menu toggle: covers everything below xl, so nothing gets squeezed */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 xl:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform duration-200 ${
              mobileOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform duration-200 ${
              mobileOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile / tablet dropdown: covers everything below xl, including 768-1279 */}
      {mobileOpen && (
        <div
          className="flex flex-col gap-5 px-4 pb-6 pt-2 sm:gap-6 sm:px-6 sm:pb-8 md:px-10 xl:hidden"
          style={{ background: "rgba(0, 0, 0, 0.85)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setActiveLink(link.label);
                setMobileOpen(false);
              }}
              className="font-poppins text-base"
              style={{
                fontWeight: 500,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: activeLink === link.label ? "#EBEBEB" : "#FC0198",
              }}
            >
              {link.label}
            </a>
          ))}
          <Button
            type="button"
            variant="navbarCta"
            className="w-full justify-center"
          >
            Request a Test
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar