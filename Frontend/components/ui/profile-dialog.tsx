"use client";

import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { useImageUpload } from "@/components/hooks/use-image-upload";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
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
import { Check, ImagePlus, X } from "lucide-react";

function ProfileBg({ defaultImage }: { defaultImage?: string }) {
  const [hideDefault, setHideDefault] = useState(false);
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } =
    useImageUpload();

  const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

  const handleImageRemove = () => {
    handleRemove();
    setHideDefault(true);
  };

  return (
    <div className="h-32">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted">
        {currentImage && (
          <img
            className="h-full w-full object-cover"
            src={currentImage}
            alt={previewUrl ? "Preview of uploaded image" : "Default profile background"}
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white outline-offset-2 transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
            onClick={handleThumbnailClick}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white outline-offset-2 transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
              onClick={handleImageRemove}
              aria-label="Remove image"
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file"
      />
    </div>
  );
}

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } = useImageUpload();

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-10 px-6">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white outline-offset-2 transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}

export function ProfileDialog({ children }: { children: React.ReactNode }) {
  const id = useId();
  const router = useRouter();
  const maxLength = 180;
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

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
  }, []);

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: "Hey there! I'm a student passionate about college fests and events.",
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
    window.location.reload();
  };

  return (
    <Dialog>
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
          <div className="h-20 bg-gradient-to-br from-[#2D5BFF] to-[#4F46E5]"></div>
          <Avatar defaultImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" />
          <div className="px-6 pb-6 pt-4">
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
                      className="bg-gray-50 border-gray-200 text-black opacity-60 cursor-not-allowed"
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
                      className="bg-gray-50 border-gray-200 text-black opacity-60 cursor-not-allowed"
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
                      className="bg-gray-50 border-gray-200 text-black opacity-60 cursor-not-allowed"
                    />
                  </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-organization`} className="text-black">College / Organization Name</Label>
                <Input
                  id={`${id}-organization`}
                  placeholder="e.g., IIT Delhi, BITS Pilani"
                  value={userData?.college || ''}
                  type="text"
                  className="bg-gray-50 border-gray-200 text-black"
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
                <Button type="button" variant="outline" className="bg-gray-50 border-gray-200 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">Save changes</Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

