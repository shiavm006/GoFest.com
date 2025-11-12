"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileDialog } from "@/components/ui/profile-dialog";

export function ProfileButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!newToken);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(() => {
      const newToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!newToken);
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  };

  if (!isLoggedIn) {
    return (
      <Button 
        variant="ghost" 
        className="h-auto p-0 hover:bg-transparent cursor-pointer"
        onClick={handleClick}
      >
        <img
          className="rounded-full"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces"
          alt="Profile"
          width={40}
          height={40}
        />
        <ChevronDown size={16} strokeWidth={2} className="ms-2 opacity-60" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <ProfileDialog>
      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent cursor-pointer">
        <img
          className="rounded-full"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces"
          alt="Profile"
          width={40}
          height={40}
        />
        <ChevronDown size={16} strokeWidth={2} className="ms-2 opacity-60" aria-hidden="true" />
      </Button>
    </ProfileDialog>
  );
}

