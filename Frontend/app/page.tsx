"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileButton } from "@/components/ui/profile-button";
import { getAuthToken } from "@/lib/api";

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isLoggedIn] = useState<boolean>(() => !!getAuthToken());

  // Grid of images - college fest related images
  const images = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", // Live music
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop", // Stage performance
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop", // DJ party
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop", // Band performance
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop", // Dance performance
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=500&fit=crop", // Concert lights
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop", // Music festival
    "https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=400&h=300&fit=crop", // Outdoor event
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=400&fit=crop", // College students
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop", // Group celebration
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop", // Stage event
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=500&fit=crop", // Music event
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop", // Cultural fest
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", // Fashion show
    "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?w=400&h=300&fit=crop", // Dance event
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop", // Tech event
    "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=400&h=500&fit=crop", // Live concert
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop", // Competition
    "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=400&h=300&fit=crop", // Student event
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=400&fit=crop", // Rock concert
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", // Party lights
    "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=400&h=300&fit=crop", // Crowd cheering
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[110] bg-white border-b border-gray-200 flex justify-between items-center px-8 py-3 gap-6">
        <Link href="/" className="text-2xl font-extrabold tracking-tight whitespace-nowrap text-black relative z-10">
          gofest.com
        </Link>

        <div className="flex items-center gap-2 relative z-10">
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-black hover:text-gray-800 transition-colors relative z-10">
              Home
            </Link>
            <Link href="/events" className="text-black hover:text-gray-800 transition-colors relative z-10">
              Events
            </Link>
            <Link href="/host" className="text-black hover:text-gray-800 transition-colors relative z-10">
              HOST
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-black hover:text-gray-800 transition-colors relative z-10">
                Login
              </Link>
            )}
          </nav>
          <div className="relative z-10">
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* Image Grid Background */}
      <div className="fixed inset-0 top-0 overflow-hidden pointer-events-none">
        
        {/* Top Banner */}
        <div className="absolute top-[64px] left-0 right-0 z-50 bg-[#FFD95A] text-black py-3 px-6 text-center font-medium pointer-events-auto" data-banner>
          <div className="flex items-center justify-center">
            <span>Discover amazing college fests, cultural events & competitions across India!</span>
          </div>
        </div>
        <div className="columns-6 gap-2 p-2 space-y-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-lg break-inside-avoid mb-2 ${
                idx % 7 === 0 ? "h-[400px]" :
                idx % 5 === 0 ? "h-[350px]" :
                idx % 3 === 0 ? "h-[250px]" :
                "h-[300px]"
              }`}
            >
              <Image
                src={src}
                alt="College fest event"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 16vw"
                priority={idx < 6}
              />
            </div>
          ))}
        </div>

        {/* Blue Overlay Badge on Grid */}
        <div className="absolute top-[20%] left-[12%] z-10 bg-[#2D5BFF] text-white px-6 py-3 rounded-lg shadow-2xl transform -rotate-3">
          <div className="font-bold text-lg">one platform</div>
          <div className="font-bold text-lg">for all college fests</div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="relative bg-white rounded-3xl p-12 max-w-lg w-full mx-4 text-center shadow-2xl pointer-events-auto">
            <h1 className="text-4xl font-bold text-black mb-4">
              Hi, we're GoFest!
            </h1>
            
            <p className="text-black text-lg mb-8 leading-relaxed">
              Welcome to the one platform for all college fests, cultural events, and competitions. 
              Discover amazing events happening in colleges across India and never miss out on the action!
            </p>

            <div className="space-y-6">
              <Link href="/events">
                <button className="w-full bg-[#2D5BFF] text-white font-semibold py-4 px-8 rounded-full hover:bg-[#2448CC] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Explore Fests Now
                </button>
              </Link>

              <Link href="/host">
                <button className="w-full border-2 border-[#2D5BFF] text-[#2D5BFF] font-semibold py-4 px-8 rounded-full hover:bg-[#2D5BFF] hover:text-white transition-all">
                  Host Your Own Fest
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
