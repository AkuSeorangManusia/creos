import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
    const { slug } = await params;
    const BLOG_URL_API = process.env.BLOG_URL_API;

    if (!BLOG_URL_API) {
        return NextResponse.json(
            { error: "BLOG_URL_API not configured" },
            { status: 500 },
        );
    }

    try {
        const response = await fetch(`${BLOG_URL_API}/${slug}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Blog API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch article" },
            { status: 502 },
        );
    }
}
