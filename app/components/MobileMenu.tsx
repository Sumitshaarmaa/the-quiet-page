"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">

      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d5d1c7] text-[#77736a] transition-all hover:border-[#272622] hover:text-[#272622]"
      >
        <span className="relative flex h-3.5 w-4 flex-col justify-between">

          <span
            className={`block h-px w-4 bg-current transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />

          <span
            className={`block h-px w-4 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            className={`block h-px w-4 bg-current transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />

        </span>
      </button>


      {/* MOBILE MENU */}

      {open && (
        <div className="absolute left-0 right-0 top-20 border-b border-[#dedbd2] bg-[#f5f3ed] shadow-sm">

          <nav className="mx-auto max-w-7xl px-6 py-6 lg:px-10">

            <div className="flex flex-col">

              <a
                href="#featured"
                onClick={closeMenu}
                className="border-b border-[#dedbd2] py-5 font-serif text-2xl transition-opacity hover:opacity-60"
              >
                Writings
              </a>

              <a
                href="#genres"
                onClick={closeMenu}
                className="border-b border-[#dedbd2] py-5 font-serif text-2xl transition-opacity hover:opacity-60"
              >
                Notebook
              </a>

              <a
                href="#about"
                onClick={closeMenu}
                className="border-b border-[#dedbd2] py-5 font-serif text-2xl transition-opacity hover:opacity-60"
              >
                About
              </a>

              <Link
                href="/search"
                onClick={closeMenu}
                className="py-5 font-serif text-2xl transition-opacity hover:opacity-60"
              >
                Search →
              </Link>

            </div>

          </nav>

        </div>
      )}

    </div>
  );
}