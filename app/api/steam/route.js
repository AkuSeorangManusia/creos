import { NextResponse } from "next/server";

export async function GET() {
    const STEAM_API_KEY = process.env.STEAM_API_KEY;
    const STEAM_USER_ID = process.env.STEAM_USER_ID;

    if (!STEAM_API_KEY || !STEAM_USER_ID) {
        return NextResponse.json(
            {
                success: false,
                error: "Steam API key or User ID not configured",
            },
            { status: 500 },
        );
    }

    try {
        const summaryResponse = await fetch(
            `https://api.steamapis.com/steam/profile/${STEAM_USER_ID}?api_key=${STEAM_API_KEY}`,
            { next: { revalidate: 30 } },
        );

        if (!summaryResponse.ok) {
            throw new Error("Failed to fetch Steam data");
        }

        const player = await summaryResponse.json();

        if (!player || player.error) {
            return NextResponse.json(
                { success: false, error: player?.error || "Player not found" },
                { status: 404 },
            );
        }

        const recentGamesResponse = await fetch(
            `https://api.steamapis.com/steam/api/GetRecentlyPlayedGames?steamid=${STEAM_USER_ID}&count=3&key=${STEAM_API_KEY}`,
            { next: { revalidate: 60 } },
        );

        let recentGames = [];
        if (recentGamesResponse.ok) {
            const recentGamesData = await recentGamesResponse.json();
            recentGames = recentGamesData.response?.games || [];
        }

        const stateMap = {
            online: 1,
            offline: 0,
            busy: 2,
            away: 3,
            snooze: 4,
            "looking-to-trade": 5,
            "looking-to-play": 6,
        };

        const avatarUrl = player.avatarHash
            ? `https://avatars.steamstatic.com/${player.avatarHash}_full.jpg`
            : null;

        return NextResponse.json({
            success: true,
            data: {
                personaname: player.name,
                profileurl: player.customURL
                    ? `https://steamcommunity.com/id/${player.customURL}`
                    : `https://steamcommunity.com/profiles/${STEAM_USER_ID}`,
                avatar: avatarUrl,
                personastate: stateMap[player.onlineState] ?? 0,
                stateMessage: player.stateMessage,
                gameextrainfo: player.inGameInfo?.gameName || null,
                gameid: player.inGameInfo?.gameID || null,
                realName: player.realName,
                location: player.location,
                recentGames: recentGames.map((game) => ({
                    name: game.name,
                    appid: game.appid,
                    playtime_2weeks: game.playtime_2weeks,
                    img_icon_url: game.img_icon_url,
                })),
            },
        });
    } catch (error) {
        console.error("Steam API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch Steam data" },
            { status: 500 },
        );
    }
}
