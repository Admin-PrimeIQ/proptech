"use client";
import { useEffect, useState, useRef } from "react";

const useSticky = () => {
  const [sticky, setSticky] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
      const lastScrollTop = lastScrollTopRef.current;

      if (scrollTop > lastScrollTop && scrollTop > 200) {
        setSticky(false);
      } else if (scrollTop < lastScrollTop && scrollTop > 200) {
        setSticky(true);
      } else {
        setSticky(false);
      }

      lastScrollTopRef.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { sticky };
};

export default useSticky;