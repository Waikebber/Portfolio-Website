"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observerRef.current.observe(hero);

    const handleMouseMove = (e: MouseEvent) => {
      setMouseNearTop(e.clientY < 80);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const visible = !pastHero || mouseNearTop;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-bg/90 backdrop-blur-md"
      animate={{ y: visible ? 0 : -72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "rgba(97,193,216,0.15)" }}
      />
      <div className="mx-auto max-w-[1440px] h-full flex items-center justify-between px-10">
        <Link
          href="/admin"
          className="text-teal text-[14px] font-medium tracking-[1.12px] hover:opacity-80 transition-opacity"
        >
          KW
        </Link>
        <nav className="flex items-center gap-10">
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
      </div>
    </motion.header>
  );
}
