"use client";

import { useState, useEffect, useRef } from "react";

export default function TopPanel({
  windows,
  onOpenApp,
  onCloseAll,
  onFocusWindow,
  onCloseWindow,
  onReorderWindows,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
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
      const seconds = wibTime.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update date every day
    const updateDate = () => {
      const now = new Date();
      const wibDate = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      const options = { year: "numeric", month: "long", day: "numeric" };
      setCurrentDate(wibDate.toLocaleDateString("en-US", options));
    };

    updateDate();
    const interval = setInterval(updateDate, 60 * 60 * 1000); // Update every hour
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

  // Drag and drop handlers for window list
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      // Reorder the windows array
      const newWindows = [...windows];
      const draggedWindow = newWindows[draggedIndex];
      newWindows.splice(draggedIndex, 1);
      newWindows.splice(dragOverIndex, 0, draggedWindow);
      
      if (onReorderWindows) {
        onReorderWindows(newWindows);
      }
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  console.log("Menu state:", menuOpen); // Debug log

  return (
    <>
      {/* Top Panel */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-gray-800 border-b-2 border-gray-600 flex items-center justify-between px-2 z-50 overflow-visible">
        {/* Left side: Menu and window list */}
        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-visible">
          <div
            className="relative flex-shrink-0"
            style={{ zIndex: 100 }}
            ref={menuRef}
          >
          <button
            onClick={() => {
              console.log("Menu button clicked, current state:", menuOpen);
              setMenuOpen(!menuOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 text-white text-lg font-bold whitespace-nowrap shadow-md"
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
              marginLeft: "10px",
            }}
          >
            ☰ Menu
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 w-32 mt-2 bg-gray-800 border-2 border-gray-600 shadow-xl"
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

        {/* Window list - horizontally scrollable */}
        <div className="flex gap-2 items-center overflow-x-auto flex-1 min-w-0 window-list-scroll">
          {windows.map((window, index) => (
            <div
              key={window.id}
              draggable
              onClick={(e) => e.stopPropagation()}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              className={`flex items-center gap-2 px-3 py-1 text-lg border border-gray-500 whitespace-nowrap flex-shrink-0 cursor-move ${
                window.focused
                  ? "bg-gray-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } ${
                draggedIndex === index
                  ? "opacity-50"
                  : ""
              } ${
                dragOverIndex === index
                  ? "border-blue-400 border-2"
                  : ""
              }`}
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFocusWindow(window.id);
                }}
                className="hover:underline pointer-events-auto"
              >
                {window.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseWindow(window.id);
                }}
                className="text-red-400 hover:text-red-300 font-bold text-xl leading-none pointer-events-auto"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Mobile clock - Short format (HH:MM only) */}
        <div
          className="md:hidden text-white text-lg px-3 bg-gray-700 border border-gray-600 whitespace-nowrap flex-shrink-0"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          {currentTime.substring(0, 5)}
        </div>
      </div>

      {/* Right side: Clock, system indicator, date, show desktop - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 ml-2">
        <div
          className="text-white text-lg px-3 bg-gray-700 border border-gray-600"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          {currentTime} UTC+7
        </div>
        <div
          className="text-white text-lg px-3 bg-gray-700 border border-gray-600"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          guest@Creos
        </div>
        <div
          className="text-white text-lg px-3 bg-gray-700 border border-gray-600"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          {currentDate}
        </div>
        <button
          onClick={onCloseAll}
          className="px-3 bg-gray-700 hover:bg-red-700 border border-gray-500 text-white text-lg whitespace-nowrap"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          Close all windows
        </button>
      </div>
    </div>

    {/* Bottom Panel - Only visible on mobile (Date and Close All button only) */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-10 bg-gray-800 border-t-2 border-gray-600 flex items-center justify-end px-2 z-50 gap-2 overflow-x-auto">
      <div
        className="text-white text-lg px-3 bg-gray-700 border border-gray-600 whitespace-nowrap flex-shrink-0"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        {currentDate}
      </div>
      <button
        onClick={onCloseAll}
        className="px-3 bg-gray-700 hover:bg-red-700 border border-gray-500 text-white text-lg whitespace-nowrap flex-shrink-0"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        Close all windows
      </button>
    </div>
  </>
  );
}
