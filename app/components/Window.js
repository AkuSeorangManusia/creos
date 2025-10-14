"use client";

import { useEffect } from "react";
import { Rnd } from "react-rnd";
import Image from "next/image";

export default function Window({
  id,
  title,
  icon,
  children,
  onClose,
  onFocus,
  onMove,
  focused,
  initialPosition,
}) {
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 300;
  const MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth - 100 : 1200;
  const MAX_HEIGHT = typeof window !== 'undefined' ? window.innerHeight - 150 : 800;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && focused) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focused, onClose]);

  return (
    <Rnd
      default={{
        x: initialPosition?.x || 100,
        y: initialPosition?.y || 100,
        width: 600,
        height: 400,
      }}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      maxWidth={MAX_WIDTH}
      maxHeight={MAX_HEIGHT}
      bounds="window"
      dragHandleClassName="window-drag-handle"
      onMouseDown={onFocus}
      onDragStop={(e, d) => {
        if (onMove) {
          onMove({ x: d.x, y: d.y });
        }
      }}
      className={`bg-gray-200 border-2 border-gray-400 shadow-2xl ${
        focused ? "z-40" : "z-30"
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      enableResizing={{
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: false,
        topLeft: false,
        topRight: false,
      }}
    >
      {/* Title bar */}
      <div
        className={`window-drag-handle flex items-center justify-between px-2 py-1 cursor-move ${
          focused ? "bg-blue-600" : "bg-gray-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src={icon}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white font-semibold text-lg">{title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white font-bold text-lg flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="overflow-auto bg-white flex-1">
        {children}
      </div>
    </Rnd>
  );
}
