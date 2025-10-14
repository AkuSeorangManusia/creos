"use client";

import { useState, useEffect, useRef } from "react";

export default function TopPanel({
  windows,
  onOpenApp,
  onCloseAll,
  onFocusWindow,
  onCloseWindow,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    // Update clock every second with WIB time (UTC+7)
    const updateClock = () => {
      const now = new Date();
      const wibTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      const hours = wibTime.getHours().toString().padStart(2, "0");
      const minutes = wibTime.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
    <div className="flex items-center gap-2">
      <div className="text-white text-lg px-2 border-l border-gray-600">
        {currentTime}
      </div>
      <div className="text-white text-lg px-2 border-l border-gray-600">
        guest@Creos
      </div>
      <button
        onClick={onCloseAll}
        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white text-lg"
      >
        Show Desktop
      </button>
    </div>;
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
    { label: "Reboot", type: "system" },
  ];

  const handleMenuItemClick = (item) => {
    console.log("Menu item clicked:", item);
    if (item.type === "app") {
      onOpenApp(item.label);
    } else if (item.label === "Reboot") {
      // Reload page to simulate power off
      window.location.reload();
    }
    setMenuOpen(false);
  };

  console.log("Menu state:", menuOpen); // Debug log

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-gray-800 border-b-2 border-gray-600 flex items-center justify-between px-2 z-50 overflow-visible">
      {/* Left side: Menu and window list */}
      <div className="flex items-center gap-3 flex-1 overflow-visible">
        <div className="relative" style={{ zIndex: 100 }} ref={menuRef}>
          <button
            onClick={() => {
              console.log("Menu button clicked, current state:", menuOpen);
              setMenuOpen(!menuOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 text-white text-lg font-bold whitespace-nowrap shadow-md"
            style={{ padding: "4px 10px" }}
          >
            ☰ Menu
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 w-32 bg-gray-800 border-2 border-gray-600 shadow-xl"
              style={{ top: "100%", zIndex: 9999 }}
            >
              {menuItems.map((item, index) =>
                item.type === "separator" ? (
                  <div key={index} className="border-t border-gray-600 my-1" />
                ) : (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 text-lg block"
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Window list */}
        <div className="flex gap-2 items-center overflow-x-auto">
          {windows.map((window) => (
            <div
              key={window.id}
              className={`flex items-center gap-2 px-3 py-1 text-lg border border-gray-500 whitespace-nowrap ${
                window.focused
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => onFocusWindow(window.id)}
                className="hover:underline"
              >
                {window.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseWindow(window.id);
                }}
                className="text-red-400 hover:text-red-300 font-bold text-xl leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Clock, system indicator, show desktop */}
      <div className="flex items-center gap-2 ml-2">
        <div
          className="text-white text-lg px-3 py-1 bg-gray-700 border border-gray-600"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          {currentTime}
        </div>
        <div
          className="text-white text-lg px-3 py-1 bg-gray-700 border border-gray-600"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          guest@Creos
        </div>
        <button
          onClick={onCloseAll}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white text-lg whitespace-nowrap"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          Close all windows
        </button>
      </div>
    </div>
  );
}
