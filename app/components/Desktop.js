"use client";

import { useState, useCallback } from "react";
import TopPanel from "./TopPanel";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import { AboutMe, Projects, Contacts } from "./AppContent";

const apps = [
  { id: "about", label: "About Me", icon: "👤", content: AboutMe },
  { id: "projects", label: "Projects", icon: "💼", content: Projects },
  { id: "contacts", label: "Contacts", icon: "📞", content: Contacts },
];

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);

  const openApp = useCallback((appLabel) => {
    const app = apps.find(a => a.label === appLabel);
    if (!app) return;

    // Check if window already exists
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      // Focus existing window
      focusWindow(app.id);
      return;
    }

    // Calculate center position
    const centerX = (window.innerWidth - 600) / 2;
    const centerY = (window.innerHeight - 400) / 2 + 20; // +20 to account for top panel

    const newWindow = {
      id: app.id,
      title: app.label,
      icon: app.icon,
      content: app.content,
      focused: true,
      zIndex: nextZIndex,
      position: { x: centerX, y: Math.max(60, centerY) },
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, focused: false })),
      newWindow
    ]);
    setNextZIndex(nextZIndex + 1);
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  const focusWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      focused: w.id === windowId,
      zIndex: w.id === windowId ? nextZIndex : w.zIndex,
    })));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#3E5481] overflow-hidden">
      <TopPanel
        windows={windows}
        onOpenApp={openApp}
        onCloseAll={closeAllWindows}
        onFocusWindow={focusWindow}
      />

      {/* Desktop icons */}
      <div className="absolute top-12 left-4 grid grid-flow-col auto-cols-max gap-4" style={{ gridAutoFlow: "row", gridTemplateRows: "repeat(auto-fill, 100px)" }}>
        {apps.map(app => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.label}
            onDoubleClick={() => openApp(app.label)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map(window => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          onClose={() => closeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          focused={window.focused}
          initialPosition={window.position}
        >
          <window.content />
        </Window>
      ))}
    </div>
  );
}
