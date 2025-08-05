import React from "react";

export default function ScrollTopButton() {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-8 right-8 p-3 bg-[#6a57f5] text-white rounded-full shadow-lg hover:bg-[#5a47e5] transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:-translate-y-1 transition-transform duration-300"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
