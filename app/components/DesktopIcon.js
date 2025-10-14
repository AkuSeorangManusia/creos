"use client";

import { useState } from "react";

export default function DesktopIcon({ icon, label, onDoubleClick }) {
  const [selected, setSelected] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleClick = () => {
    setSelected(true);
    
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick();
      // Brief delay before deselecting
      setTimeout(() => setSelected(false), 100);
    } else {
      // First click
      const timeout = setTimeout(() => {
        setClickTimeout(null);
        // Single click - just keep selected
      }, 300);
      setClickTimeout(timeout);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-3 rounded cursor-pointer transition-all w-24 ${
        selected ? "bg-blue-500/30" : ""
      } hover:shadow-lg`}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <div className="text-white text-center text-sm">{label}</div>
    </div>
  );
}
