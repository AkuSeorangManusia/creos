"use client";

import { useEffect, useState } from "react";

const bootMessages = [
  "[ OK ] Starting Creos Operating System v1.0",
  "[ OK ] Checking system integrity",
  "[ OK ] Initializing hardware interfaces",
  "[ OK ] Loading kernel modules",
  "[ OK ] Mounting root filesystem",
  "[ OK ] Activating swap partition",
  "[ OK ] Starting system logging daemon",
  "[ OK ] Initializing random number generator",
  "[ OK ] Loading network drivers",
  "[ OK ] Starting network manager",
  "[ OK ] Configuring network interfaces",
  "[ OK ] Starting firewall service",
  "[ OK ] Loading graphics drivers",
  "[ OK ] Initializing display server",
  "[ OK ] Starting window manager",
  "[ OK ] Loading desktop environment",
  "[ OK ] Initializing portfolio services",
  "[ OK ] Starting creative process daemon",
  "[ OK ] Loading project database",
  "[ OK ] Initializing contact manager",
  "[ OK ] Starting user interface",
  "[ OK ] Checking for updates",
  "[ OK ] All systems operational",
  "[ OK ] Welcome to Creos!",
];

export default function BootSequence({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < bootMessages.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 60); // Fast burst of lines
      return () => clearTimeout(timer);
    } else {
      // All lines shown, wait a bit then transition to desktop
      const timer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-white p-8 font-mono overflow-hidden">
      <div className="space-y-1 text-lg">
        {bootMessages.slice(0, currentLine).map((message, index) => (
          <div key={index} className="animate-pulse-once">
            <span className="text-green-400">[ OK ]</span>
            <span> {message.substring(6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
