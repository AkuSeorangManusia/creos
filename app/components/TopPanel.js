"use client";

import { useState, useEffect, useRef } from "react";

export default function TopPanel({ windows, onOpenApp, onCloseAll, onFocusWindow }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    // Update clock every second with WIB time
    const updateClock = () => {
      const now = new Date();
      // WIB is UTC+7
      const wibTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
      const hours = wibTime.getHours().toString().padStart(2, "0");
      const minutes = wibTime.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: "About Me", type: "app" },
    { label: "Projects", type: "app" },
    { label: "Contacts", type: "app" },
    { type: "separator" },
    { label: "Settings", type: "system" },
    { label: "Power Off", type: "system" },
  ];

  const handleMenuItemClick = (item) => {
    if (item.type === "app") {
      onOpenApp(item.label);
    } else if (item.label === "Power Off") {
      // Reload page to simulate power off
      window.location.reload();
    }
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-gray-800 border-b-2 border-gray-600 flex items-center justify-between px-2 z-50">
      {/* Left side: Menu and window list */}
      <div className="flex items-center gap-2 flex-1 overflow-x-auto">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white text-sm"
          >
            Menu
          </button>
          
          {menuOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border-2 border-gray-600 shadow-lg">
              {menuItems.map((item, index) => (
                item.type === "separator" ? (
                  <div key={index} className="border-t border-gray-600 my-1" />
                ) : (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 text-sm"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          )}
        </div>

        {/* Window list */}
        <div className="flex gap-1 items-center overflow-x-auto">
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => onFocusWindow(window.id)}
              className={`px-3 py-1 text-sm border border-gray-500 whitespace-nowrap ${
                window.focused
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-650"
              }`}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Clock, system indicator, show desktop */}
      <div className="flex items-center gap-2">
        <div className="text-white text-sm px-2 border-l border-gray-600">
          {currentTime}
        </div>
        <div className="text-white text-sm px-2 border-l border-gray-600">
          gues@Creos
        </div>
        <button
          onClick={onCloseAll}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white text-sm"
        >
          Show Desktop
        </button>
      </div>
    </div>
  );
}
