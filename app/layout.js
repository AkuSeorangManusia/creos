import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata = {
  title: "Muhammad Ahsan Sanadi | Dim's Desktop - Interactive Portfolio",
  description:
    "Hello! I'm Muhammad Ahsan Sanadi, somewhat a tech enthusiast from Yogyakarta, Indonesia. Welcome to my interactive portfolio that definitely doesn't take me ages to build. Explore my projects, blog posts, and more in this nostalgic retro-themed OS!",
  keywords: [
    "Muhammad Ahsan Sanadi",
    "portfolio",
    "web developer",
    "DevOps engineer",
    "Yogyakarta",
    "Indonesia",
    "retro OS",
    "interactive portfolio",
  ],
  authors: [{ name: "Muhammad Ahsan Sanadi" }],
  creator: "Muhammad Ahsan Sanadi",
  metadataBase: new URL("https://ahsansanadi.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahsansanadi.site",
    siteName: "Dim's Desktop",
    title:
      "Muhammad Ahsan Sanadi | Dim's Desktop - Interactive Retro Portfolio",
    description:
      "An interactive retro OS-themed portfolio by Muhammad Ahsan Sanadi. Explore projects, blog posts, and more in a nostalgic Windows 98-inspired interface.",
    images: [
      {
        url: "/pixel-art.jpg",
        width: 1200,
        height: 630,
        alt: "Dim's Desktop - Retro OS Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ahsan Sanadi | Dim's Desktop",
    description:
      "An interactive retro OS-themed portfolio. Explore projects, blog posts, and more!",
    images: ["/pixel-art.jpg"],
    creator: "@andimsum_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ahsansanadi.site/#website",
      url: "https://ahsansanadi.site",
      name: "Dim's Desktop",
      description:
        "Interactive retro OS-themed portfolio by Muhammad Ahsan Sanadi",
      publisher: {
        "@id": "https://ahsansanadi.site/#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://ahsansanadi.site/#person",
      name: "Muhammad Ahsan Sanadi",
      alternateName: "Dim",
      description:
        "Tech enthusiast and aspiring DevOps engineer from Yogyakarta, Indonesia",
      url: "https://ahsansanadi.site",
      image: "https://ahsansanadi.site/lilith.png",
      jobTitle: "Aspiring DevOps Engineer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Yogyakarta",
        addressCountry: "Indonesia",
      },
      sameAs: [
        "https://github.com/AkuSeorangManusia",
        "https://www.linkedin.com/in/andimsum/",
        "https://www.instagram.com/andimsum_",
        "https://blog.andimsum.icu",
      ],
      email: "ahsansanadi167@gmail.com",
    },
    {
      "@type": "WebPage",
      "@id": "https://ahsansanadi.site/#webpage",
      url: "https://ahsansanadi.site",
      name: "Dim's Desktop - Interactive Retro Portfolio",
      isPartOf: {
        "@id": "https://ahsansanadi.site/#website",
      },
      about: {
        "@id": "https://ahsansanadi.site/#person",
      },
      description:
        "An interactive retro OS-themed portfolio featuring projects, blog posts, and contact information in a retro operating system style.",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${vt323.variable} antialiased`}>
        {/* Hidden SEO content for crawlers */}
        <h1 className="sr-only">
          Muhammad Ahsan Sanadi - Dim's Desktop Interactive Portfolio
        </h1>
        <div className="sr-only">
          <h2>About Muhammad Ahsan Sanadi</h2>
          <p>
            Tech enthusiast and aspiring DevOps engineer from Yogyakarta,
            Indonesia. Passionate about Linux, web development, and building
            creative projects.
          </p>
          <h2>Connect with me</h2>
          <nav aria-label="Social media links">
            <a href="https://github.com/AkuSeorangManusia">GitHub</a>
            <a href="https://www.linkedin.com/in/andimsum/">LinkedIn</a>
            <a href="https://www.instagram.com/andimsum_">Instagram</a>
            <a href="mailto:ahsansanadi167@gmail.com">Email</a>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
