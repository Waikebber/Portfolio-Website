"use client";
import { useEffect, useState } from "react";
import ContactFormFull from "./ContactFormFull/ContactFormFull";
import ContactFormCompact from "./ContactFormCompact/ContactFormCompact";

const ContactForm = () => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth <= 768 || window.innerHeight > window.innerWidth);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isCompact ? <ContactFormCompact /> : <ContactFormFull />;
};

export default ContactForm;