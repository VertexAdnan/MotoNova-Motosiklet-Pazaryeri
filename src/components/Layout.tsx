import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsentBanner from "./legal/CookieConsentBanner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
      <CookieConsentBanner />
    </div>
  );
}