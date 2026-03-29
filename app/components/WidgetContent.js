"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Clock Widget
export function ClockWidget() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const wibTime = new Date(
                now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
            );

            const hours = wibTime.getHours().toString().padStart(2, "0");
            const minutes = wibTime.getMinutes().toString().padStart(2, "0");
            const seconds = wibTime.getSeconds().toString().padStart(2, "0");

            setTime(`${hours}:${minutes}:${seconds}`);

            const options = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            };
            setDate(wibTime.toLocaleDateString("en-US", options));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-green-400">
            <div
                className="text-4xl font-mono font-bold mb-2"
                style={{ fontFamily: "monospace" }}
            >
                {time}
            </div>
            <div className="text-sm font-mono">{date}</div>
            <div className="text-xs mt-1 text-green-500">WIB (UTC+7)</div>
        </div>
    );
}

// Discord Presence Widget
export function DiscordPresenceWidget({ onHeightChange }) {
    const [presence, setPresence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now());

    const DISCORD_USER_ID = "687912745042968590";

    // smooth progress bar 101
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPresence = async () => {
            try {
                const response = await fetch(
                    `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
                );
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
            onHeightChange?.(180); // default
            return;
        }

        const spotify = presence.spotify;
        const activities = presence.activities || [];
        const mainActivity = activities.find((a) => a.type !== 4);
        const isOnline = presence.discord_status !== "offline";

        let requiredHeight = 50; // base height for status

        if (spotify) {
            requiredHeight += 75;
        }

        if (mainActivity) {
            requiredHeight += 60;
            if (mainActivity.details) {
                requiredHeight += 20;
            }
        }

        if (!spotify && !mainActivity && isOnline) {
            requiredHeight += 40;
        }

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
        offline: "bg-gray-500",
    };

    const spotify = presence.spotify;
    const activities = presence.activities || [];
    const mainActivity = activities.find(
        (a) => a.type !== 4 && a.name !== "Spotify",
    );

    // time format helper
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Calculate Spotify progress
    let spotifyProgress = 0;
    let currentPosition = 0;
    let totalDuration = 0;
    if (spotify?.timestamps) {
        const start = spotify.timestamps.start;
        const end = spotify.timestamps.end;
        totalDuration = end - start;
        currentPosition = currentTime - start;
        spotifyProgress = Math.min(
            Math.max((currentPosition / totalDuration) * 100, 0),
            100,
        );
    }

    // Construct avatar URL
    const discordUser = presence.discord_user;
    const avatarUrl = discordUser?.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${(BigInt(discordUser?.id || 0) >> 22n) % 6n}.png`;

    return (
        <div className="flex flex-col h-full text-black text-xs">
            {/* Profile Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                    <Image
                        src={avatarUrl}
                        alt={discordUser?.username || "Discord User"}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                    />
                    <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            statusColors[presence.discord_status]
                        }`}
                    ></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">
                        {discordUser?.username ||
                            discordUser?.global_name ||
                            "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                        <span
                            className={`w-2 h-2 rounded-full ${statusColors[presence.discord_status]}`}
                        ></span>
                        <span className="text-gray-600 capitalize">
                            {presence.discord_status}
                        </span>
                    </div>
                </div>
                {/* Discord Logo */}
                <svg
                    className="w-6 h-6 text-[#5865F2]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    aria-label="Discord"
                >
                    <title>Discord</title>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
            </div>

            {/* Spotify */}
            {spotify && (
                <div className="mb-2 pb-2 border-b border-gray-300">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-green-600 font-bold">♫</span>
                        <span className="font-semibold">
                            Listening to Spotify
                        </span>
                    </div>
                    <div className="text-xs mb-2">
                        <div className="font-bold truncate">{spotify.song}</div>
                        <div className="text-gray-600 truncate">
                            by {spotify.artist}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    {spotify.timestamps && (
                        <div className="mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                <span className="w-10 text-right">
                                    {formatTime(currentPosition)}
                                </span>
                                <div className="flex-1 bg-gray-300 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-600 h-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${spotifyProgress}%` }}
                                    ></div>
                                </div>
                                <span className="w-10">
                                    {formatTime(totalDuration)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Activity */}
            {mainActivity && (
                <div className="mb-2">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-purple-600 font-bold">🎮</span>
                        <span className="font-semibold">Playing</span>
                    </div>
                    <div className="font-bold truncate text-xs">
                        {mainActivity.name}
                    </div>
                    {mainActivity.details && (
                        <div className="text-gray-600 truncate text-xs">
                            {mainActivity.details}
                        </div>
                    )}
                </div>
            )}

            {/* Chilling */}
            {!spotify && !mainActivity && isOnline && (
                <div className="text-gray-500 text-center mt-4">
                    Just chilling...
                </div>
            )}
        </div>
    );
}

// Steam Profile Widget
// Disabled for now since the API is unreliable and often returns 500 errors.
// export function SteamProfileWidget({ onHeightChange }) {
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         const fetchSteamProfile = async () => {
//             try {
//                 const response = await fetch("/api/steam");
//                 const data = await response.json();

//                 if (data.success) {
//                     setProfile(data.data);
//                     setError(false);
//                 } else {
//                     setError(true);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch Steam profile:", err);
//                 setError(true);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSteamProfile();
//         const interval = setInterval(fetchSteamProfile, 30000);
//         return () => clearInterval(interval);
//     }, []);

//     // Calculate required height based on content
//     useEffect(() => {
//         if (!profile || loading || error) {
//             onHeightChange?.(180);
//             return;
//         }

//         let requiredHeight = 80;

//         if (profile.gameextrainfo) {
//             requiredHeight += 50;
//         }

//         if (profile.recentGames?.length > 0 && !profile.gameextrainfo) {
//             requiredHeight += 60;
//         }

//         requiredHeight = Math.max(requiredHeight + 20, 180);
//         onHeightChange?.(requiredHeight);
//     }, [profile, loading, error, onHeightChange]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-full text-gray-500">
//                 <div className="text-center">
//                     <div className="text-2xl mb-2">⏳</div>
//                     <div className="text-sm">Loading...</div>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !profile) {
//         return (
//             <div className="flex items-center justify-center h-full text-gray-500">
//                 <div className="text-center">
//                     <div className="text-2xl mb-2">❌</div>
//                     <div className="text-xs">Unable to load</div>
//                 </div>
//             </div>
//         );
//     }

//     // Steam persona states
//     const statusInfo = {
//         0: { label: "Offline", color: "bg-gray-500" },
//         1: { label: "Online", color: "bg-green-500" },
//         2: { label: "Busy", color: "bg-red-500" },
//         3: { label: "Away", color: "bg-yellow-500" },
//         4: { label: "Snooze", color: "bg-yellow-600" },
//         5: { label: "Looking to Trade", color: "bg-blue-500" },
//         6: { label: "Looking to Play", color: "bg-blue-400" },
//     };

//     const status = statusInfo[profile.personastate] || statusInfo[0];
//     const isPlaying = !!profile.gameextrainfo;

//     // Format playtime
//     const formatPlaytime = (minutes) => {
//         const hours = Math.floor(minutes / 60);
//         if (hours < 1) return `${minutes}m`;
//         return `${hours}h`;
//     };

//     return (
//         <div className="flex flex-col h-full text-black text-xs">
//             {/* Profile Header */}
//             <div className="flex items-center gap-3 mb-3">
//                 <div className="relative">
//                     <Image
//                         src={profile.avatar}
//                         alt={profile.personaname}
//                         width={48}
//                         height={48}
//                         unoptimized
//                         className="w-12 h-12 rounded-lg border-2 border-gray-300"
//                     />
//                     <div
//                         className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${status.color}`}
//                     ></div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                     <div className="font-bold text-sm truncate">
//                         {profile.personaname}
//                     </div>
//                     <div className="flex items-center gap-1">
//                         <span
//                             className={`w-2 h-2 rounded-full ${status.color}`}
//                         ></span>
//                         <span className="text-gray-600 capitalize">
//                             {status.label}
//                         </span>
//                     </div>
//                 </div>
//                 {/* Steam Logo */}
//                 <div className="text-gray-400">
//                     <svg
//                         className="w-6 h-6"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         role="img"
//                         aria-label="Steam"
//                     >
//                         <title>Steam</title>
//                         <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-2.04c-3.45-.89-6-4.01-6-7.76 0-4.42 3.58-8 8-8s8 3.58 8 8c0 .71-.09 1.4-.27 2.05l1.73 1.73C21.8 14.72 22 13.39 22 12c0-5.52-4.48-10-10-10zm-1.5 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
//                     </svg>
//                 </div>
//             </div>

//             {/* Currently Playing */}
//             {isPlaying && (
//                 <div className="mb-2 pb-2 border-b border-gray-300">
//                     <div className="flex items-center gap-1 mb-1">
//                         <span className="text-green-600 font-bold">🎮</span>
//                         <span className="font-semibold text-green-700">
//                             Now Playing
//                         </span>
//                     </div>
//                     <div className="font-bold truncate">
//                         {profile.gameextrainfo}
//                     </div>
//                 </div>
//             )}

//             {/* Recent Games */}
//             {!isPlaying && profile.recentGames?.length > 0 && (
//                 <div className="mb-2">
//                     <div className="flex items-center gap-1 mb-2">
//                         <span className="text-blue-600 font-bold">📊</span>
//                         <span className="font-semibold">Recently Played</span>
//                     </div>
//                     <div className="space-y-1">
//                         {profile.recentGames.slice(0, 3).map((game) => (
//                             <div
//                                 key={game.appid}
//                                 className="flex items-center justify-between text-xs"
//                             >
//                                 <span className="truncate flex-1">
//                                     {game.name}
//                                 </span>
//                                 <span className="text-gray-500 ml-2">
//                                     {formatPlaytime(game.playtime_2weeks)} (2w)
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {profile.personastate === 0 &&
//                 profile.recentGames?.length === 0 && (
//                     <div className="text-gray-500 text-center mt-4">
//                         Currently offline
//                     </div>
//                 )}
//         </div>
//     );
// }
