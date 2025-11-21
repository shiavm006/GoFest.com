import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating: number;
  title: string;
  dateRange: string;
  hostType: string;
  isTopRated?: boolean;
  description: string;
  pricePerNight: number;
  className?: string;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  dateRange,
  hostType,
  isTopRated = false,
  description,
  pricePerNight,
  className,
}: PlaceCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const changeImage = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  const carouselVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3 }}
      variants={contentVariants}
      whileHover={{
        scale: 1.005,
        boxShadow: "0px 10px 30px -24px rgba(15, 23, 42, 0.65)",
        transition: { type: "spring", stiffness: 260, damping: 24 },
      }}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-xs cursor-pointer",
        className,
      )}
    >
      <div className="relative group h-64">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Minimal carousel controls - subtle on hover */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-900/55 hover:bg-gray-900/70 text-white/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(-1);
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-900/55 hover:bg-gray-900/70 text-white/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(1);
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Top pills */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tags
            .filter(Boolean)
            .slice(0, 2)
            .map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/85 text-black border-transparent backdrop-blur-sm text-[11px] font-medium"
              >
                {tag}
              </Badge>
            ))}
        </div>
        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-black shadow-xs backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all",
                currentIndex === index ? "w-4 bg-white" : "bg-white/60",
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

        <motion.div variants={contentVariants} className="p-4 space-y-2.5">
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-black">
            {title}
          </h3>
          {isTopRated && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-[0.16em] text-black border-transparent"
            >
              Top rated
            </Badge>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-[11px] font-medium text-black uppercase tracking-[0.14em]"
        >
          <span>{dateRange}</span> &bull; <span>{hostType}</span>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-[13px] text-black leading-relaxed line-clamp-2"
        >
          {description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-between items-center pt-1.5">
          <p className="font-semibold text-black text-[13px]">
            {pricePerNight > 0 ? (
              <>
                ₹{pricePerNight}
                <span className="text-[11px] font-normal text-black"> / person</span>
              </>
            ) : (
              <span className="text-[13px] text-emerald-600 font-semibold">Free entry</span>
            )}
          </p>
          <Button
            className="group text-black hover:text-black"
            variant="default"
            size="sm"
            style={{ backgroundColor: "#FFD95A" }}
          >
            View fest
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};


