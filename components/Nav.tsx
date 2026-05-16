"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Photography", href: "/photography" },
  { label: "Contact", href: "/#contact" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [mouseNearTop, setMouseNearTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 48rem)");
    setIsMobile(mq.matches);
    const mqHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", mqHandler);

    const handleMouseMove = (e: MouseEvent) => setMouseNearTop(e.clientY < 80);
    window.addEventListener("mousemove", handleMouseMove);

    const hero = document.getElementById("hero");
    if (!hero) {
      setPastHero(true);
      return () => {
        mq.removeEventListener("change", mqHandler);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observerRef.current.observe(hero);

    return () => {
      observerRef.current?.disconnect();
      mq.removeEventListener("change", mqHandler);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const visible = !pastHero || mouseNearTop;
  const navY = isMobile || visible ? 0 : -72;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-bg/90 backdrop-blur-md"
        animate={{ y: navY }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "rgba(97,193,216,0.15)" }}
        />
        <div className="mx-auto max-w-[1440px] h-full flex items-center justify-between px-10 max-md:px-6">
          <Link
            href="/admin"
            className="text-teal text-[14px] font-medium tracking-[1.12px] hover:opacity-80 transition-opacity"
          >
            KW
          </Link>

          {/* Desktop links */}
          <nav className="flex items-center gap-10 max-md:hidden">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`text-[13px] transition-colors duration-200 ${
                    isActive
                      ? "text-teal font-medium"
                      : "text-muted hover:text-warm-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="hidden max-md:flex flex-col items-center justify-center gap-[0.375rem] w-6 h-6 cursor-pointer"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-px bg-warm-white" />
            <span className="block w-5 h-px bg-warm-white" />
            <span className="block w-5 h-px bg-warm-white" />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-[72px] flex items-center justify-between px-6 shrink-0">
              <Link
                href="/admin"
                className="text-teal text-[0.875rem] font-medium tracking-[0.07rem]"
                onClick={() => setMenuOpen(false)}
              >
                KW
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-muted hover:text-warm-white text-[1.25rem] cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`text-[1.75rem] font-medium transition-colors ${
                    pathname === href ? "text-teal" : "text-warm-white hover:text-teal"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
