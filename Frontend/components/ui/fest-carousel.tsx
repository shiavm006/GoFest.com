"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FestCard } from "./cards";

interface FestCarouselProps {
  heading?: string;
  description?: string;
  events?: FestCard[];
  onExplore?: (title: string) => void;
  headingClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

const FestCarousel = ({
  heading = "Featured events on gofest",
  description = "Discover college fests happening across campuses.",
  events = [],
  onExplore,
  headingClassName,
  descriptionClassName,
  containerClassName,
}: FestCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  const handleExplore = (title: string) => {
    if (onExplore) {
      onExplore(title);
    }
  };

  return (
    <section className={`py-12 ${containerClassName || ""}`}>
      <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
        <div>
          <h2 className={`mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 ${headingClassName || ""}`}>
            {heading}
          </h2>
          {description && (
            <p className={`text-sm md:text-base text-gray-500 ${descriptionClassName || ""}`}>
              {description}
            </p>
          )}
        </div>

        <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto border-gray-200 bg-gray-50 text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto border-gray-200 bg-gray-50 text-white hover:bg-white/10"
          >
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
          className="relative left-[-1rem]"
        >
          <CarouselContent className="-mr-4 ml-8 2xl:ml-[max(8rem,calc(50vw-700px+1rem))] 2xl:mr-[max(0rem,calc(50vw-700px-1rem))]">
            {events.map((event) => (
              <CarouselItem key={event.title} className="pl-4 md:max-w-[452px]">
                <div
                  className="group flex flex-col justify-between cursor-pointer"
                  onClick={() => handleExplore(event.title)}
                >
                  <div>
                    <div className="flex aspect-[3/2] overflow-clip rounded-xl">
                      <div className="flex-1">
                        <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl text-white">
                    {event.title}
                  </div>

                  {event.description && (
                    <div className="mb-4 line-clamp-2 text-sm text-gray-500 md:mb-6 md:text-base lg:mb-6">
                      {event.description}
                    </div>
                  )}

                  {event.author && (
                    <div className="mb-4 text-[11px] text-white/45 uppercase tracking-[0.2em]">
                      {event.author}
                      {event.role ? ` — ${event.role}` : ""}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 group-hover:text-white transition-colors">
                    Explore{" "}
                    <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default FestCarousel;

