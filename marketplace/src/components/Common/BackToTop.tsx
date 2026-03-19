'use client';
import React, { useEffect } from "react";

export default function BackToTop() {

  function backToTop() {
    const result = document.querySelector(".back-to-top-wrapper");
    if (result) {
      document.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
          result.classList.add("back-to-top-btn-show");
        } else {
          result.classList.remove("back-to-top-btn-show");
        }
      });
      result.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
  useEffect(() => {
    backToTop();
    return () => {
      window.removeEventListener("scroll", backToTop);
    }
  },[])
  return (
    <div className="back-to-top-wrapper">
      <button id="back_to_top" type="button" className="back-to-top-btn">
        <svg
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 6L6 1L1 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
