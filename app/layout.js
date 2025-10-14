import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata = {
  title: "Creos - Muhammad Ahsan Sanadi",
  description: "Interactive retro OS portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
