"use client";

import { useEffect, useState } from "react";

const bootMessages = [
  "[ OK ] Starting Creos Operating System",
  "[ OK ] Initializing system services",
  "[ OK ] Loading kernel modules",
  "[ OK ] Mounting file systems",
  "[ OK ] Starting network manager",
  "[ OK ] Loading desktop environment",
  "[ OK ] Initializing portfolio services",
  "[ OK ] Starting window manager",
  "[ OK ] System ready",
];

export default function BootSequence({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < bootMessages.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 80); // Fast burst of lines
      return () => clearTimeout(timer);
    } else {
      // All lines shown, wait a bit then transition to desktop
      const timer = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 p-8 font-mono overflow-hidden">
      <div className="space-y-1">
        {bootMessages.slice(0, currentLine).map((message, index) => (
          <div key={index} className="text-sm">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
