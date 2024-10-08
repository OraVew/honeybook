import { Inter } from "next/font/google";
import "./globals.css";
import 'swiper/css';          // Core Swiper styles
import 'swiper/css/autoplay'; // Optional: Swiper Autoplay module styles
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Book at OraVew",
  description: "Build with love by OraVew",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
