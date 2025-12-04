"use client";

import { useRef } from "react";
import Link from "next/link";
import { Linkedin, ArrowRight } from "lucide-react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

const heroImage = "/college_fests-1280x720.jpg";

export default function AboutSection3() {
  const heroRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const scaleVariants = {
    visible: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  const socialLinks = [
    {
      icon: <InstagramGradientIcon />,
      href: "https://www.instagram.com",
      label: "Instagram",
    },
    {
      icon: <Linkedin className="h-4 w-4 text-[#0A66C2]" />,
      href: "https://www.linkedin.com/company/gofest",
      label: "LinkedIn",
    },
  ];

  return (
    <section className="py-8 px-4 bg-white" ref={heroRef}>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="flex justify-between items-center mb-8 w-[85%] absolute lg:top-4 md:top-0 sm:-top-2 -top-3 z-10">
            <div className="flex items-center gap-2 text-xl">
              <span className="text-red-500 animate-spin">✱</span>
              <TimelineContent
                as="span"
                animationNum={0}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-sm font-medium text-gray-600 uppercase tracking-[0.3em]"
              >
                WHO WE ARE
              </TimelineContent>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <TimelineContent
                  key={link.label}
                  as="a"
                  animationNum={index}
                  timelineRef={heroRef}
                  customVariants={revealVariants}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:w-8 md:h-8 sm:w-6 w-5 sm:h-6 h-5 border border-gray-200 bg-white rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                  aria-label={link.label}
                >
                  {link.icon}
                </TimelineContent>
              ))}
            </div>
          </div>

          <TimelineContent
            as="figure"
            animationNum={4}
            timelineRef={heroRef}
            customVariants={scaleVariants}
            className="relative group"
          >
            <svg className="w-full" viewBox="0 0 100 40">
              <defs>
                <clipPath id="about-clip" clipPathUnits="objectBoundingBox">
                  <path
                    d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                  />
                </clipPath>
              </defs>
              <image
                clipPath="url(#about-clip)"
                preserveAspectRatio="xMidYMid slice"
                width="100%"
                height="100%"
                href={heroImage}
              />
            </svg>
          </TimelineContent>

          <div className="flex flex-wrap lg:justify-start justify-between items-center py-3 text-sm">
            <TimelineContent
              as="div"
              animationNum={5}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="flex gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                <span className="text-red-500 font-bold">500+</span>
                <span className="text-gray-600">fests onboarded</span>
                <span className="text-gray-300 hidden sm:inline-block">|</span>
              </div>
              <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                <span className="text-red-500 font-bold">3M+</span>
                <span className="text-gray-600">students reached</span>
              </div>
            </TimelineContent>
            <div className="lg:absolute right-0 bottom-16 flex lg:flex-col flex-row-reverse lg:gap-0 gap-4">
              <TimelineContent
                as="div"
                animationNum={6}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="flex lg:text-4xl sm:text-3xl text-2xl items-center gap-2 mb-2"
              >
                <span className="text-red-500 font-semibold">120+</span>
                <span className="text-gray-600 uppercase">campuses</span>
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={7}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="flex items-center gap-2 mb-2 sm:text-base text-xs"
              >
                <span className="text-red-500 font-bold">30%</span>
                <span className="text-gray-600">higher engagement</span>
                <span className="text-gray-300 lg:hidden block">|</span>
              </TimelineContent>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="sm:text-4xl md:text-5xl text-2xl !leading-[110%] font-semibold text-black mb-8">
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.12}
                staggerFrom="first"
                reverse
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 30,
                  delay: 0.5,
                }}
              >
                Building India's most trusted college fest network.
              </VerticalCutReveal>
            </h1>

            <TimelineContent
              as="div"
              animationNum={9}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="grid md:grid-cols-2 gap-8 text-gray-600"
            >
              <TimelineContent
                as="div"
                animationNum={10}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="sm:text-base text-xs"
              >
                <p className="leading-relaxed text-justify">
                  Gofest.com is the launchpad for college festivals across
                  India. We help student teams map guests, vendors, sponsors,
                  and audiences through a single dashboard so they can focus on
                  unforgettable experiences.
                </p>
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={11}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="sm:text-base text-xs"
              >
                <p className="leading-relaxed text-justify">
                  From curated discovery to seamless registrations and host
                  tooling, we connect communities that thrive on live culture.
                  Every story we publish is powered by authentic student energy.
                </p>
              </TimelineContent>
            </TimelineContent>
          </div>

          <div className="md:col-span-1">
            <div className="text-right">
              <TimelineContent
                as="div"
                animationNum={12}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-red-500 text-2xl font-bold mb-2"
              >
                GOFEST CREW
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={13}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-gray-600 text-sm mb-8"
              >
                Community Builders | Fest Architects
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={14}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="mb-6"
              >
                <p className="text-gray-900 font-medium">
                  Ready to supercharge the next fest on your campus?
                </p>
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramGradientIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <defs>
        <linearGradient id="gofest-instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <path
        fill="url(#gofest-instagram-gradient)"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm-.2 2c-1.6 0-2.8 1.2-2.8 2.8v10.4c0 1.6 1.2 2.8 2.8 2.8h10.4c1.6 0 2.8-1.2 2.8-2.8V6.8c0-1.6-1.2-2.8-2.8-2.8Zm5.2 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.6-2.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"
      />
    </svg>
  );
}


