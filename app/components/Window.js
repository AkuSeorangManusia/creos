"use client";

import { useState, useRef, useEffect } from "react";

export default function Window({
  id,
  title,
  icon,
  children,
  onClose,
  onFocus,
  focused,
  initialPosition,
}) {
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);

  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 300;
  const MAX_WIDTH = window.innerWidth - 100;
  const MAX_HEIGHT = window.innerHeight - 150;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && focused) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focused, onClose]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: Math.max(40, e.clientY - dragStart.y), // Don't go above panel
        });
      } else if (isResizing) {
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width + (e.clientX - resizeStart.x)));
        const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height + (e.clientY - resizeStart.y)));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleMouseDownTitle = (e) => {
    if (e.target.closest("button")) return; // Don't drag if clicking close button
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus();
  };

  const handleMouseDownResize = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  return (
    <div
      ref={windowRef}
      onClick={onFocus}
      className={`absolute bg-gray-200 border-2 border-gray-400 shadow-2xl ${
        focused ? "z-40" : "z-30"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={handleMouseDownTitle}
        className={`flex items-center justify-between px-2 py-1 cursor-move ${
          focused ? "bg-blue-600" : "bg-gray-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="overflow-auto bg-white" style={{ height: `calc(100% - 32px)` }}>
        {children}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDownResize}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-400"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />
    </div>
  );
}
