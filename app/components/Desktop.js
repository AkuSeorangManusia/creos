"use client";

import { useState, useCallback, useRef } from "react";
import TopPanel from "./TopPanel";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Widget from "./Widget";
import { AboutMe, Projects, Contacts, Guestbook, Calculator } from "./AppContent";
import { ClockWidget, DiscordPresenceWidget } from "./WidgetContent";

const apps = [
  {
    id: "about",
    label: "About Me",
    icon: "/about-me-icon.png",
    content: AboutMe,
  },
  {
    id: "projects",
    label: "Projects",
    icon: "/projects-icon.png",
    content: Projects,
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: "/contact-icon.png",
    content: Contacts,
  },
  {
    id: "guestbook",
    label: "Guestbook",
    icon: "/atabook.png",
    content: Guestbook,
    windowSize: {width: 400, height: 550}
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: "/calculator-icon.png",
    content: Calculator,
    showOnDesktop: false, // Don't show on desktop, only in menu
    windowSize: { width: 300, height: 600 }, // Custom window size
  },
];

// Calculate positions for right side of screen (accounting for widget width + margin)
const getInitialWidgets = () => {
  const rightMargin = 20;
  const clockWidth = 200;
  const discordWidth = 200;

  return [
    {
      id: "clock",
      title: "Clock",
      content: ClockWidget,
      position: {
        x:
          typeof window !== "undefined"
            ? window.innerWidth - clockWidth - rightMargin
            : window.innerWidth - 220,
        y: 80,
      },
      width: clockWidth,
      height: 150,
      dynamicHeight: false,
    },
    {
      id: "discord",
      title: "Discord",
      content: DiscordPresenceWidget,
      position: {
        x:
          typeof window !== "undefined"
            ? window.innerWidth - discordWidth - rightMargin
            : window.innerWidth - 220,
        y: 250,
      },
      width: discordWidth,
      height: 180,
      dynamicHeight: true,
    },
  ];
};

const CASCADE_OFFSET = 30; // Offset for cascading windows

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [widgets, setWidgets] = useState(getInitialWidgets());
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
      setWindows((prev) => prev.map((w) => ({ ...w, focused: false })));
    }
  };

  const openApp = useCallback(
    (appLabel) => {
      const app = apps.find((a) => a.label === appLabel);
      if (!app) return;

      // Count how many windows of this app type are already open
      const appWindowCount = windows.filter((w) => w.appId === app.id).length;

      // Limit to 5 windows per app
      if (appWindowCount >= 5) {
        console.log(`Maximum of 5 ${app.label} windows reached`);
        return;
      }

      // Detect mobile
      const isMobile = window.innerWidth < 768;

      // Get custom window size or use defaults
      const defaultWidth = 600;
      const defaultHeight = 400;
      const customWidth = app.windowSize?.width || defaultWidth;
      const customHeight = app.windowSize?.height || defaultHeight;

      // Calculate center position with mobile-friendly values
      const windowWidth = isMobile
        ? Math.min(window.innerWidth - 20, customWidth)
        : customWidth;
      const windowHeight = isMobile
        ? Math.min(window.innerHeight - 100, customHeight)
        : customHeight;

      const centerX = Math.max(10, (window.innerWidth - windowWidth) / 2);
      const centerY = Math.max(
        60,
        (window.innerHeight - windowHeight) / 2 + 20
      ); // +20 to account for top panel

      let newX, newY;

      // Check if we should cascade or center
      if (
        lastCenterPosition.current &&
        lastCenterPosition.current.x === centerX &&
        lastCenterPosition.current.y === centerY
      ) {
        // Previous window is still at center position, cascade the new one
        cascadeCount.current += 1;
        const offset = isMobile ? 15 : CASCADE_OFFSET; // Smaller offset on mobile
        newX = Math.max(10, centerX + offset * cascadeCount.current);
        newY = Math.max(60, centerY + offset * cascadeCount.current);
      } else {
        // Previous window was moved, center the new one and reset cascade
        newX = centerX;
        newY = centerY;
        cascadeCount.current = 0;
        lastCenterPosition.current = { x: centerX, y: centerY };
      }

      // Create unique window ID
      const uniqueWindowId = `${app.id}-${nextWindowId}`;

      // Add instance number to title if multiple windows of same app
      const windowTitle =
        appWindowCount > 0 ? `${app.label} (${appWindowCount + 1})` : app.label;

      const newWindow = {
        id: uniqueWindowId,
        appId: app.id,
        title: windowTitle,
        icon: app.icon,
        content: app.content,
        focused: true,
        zIndex: nextZIndex,
        position: { x: newX, y: newY },
        size: { width: windowWidth, height: windowHeight },
        hasMoved: false,
      };

      setWindows((prev) => [
        ...prev.map((w) => ({ ...w, focused: false })),
        newWindow,
      ]);
      setNextZIndex(nextZIndex + 1);
      setNextWindowId(nextWindowId + 1);
    },
    [windows, nextZIndex, nextWindowId]
  );

  const closeWindow = useCallback((windowId) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const focusWindow = useCallback(
    (windowId) => {
      setWindows((prev) =>
        prev.map((w) => ({
          ...w,
          focused: w.id === windowId,
          zIndex: w.id === windowId ? nextZIndex : w.zIndex,
        }))
      );
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  const handleWindowMove = useCallback((windowId, newPosition) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          // Check if window actually moved from its original position
          const moved =
            w.position.x !== newPosition.x || w.position.y !== newPosition.y;

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
      })
    );
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
    lastCenterPosition.current = null;
    cascadeCount.current = 0;
  }, []);

  const reorderWindows = useCallback((newWindowsOrder) => {
    setWindows(newWindowsOrder);
  }, []);

  const closeWidget = useCallback((widgetId) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  }, []);

  return (
    <div
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-cover bg-center bg-no-repeat pb-0 md:pb-0"
      style={{
        backgroundImage: "url('/pixel-art.jpg')",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
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
      <div
        className="absolute top-14 left-4 grid grid-flow-row auto-rows-max gap-2"
        style={{ gridTemplateColumns: "repeat(1, 112px)" }}
      >
        {apps
          .filter((app) => app.showOnDesktop !== false)
          .map((app) => (
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
      {windows.map((window) => (
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
          initialSize={window.size}
        >
          <window.content />
        </Window>
      ))}

      {/* Widgets */}
      {widgets.map((widget) => (
        <Widget
          key={widget.id}
          id={widget.id}
          title={widget.title}
          onClose={() => closeWidget(widget.id)}
          initialPosition={widget.position}
          width={widget.width}
          height={widget.height}
          dynamicHeight={widget.dynamicHeight}
        >
          {widget.dynamicHeight ? (
            ({ onHeightChange }) => (
              <widget.content onHeightChange={onHeightChange} />
            )
          ) : (
            <widget.content />
          )}
        </Widget>
      ))}
    </div>
  );
}
