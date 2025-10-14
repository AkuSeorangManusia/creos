"use client";

import { useState } from "react";
import Image from "next/image";

export default function DesktopIcon({ icon, label, isSelected, onSelect, onDoubleClick }) {
  const [hovered, setHovered] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent desktop click from deselecting

    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick();
    } else {
      // First click - select the icon
      onSelect();
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer w-28 h-28 ${
        isSelected ? "bg-blue-500/30 backdrop-blur-sm" : ""
      }`}
    >
      <div
        className={`relative w-16 h-16 mb-1 transition-all ${
          hovered ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : ""
        }`}
      >
        <Image
          src={icon}
          alt={label}
          fill
          className="object-contain"
        />
      </div>
      <div
        className="text-white mt-4 text-center text-lg leading-tight transition-all drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
        style={{
          textShadow:
            "1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
