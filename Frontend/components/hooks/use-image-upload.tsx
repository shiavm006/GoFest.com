import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    console.log("Cloudinary Config:", { cloudName, uploadPreset });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Cloudinary error:", errorData);
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data.secure_url);
      return data.secure_url;
    } catch (error: any) {
      console.error("Upload error details:", error);
      throw new Error(error.message || "Failed to upload image. Please try again.");
    }
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

        setFileName(file.name);
      setUploadError(null);
      setIsUploading(true);

      // Create local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      previewRef.current = localUrl;

      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);
        
        // Update with Cloudinary URL
        setPreviewUrl(cloudinaryUrl);
        previewRef.current = cloudinaryUrl;
        onUpload?.(cloudinaryUrl);
      } catch (error: any) {
        setUploadError(error.message);
        // Revert to local preview on error
        setPreviewUrl(localUrl);
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    setUploadError(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpload?.("");
  }, [previewUrl, onUpload]);

  useEffect(() => {
    return () => {
      if (previewRef.current && previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    isUploading,
    uploadError,
  };
}

