"use client"

import { Button } from "@/components/ui/button"
import { useImageUpload } from "@/components/hooks/use-image-upload"
import { ImagePlus, X, Upload, Trash2, FileText } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload?: (url: string) => void;
  accept?: string;
  fileType?: "image" | "pdf";
  label?: string;
  description?: string;
  value?: string;
}

export function FileUpload({ 
  onUpload, 
  accept = "image/*", 
  fileType = "image",
  label = "File Upload",
  description = "Click to select or drag and drop",
  value
}: FileUploadProps) {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    isUploading,
    uploadError,
  } = useImageUpload({
    onUpload,
  })

  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file && fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
        const event = new Event('change', { bubbles: true })
        fileInputRef.current.dispatchEvent(event)
      }
    },
    [fileInputRef],
  )

  const displayUrl = previewUrl || value;

  return (
    <div className="w-full space-y-2">
      <input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-label={label}
        disabled={isUploading}
      />

      {uploadError && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
          {uploadError}
        </div>
      )}

      {isUploading && (
        <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded p-2 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading to cloud...
        </div>
      )}

      {!displayUrl ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-white transition-colors hover:bg-gray-50",
            isDragging && "border-blue-500/50 bg-blue-50",
          )}
        >
          <div className="rounded-full bg-white p-3 shadow-sm">
            {fileType === "image" ? (
              <ImagePlus className="h-6 w-6 text-gray-700" />
            ) : (
              <FileText className="h-6 w-6 text-gray-700" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-700">
              {description}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {fileType === "image" ? (
            <div className="group relative h-48 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Image
                src={displayUrl}
                alt="Preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleThumbnailClick}
                  className="h-9 w-9 p-0"
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="h-9 w-9 p-0"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="group relative h-24 overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-700" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                  <p className="text-xs text-gray-700">PDF Document</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

