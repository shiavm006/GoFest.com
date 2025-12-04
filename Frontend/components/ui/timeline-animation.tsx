"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  ElementType,
  useMemo,
  useRef,
} from "react";

type TimelineContentProps<T extends ElementType> = {
  as?: T;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants | Record<string, any>;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "ref">;

const defaultVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hidden: {
    opacity: 0,
    y: 16,
  },
};

export function TimelineContent<T extends ElementType = "div">({
  as,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  ...props
}: TimelineContentProps<T>) {
  const fallbackRef = useRef<HTMLElement | null>(null);
  const targetRef = timelineRef ?? fallbackRef;
  const isInView = useInView(targetRef, {
    once: true,
    margin: "-10% 0px",
  });

  const Component = as ?? "div";
  const MotionComponent = useMemo(
    () => motion(Component as ElementType),
    [Component]
  );

  const variants = customVariants ?? defaultVariants;

  return (
    <MotionComponent
      ref={timelineRef ? undefined : (fallbackRef as any)}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
      {...props}
    />
  );
}


