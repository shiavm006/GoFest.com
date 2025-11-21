"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          "mr-4 transition-opacity",
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        )}
      >
        <svg
          width="9"
          height="16"
          viewBox="0 0 12 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 1L2 9.24242L11 17"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-white/70"
          />
        </svg>
      </button>

      <div className="flex gap-2 text-gray-500 text-sm md:text-base">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 md:w-12 h-9 md:h-12"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "flex items-center justify-center active:scale-95 w-9 md:w-12 h-9 md:h-12 aspect-square rounded-md transition-all",
                isActive
                  ? "bg-white text-black border border-white"
                  : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-white/10 hover:border-white/20"
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          "ml-4 transition-opacity",
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        )}
      >
        <svg
          width="9"
          height="16"
          viewBox="0 0 12 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L10 9.24242L1 17"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-white/70"
          />
        </svg>
      </button>
    </div>
  );
}

