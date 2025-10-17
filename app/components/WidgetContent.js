"use client";

import { useState, useEffect } from "react";

export function ClockWidget() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const wibTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      
      const hours = wibTime.getHours().toString().padStart(2, "0");
      const minutes = wibTime.getMinutes().toString().padStart(2, "0");
      const seconds = wibTime.getSeconds().toString().padStart(2, "0");
      
      setTime(`${hours}:${minutes}:${seconds}`);
      
      const options = { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      setDate(wibTime.toLocaleDateString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-green-400">
      <div className="text-4xl font-mono font-bold mb-2" style={{ fontFamily: 'monospace' }}>
        {time}
      </div>
      <div className="text-sm font-mono">
        {date}
      </div>
      <div className="text-xs mt-1 text-green-500">
        WIB (UTC+7)
      </div>
    </div>
  );
}

export function DiscordPresenceWidget({ onHeightChange }) {
  const [presence, setPresence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const DISCORD_USER_ID = "687912745042968590";

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const data = await response.json();
        
        if (data.success) {
          setPresence(data.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch Discord presence:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate required height based on content
  useEffect(() => {
    if (!presence || loading || error) {
      onHeightChange?.(180); // Default height for loading/error states
      return;
    }

    const spotify = presence.spotify;
    const activities = presence.activities || [];
    const mainActivity = activities.find(a => a.type !== 4);
    const isOnline = presence.discord_status !== "offline";

    let requiredHeight = 60; // Base height for status

    if (spotify) {
      requiredHeight += 70; // Spotify section
    }

    if (mainActivity) {
      requiredHeight += 60; // Activity section base
      if (mainActivity.details) {
        requiredHeight += 20; // Additional line for details
      }
    }

    if (!spotify && !mainActivity && isOnline) {
      requiredHeight += 40; // "Just chilling..." text
    }

    // Add some padding and ensure minimum height
    requiredHeight = Math.max(requiredHeight + 20, 180);

    onHeightChange?.(requiredHeight);
  }, [presence, loading, error, onHeightChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !presence) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-xs">Unable to load</div>
        </div>
      </div>
    );
  }

  const isOnline = presence.discord_status !== "offline";
  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500"
  };

  const spotify = presence.spotify;
  const activities = presence.activities || [];
  const mainActivity = activities.find(a => a.type !== 4); // Exclude custom status

  return (
    <div className="flex flex-col h-full text-black text-xs">
      {/* Status */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${statusColors[presence.discord_status]}`}></div>
        <span className="font-bold text-sm capitalize">{presence.discord_status}</span>
      </div>

      {/* Spotify */}
      {spotify && (
        <div className="mb-2 pb-2 border-b border-gray-300">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-green-600 font-bold">♫</span>
            <span className="font-semibold">Listening to Spotify</span>
          </div>
          <div className="text-xs">
            <div className="font-bold truncate">{spotify.song}</div>
            <div className="text-gray-600 truncate">by {spotify.artist}</div>
          </div>
        </div>
      )}

      {/* Activity (Game/App) */}
      {mainActivity && (
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-purple-600 font-bold">🎮</span>
            <span className="font-semibold">Playing</span>
          </div>
          <div className="font-bold truncate text-xs">{mainActivity.name}</div>
          {mainActivity.details && (
            <div className="text-gray-600 truncate text-xs">{mainActivity.details}</div>
          )}
        </div>
      )}

      {/* If nothing is happening */}
      {!spotify && !mainActivity && isOnline && (
        <div className="text-gray-500 text-center mt-4">
          Just chilling...
        </div>
      )}
    </div>
  );
}
