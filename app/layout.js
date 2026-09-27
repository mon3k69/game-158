import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const headingFont = Baloo_2({
  subsets: ["latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const bodyFont = Nunito({
  subsets: ["latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "Gra ZHP",
  description: "Gra terenowa ZHP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
