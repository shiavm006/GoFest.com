"use client";

import { useState, useEffect } from "react";
import { ProfileDialog } from "@/components/ui/profile-dialog";

export function ProfileButton() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!newToken);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const newToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!newToken);
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ProfileDialog>
      <button className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
        Profile
      </button>
    </ProfileDialog>
  );
}

