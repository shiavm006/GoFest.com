"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ProfileButton() {
  return (
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
  );
}

