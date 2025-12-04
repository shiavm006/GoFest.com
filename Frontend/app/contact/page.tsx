"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import { ProfileButton } from "@/components/ui/profile-button";
import { Footer } from "@/components/ui/footer";
import AboutSection3 from "@/components/ui/about-section";
import { ContactPageSection } from "@/components/ui/contact-page";
import { getAuthToken } from "@/lib/api";

export default function ContactPage() {
  const isLoggedIn = typeof window !== "undefined" && !!getAuthToken();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5 gap-6">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          Gofest.com
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-base">
            <Link href="/" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Home
            </Link>
            <Link href="/events" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Events
            </Link>
            <Link href="/host" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Host
            </Link>
            <Link href="/contact" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              About Us
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      <AboutSection3 />
      <ContactPageSection />

      <Footer
        logo={
          <span className="text-3xl tracking-tight text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
            Gofest.com
          </span>
        }
        brandName="Gofest.com"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />,
            href: "https://twitter.com/gofest",
            label: "Twitter",
          },
          {
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
              </svg>
            ),
            href: "https://instagram.com/gofest",
            label: "Instagram",
          },
          {
            icon: <Linkedin className="h-5 w-5 text-[#0077B5]" />,
            href: "https://linkedin.com/company/gofest",
            label: "LinkedIn",
          },
          {
            icon: <Github className="h-5 w-5 text-[#181717]" />,
            href: "https://github.com/gofest",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/", label: "Home" },
          { href: "/events", label: "Events" },
          { href: "/host", label: "Host" },
          { href: "/contact", label: "About" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} Gofest.com`,
          license: "All rights reserved",
        }}
      />
    </div>
  );
}

