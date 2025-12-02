"use client";

import { Separator } from "@/components/ui/separator";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { BadgeHelp, Instagram, Twitter, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import { useState } from "react";

export function HeroSection03() {
  const router = useRouter();
  const [isLoggedIn] = useState<boolean>(() => !!getAuthToken());

  const handleHostClick = () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    } else {
      router.push("/host");
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_black_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_white_1px,_transparent_1px)] opacity-15 [background-size:20px_20px]"/>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center px-8 py-6">
          <div className="text-2xl tracking-tight cursor-pointer" style={{ fontFamily: 'var(--font-caveat-brush)' }}>Gofest.com</div>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-6 text-sm">
              <Link
                href="/"
                className="font-semibold hover:opacity-60 transition-opacity cursor-pointer"
              >
                Home
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="text-gray-400 hover:opacity-60 transition-opacity cursor-pointer"
                >
                  Login
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2 scale-75">
              <CartoonButton label="HOST+" color="bg-white" onClick={handleHostClick} />
            </div>
            <ProfileButton />
          </div>
        </header>

        <main className="relative pt-20 pb-20">
          <div className="flex relative gap-2 px-6 md:items-center w-full flex-col justify-center">
            <div className="md:flex gap-6 items-center">
              <p className="text-xs text-muted-foreground md:text-sm text-start md:text-right leading-5 max-w-[220px] md:max-w-[180px]">
                where colleges showcase their fests and students discover unforgettable experiences
              </p>
              <h1 className="text-6xl md:text-7xl xl:text-[10rem] font-light leading-none tracking-wider">
                COLLEGE
              </h1>
            </div>

            <div className="md:flex gap-6 items-center">
              <h1 className="text-6xl md:text-7xl xl:text-[10rem] flex font-light leading-none tracking-wider">
                <span>FE</span>
                <BadgeHelp className="lg:size-40 size-14 md:size-18 text-primary" />
                <span>STS</span>
              </h1>
              <p className="text-xs text-muted-foreground md:text-sm pt-8 leading-5 max-w-[250px] md:max-w-[180px]">
                connecting campuses across the country through cultural celebrations and competitions
              </p>
            </div>

            <div className="md:flex gap-6 items-center">
              <h1 className="text-6xl md:text-7xl xl:text-[10rem] md:flex font-light leading-none tracking-wider">
                <span>ONE</span>
                <div className="hidden lg:block">
                  <Heart className="size-40" fill="#f43f5e" stroke="#f43f5e" />
                </div>
                <div className="block lg:hidden">
                  <Heart className="size-14" fill="#f43f5e" stroke="#f43f5e" />
                </div>
                <span>PLACE</span>
              </h1>
            </div>
          </div>
          <div className="mx-auto max-w-7xl w-full px-6 gap-3">
            <div className="md:flex md:mx-8 grid md:justify-end items-center gap-3">
              <Separator className="w-full my-6 mx-auto max-w-3xl" />
              <div className="text-xs whitespace-nowrap md:text-sm">
                YOUR CAMPUS, YOUR FEST
              </div>
              <div className="flex w-full items-end gap-3">
                <span className="text-2xl md:text-4xl font-thin">REGISTER</span>
                <span className="text-3xl md:text-5xl font-bold italic text-orange-600">
                  gofest
                </span>
              </div>
            </div>
          </div>

          <div className="md:px-20 px-6 gap-6 items-end md:flex pt-12">
            <div className="w-84 h-48 shadow-lg border rounded-md overflow-hidden mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
                alt="College Fest"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground md:text-sm pt-8 leading-5">
              from techfests to cultural nights, sports tournaments to battle of bands - register for fests happening across colleges
            </p>
          </div>

          <div className="absolute bottom-8 right-8 md:right-12 flex gap-6">
            <Instagram className="size-6 cursor-pointer hover:opacity-70 transition-opacity" />
            <Twitter className="size-6 cursor-pointer hover:opacity-70 transition-opacity" />
            <Instagram className="size-6 cursor-pointer hover:opacity-70 transition-opacity" />
          </div>

          <Link href="/events" className="fixed right-0 top-1/2 h-36 items-center flex transform -translate-y-1/2">
            <div className="bg-foreground text-background py-6 px-3 text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer">
              <span className="rotate-180 [writing-mode:vertical-rl]">
                Featured Fests
              </span>
            </div>
          </Link>
        </main>
       
    </div>
  );
}

