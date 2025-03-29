import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.scss";
import { ThemeProvider } from "./context/ThemeContext";
import { AppointmentProvider } from "./context/AppointmentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookEase - Simple Appointment Booking",
  description: "Easily book your appointments with BookEase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AppointmentProvider>
            {children}
          </AppointmentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
