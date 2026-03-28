"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TopPanel({
    windows,
    onOpenApp,
    onCloseAll,
    onFocusWindow,
    onCloseWindow,
    onReorderWindows,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All Apps");
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const menuRef = useRef(null);

    const categories = [
        {
            name: "All Apps",
            apps: [
                "About Me",
                "Blog",
                "Calculator",
                "Contacts",
                "Guestbook",
                "Projects",
            ],
        },
        { name: "Me", apps: ["About Me", "Blog", "Projects", "Contacts"] },
        { name: "Tools", apps: ["Calculator", "Guestbook"] },
    ];

    const appIcons = {
        "About Me": "/about-me-icon.png",
        Projects: "/projects-icon.png",
        Contacts: "/contact-icon.png",
        Guestbook: "/atabook.png",
        Calculator: "/calculator-icon.png",
        Blog: "/blog-icon.png",
    };

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const wibTime = new Date(
                now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
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
        const updateDate = () => {
            const now = new Date();
            const wibDate = new Date(
                now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
            );
            const options = { year: "numeric", month: "long", day: "numeric" };
            setCurrentDate(wibDate.toLocaleDateString("en-US", options));
        };

        updateDate();
        const interval = setInterval(updateDate, 60 * 60 * 1000); // Update every hour
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
                setSelectedCategory("All Apps"); // Reset to default when closing
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleAppClick = (appLabel) => {
        onOpenApp(appLabel);
        setMenuOpen(false);
        setSelectedCategory("All Apps");
    };

    const handleReboot = () => {
        window.location.reload();
    };

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
        if (
            draggedIndex !== null &&
            dragOverIndex !== null &&
            draggedIndex !== dragOverIndex
        ) {
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

    console.log("Menu state:", menuOpen);

    return (
        <>
            {/* Top Panel */}
            <div className="fixed top-0 left-0 right-0 h-10 bg-gray-800 border-b-2 border-gray-600 flex items-center justify-between px-2 z-50 overflow-visible">
                <div className="flex items-center gap-3 flex-1 min-w-0 overflow-visible">
                    <div
                        className="relative flex-shrink-0"
                        style={{ zIndex: 100 }}
                        ref={menuRef}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(!menuOpen);
                                if (!menuOpen) {
                                    setSelectedCategory("All Apps");
                                }
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
                                className="absolute left-0 mt-2 bg-gray-300 border-2 border-gray-400 shadow-xl flex"
                                style={{
                                    top: "100%",
                                    zIndex: 9999,
                                    width: "300px",
                                    height: "400px",
                                }}
                            >
                                <div
                                    className="bg-gray-400 border-r-2 border-gray-500 flex flex-col"
                                    style={{ width: "110px" }}
                                >
                                    {categories.map((category, index) => (
                                        <div key={category.name}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.name,
                                                    )
                                                }
                                                className={`w-full px-3 py-2 text-left text-sm font-semibold ${
                                                    selectedCategory ===
                                                    category.name
                                                        ? "bg-gray-600 text-white"
                                                        : "text-black hover:bg-gray-500 hover:text-white"
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                            {index === 0 && (
                                                <div className="border-b-2 border-gray-500 mx-1" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 bg-gray-300 flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-2">
                                        {categories
                                            .find(
                                                (cat) =>
                                                    cat.name ===
                                                    selectedCategory,
                                            )
                                            ?.apps.map((appLabel) => (
                                                <button
                                                    key={appLabel}
                                                    type="button"
                                                    onClick={() =>
                                                        handleAppClick(appLabel)
                                                    }
                                                    className="w-full flex items-center gap-2 px-2 py-2 text-left text-black hover:bg-gray-400 border border-transparent hover:border-gray-500 mb-1"
                                                >
                                                    <Image
                                                        src={appIcons[appLabel]}
                                                        alt={appLabel}
                                                        width={24}
                                                        height={24}
                                                        className="flex-shrink-0"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {appLabel}
                                                    </span>
                                                </button>
                                            ))}
                                    </div>

                                    <div className="border-t-2 border-gray-400 p-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleReboot}
                                            className="text-sm text-black hover:underline font-semibold"
                                        >
                                            Reboot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 items-center overflow-x-auto flex-1 min-w-0 window-list-scroll">
                        {windows.map((window, index) => (
                            <div
                                key={window.id}
                                className={`flex items-center gap-2 px-3 py-1 text-lg border border-gray-500 whitespace-nowrap flex-shrink-0 cursor-move ${
                                    window.focused
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-700 text-gray-300"
                                } ${draggedIndex === index ? "opacity-50" : ""} ${
                                    dragOverIndex === index
                                        ? "border-blue-400 border-2"
                                        : ""
                                }`}
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                            >
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, index)
                                    }
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFocusWindow(window.id);
                                    }}
                                    className="hover:underline pointer-events-auto cursor-move"
                                >
                                    {window.title}
                                </button>
                                <button
                                    type="button"
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

                    {/* Mobile Clock */}
                    <div
                        className="md:hidden text-white text-lg px-3 bg-gray-700 border border-gray-600 whitespace-nowrap flex-shrink-0"
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                    >
                        {currentTime.substring(0, 5)}
                    </div>
                </div>

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
                        type="button"
                        onClick={onCloseAll}
                        className="px-3 bg-gray-700 hover:bg-red-700 border border-gray-500 text-white text-lg whitespace-nowrap"
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                    >
                        Close all windows
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Panel */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-10 bg-gray-800 border-t-2 border-gray-600 flex items-center justify-end px-2 z-50 gap-2 overflow-x-auto">
                <div
                    className="text-white text-lg px-3 bg-gray-700 border border-gray-600 whitespace-nowrap flex-shrink-0"
                    style={{ paddingLeft: "10px", paddingRight: "10px" }}
                >
                    {currentDate}
                </div>
                <button
                    type="button"
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
