"use client";

import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, updateMe } from "@/lib/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileDialog({ children }: { children: React.ReactNode }) {
  const id = useId();
  const router = useRouter();
  const maxLength = 180;
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
    bio: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen]);

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
    setValue,
  } = useCharacterLimit({
    maxLength,
    initialValue: "",
  });

  useEffect(() => {
    if (userData?.bio !== undefined) {
      setValue(userData.bio);
    }
  }, [userData?.bio]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
    window.location.reload();
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      const updated = await updateMe({
        college: userData.college,
        bio: value,
      });

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              college: updated.college,
              bio: updated.bio,
            }
          : prev
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5 bg-white border-gray-200">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-gray-200 px-6 py-4 text-base text-black">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-6">
            <form className="space-y-4">
              {isLoading ? (
                <div className="text-gray-500 text-center py-4">Loading profile...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-full-name`} className="text-black">Full Name</Label>
                    <Input
                      id={`${id}-full-name`}
                      placeholder="Your full name"
                      value={userData?.name || ''}
                      type="text"
                      disabled
                      className="bg-white border-gray-200 text-black cursor-not-allowed"
                      wrapperClassName="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-email`} className="text-black">Email</Label>
                    <Input
                      id={`${id}-email`}
                      placeholder="john@example.com"
                      value={userData?.email || ''}
                      type="email"
                      disabled
                      className="bg-white border-gray-200 text-black cursor-not-allowed"
                      wrapperClassName="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-phone`} className="text-black">Phone Number</Label>
                    <Input
                      id={`${id}-phone`}
                      placeholder="+91 98765 43210"
                      value={userData?.phone || ''}
                      type="tel"
                      disabled
                      className="bg-white border-gray-200 text-black cursor-not-allowed"
                      wrapperClassName="bg-white"
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-organization`} className="text-black">College / Organization Name</Label>
                <Input
                  id={`${id}-organization`}
                  placeholder="e.g., IIT Delhi, BITS Pilani"
                  value={userData?.college || ''}
                  type="text"
                  className="bg-white border-gray-200 text-black"
                  onChange={(val) =>
                    setUserData((prev) =>
                      prev ? { ...prev, college: val } : prev
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-bio`} className="text-black">Biography</Label>
                <Textarea
                  id={`${id}-bio`}
                  placeholder="Write a few sentences about yourself"
                  value={value}
                  maxLength={maxLength}
                  onChange={handleChange}
                  aria-describedby={`${id}-description`}
                  className="bg-white border border-gray-300 text-black"
                />
                <p
                  id={`${id}-description`}
                  className="mt-2 text-right text-xs text-gray-500"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">{limit - characterCount}</span> characters left
                </p>
              </div>
              </>
              )}
            </form>
          </div>
        </div>
        <DialogFooter className="border-t border-gray-200 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleLogout}
              className="bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600/20 hover:border-red-600/50"
            >
              Logout
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

