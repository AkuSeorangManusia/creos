"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Rnd } from "react-rnd";

export default function Window({
    title,
    icon,
    children,
    onClose,
    onFocus,
    onMove,
    focused,
    initialPosition,
    initialSize,
}) {
    const MIN_WIDTH = 400;
    const MIN_HEIGHT = 300;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const verticalOffset = isMobile ? 120 : 90;

    const MAX_WIDTH =
        typeof window !== "undefined" ? window.innerWidth - 100 : 1200;
    const MAX_HEIGHT =
        typeof window !== "undefined"
            ? window.innerHeight - verticalOffset
            : 800;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && focused) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [focused, onClose]);

    const handleMouseDown = (e) => {
        e.stopPropagation(); // i hope this works
        onFocus();
    };

    return (
        <Rnd
            default={{
                x: initialPosition?.x || 100,
                y: initialPosition?.y || 100,
                width: initialSize?.width || 600,
                height: initialSize?.height || 400,
            }}
            minWidth={MIN_WIDTH}
            minHeight={MIN_HEIGHT}
            maxWidth={MAX_WIDTH}
            maxHeight={MAX_HEIGHT}
            bounds="window"
            dragHandleClassName="window-drag-handle"
            enableUserSelectHack={false}
            disableDragging={false}
            onMouseDown={handleMouseDown}
            onDrag={(e) => {
                e.stopPropagation();
            }}
            onDragStop={(e, d) => {
                e.stopPropagation();
                if (onMove) {
                    onMove({ x: d.x, y: d.y });
                }
                onFocus();
            }}
            className={`bg-gray-200 border-2 border-gray-400 shadow-2xl ${
                focused ? "z-40" : "z-30"
            }`}
            style={{
                display: "flex",
                flexDirection: "column",
                touchAction: "none",
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
            resizeHandleStyles={{
                bottom: { cursor: "ns-resize", touchAction: "none" },
                bottomLeft: { cursor: "nesw-resize", touchAction: "none" },
                bottomRight: { cursor: "nwse-resize", touchAction: "none" },
                left: { cursor: "ew-resize", touchAction: "none" },
                right: { cursor: "ew-resize", touchAction: "none" },
            }}
        >
            {/* Title bar */}
            <div
                className={`flex items-center justify-between px-2 py-1 ${
                    focused ? "bg-blue-600" : "bg-gray-500"
                }`}
            >
                <div className="window-drag-handle flex items-center gap-2 cursor-move flex-1">
                    <div className="relative w-6 h-6">
                        <Image
                            src={icon}
                            alt={title}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-white font-semibold text-lg">
                        {title}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onClose();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onTouchStart={(e) => {
                        e.stopPropagation();
                    }}
                    className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white font-bold text-lg flex items-center justify-center touch-manipulation flex-shrink-0"
                >
                    ×
                </button>
            </div>

            {/* Content */}
            <div
                className="overflow-auto bg-white flex-1 window-content"
                style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    // paddingTop: "5px",
                }}
            >
                {children}
            </div>
        </Rnd>
    );
}
