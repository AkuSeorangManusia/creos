"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";

export default function Widget({
    id: _id,
    title,
    children,
    onClose,
    initialPosition,
    width = 200,
    height = 150,
    dynamicHeight = false,
}) {
    const [currentHeight, setCurrentHeight] = useState(height);

    return (
        <Rnd
            default={{
                x: initialPosition?.x || 50,
                y: initialPosition?.y || 50,
                width: width,
                height: currentHeight,
            }}
            size={{
                width: width,
                height: currentHeight,
            }}
            minWidth={width}
            minHeight={dynamicHeight ? 150 : height}
            maxWidth={width}
            maxHeight={dynamicHeight ? 500 : height}
            bounds="window"
            enableResizing={false}
            className="bg-gray-200 border-2 border-gray-400 shadow-xl"
            style={{
                display: "flex",
                flexDirection: "column",
                touchAction: "none",
                zIndex: 20,
            }}
        >
            {/* Title bar */}
            <div className="bg-gray-600 flex items-center justify-between px-2 py-1">
                <span className="text-white font-semibold text-sm">
                    {title}
                </span>
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
                    className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center"
                >
                    ×
                </button>
            </div>

            {/* Content */}
            <div className="bg-white flex-1 p-2 overflow-auto">
                {typeof children === "function"
                    ? children({ onHeightChange: setCurrentHeight })
                    : children}
            </div>
        </Rnd>
    );
}
