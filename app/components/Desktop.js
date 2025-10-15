"use client";

import { useState, useCallback, useRef } from "react";
import TopPanel from "./TopPanel";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import { AboutMe, Projects, Contacts } from "./AppContent";

const apps = [
  { id: "about", label: "About Me", icon: "/about-me-icon.png", content: AboutMe },
  { id: "projects", label: "Projects", icon: "/projects-icon.png", content: Projects },
  { id: "contacts", label: "Contacts", icon: "/contact-icon.png", content: Contacts },
];

const CASCADE_OFFSET = 30; // Offset for cascading windows

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [nextWindowId, setNextWindowId] = useState(1);
  const lastCenterPosition = useRef(null);
  const cascadeCount = useRef(0);
  const desktopRef = useRef(null);

  const handleDesktopClick = (e) => {
    // Only unfocus if clicking directly on the desktop, not on children
    if (e.target === desktopRef.current) {
      // Deselect any selected icon when clicking on desktop
      setSelectedIconId(null);
      
      // Unfocus all windows
      setWindows(prev => prev.map(w => ({ ...w, focused: false })));
    }
  };

  const openApp = useCallback((appLabel) => {
    const app = apps.find(a => a.label === appLabel);
    if (!app) return;

    // Count how many windows of this app type are already open
    const appWindowCount = windows.filter(w => w.appId === app.id).length;
    
    // Limit to 5 windows per app
    if (appWindowCount >= 5) {
      console.log(`Maximum of 5 ${app.label} windows reached`);
      return;
    }

    // Calculate center position
    const centerX = (window.innerWidth - 600) / 2;
    const centerY = (window.innerHeight - 400) / 2 + 20; // +20 to account for top panel
    
    let newX, newY;
    
    // Check if we should cascade or center
    if (lastCenterPosition.current && 
        lastCenterPosition.current.x === centerX && 
        lastCenterPosition.current.y === Math.max(60, centerY)) {
      // Previous window is still at center position, cascade the new one
      cascadeCount.current += 1;
      newX = centerX + (CASCADE_OFFSET * cascadeCount.current);
      newY = Math.max(60, centerY) + (CASCADE_OFFSET * cascadeCount.current);
    } else {
      // Previous window was moved, center the new one and reset cascade
      newX = centerX;
      newY = Math.max(60, centerY);
      cascadeCount.current = 0;
      lastCenterPosition.current = { x: centerX, y: Math.max(60, centerY) };
    }

    // Create unique window ID
    const uniqueWindowId = `${app.id}-${nextWindowId}`;
    
    // Add instance number to title if multiple windows of same app
    const windowTitle = appWindowCount > 0 
      ? `${app.label} (${appWindowCount + 1})`
      : app.label;

    const newWindow = {
      id: uniqueWindowId,
      appId: app.id,
      title: windowTitle,
      icon: app.icon,
      content: app.content,
      focused: true,
      zIndex: nextZIndex,
      position: { x: newX, y: newY },
      hasMoved: false,
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, focused: false })),
      newWindow
    ]);
    setNextZIndex(nextZIndex + 1);
    setNextWindowId(nextWindowId + 1);
  }, [windows, nextZIndex, nextWindowId]);

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

  const handleWindowMove = useCallback((windowId, newPosition) => {
    setWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        // Check if window actually moved from its original position
        const moved = w.position.x !== newPosition.x || w.position.y !== newPosition.y;
        
        if (moved && !w.hasMoved) {
          // Window was moved for the first time, update lastCenterPosition
          lastCenterPosition.current = null;
        }
        
        return {
          ...w,
          position: newPosition,
          hasMoved: moved || w.hasMoved,
        };
      }
      return w;
    }));
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
    lastCenterPosition.current = null;
    cascadeCount.current = 0;
  }, []);

  const reorderWindows = useCallback((newWindowsOrder) => {
    setWindows(newWindowsOrder);
  }, []);

  return (
    <div 
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-cover bg-center bg-no-repeat pb-0 md:pb-0"
      style={{ backgroundImage: "url('/pixel-art.jpg')", paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={handleDesktopClick}
    >
      <TopPanel
        windows={windows}
        onOpenApp={openApp}
        onCloseAll={closeAllWindows}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        onReorderWindows={reorderWindows}
      />

      {/* Desktop icons */}
      <div className="absolute top-14 left-4 grid grid-flow-row auto-rows-max gap-2" style={{ gridTemplateColumns: "repeat(1, 112px)" }}>
        {apps.map(app => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.label}
            isSelected={selectedIconId === app.id}
            onSelect={() => setSelectedIconId(app.id)}
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
          onMove={(newPosition) => handleWindowMove(window.id, newPosition)}
          focused={window.focused}
          initialPosition={window.position}
        >
          <window.content />
        </Window>
      ))}
    </div>
  );
}
