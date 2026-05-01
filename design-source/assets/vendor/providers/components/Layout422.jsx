"use client";

import { Button } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

const useRelume = () => {
  const [hoveredFeatureIdx, setHoveredFeatureIdx] = useState(null);
  const handleMouseEnter = (index) => () => {
    setHoveredFeatureIdx(index);
  };
  const handleMouseLeave = () => {
    setHoveredFeatureIdx(null);
  };
  const startAnimation = (index) => {
    return hoveredFeatureIdx === index ? "visible" : "hidden";
  };
  return {
    handleMouseEnter,
    handleMouseLeave,
    startAnimation,
  };
};

export function Layout422() {
  const hoverState = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Facility-based</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Facility-based positions in Southeast Florida
          </h2>
          <p className="md:text-md">
            Work on-site at assisted living facilities, skilled nursing
            facilities, and continuing care retirement communities across Palm
            Beach, Martin, St. Lucie, and Okeechobee counties. We handle the
            operations. You handle the therapy.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-8">
          <a
            href="#"
            className="relative flex w-full flex-col overflow-hidden md:w-1/2 lg:h-full lg:transition-all lg:duration-200 lg:hover:w-[70%]"
            onMouseOver={hoverState.handleMouseEnter(0)}
            onMouseLeave={hoverState.handleMouseLeave}
          >
            <div className="group absolute inset-0 flex size-full flex-col items-center justify-center self-start">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="size-full object-cover"
              />
            </div>
            <div className="group relative flex h-full min-h-[70vh] flex-col justify-end p-6 md:p-8 lg:p-12">
              <div className="lg:absolute lg:inset-0 lg:z-0 lg:transition-all lg:duration-300 lg:group-hover:bg-black/50" />
              <div className="z-10">
                <p className="mb-2 font-semibold text-text-alternative">
                  Facility-based
                </p>
                <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
                  Who we need
                </h3>
                <div className="lg:hidden">
                  <p className="mt-5 text-text-alternative md:mt-6">
                    Florida-licensed Psychologist, LCSW, LMHC, LPC, or LMFT in
                    Palm Beach, Martin, St. Lucie, or Okeechobee counties.
                  </p>
                  <div className="mt-6 md:mt-8">
                    <Button
                      variant="link"
                      size="link"
                      iconRight={<RxChevronRight />}
                      className="text-text-alternative"
                    >
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                <motion.div
                  className="z-10 hidden lg:block lg:w-[528px]"
                  variants={{
                    hidden: { opacity: 0, height: 0, y: 50 },
                    visible: { opacity: 1, height: "auto", y: 0 },
                  }}
                  initial="hidden"
                  animate={hoverState.startAnimation(0)}
                  exit="hidden"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <p className="mt-5 text-text-alternative md:mt-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros elementum tristique.
                  </p>
                  <div className="mt-6 md:mt-8">
                    <Button
                      variant="link"
                      size="link"
                      iconRight={<RxChevronRight />}
                      className="text-text-alternative"
                    >
                      Button
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </a>
          <a
            href="#"
            className="relative flex w-full flex-col overflow-hidden md:w-1/2 lg:h-full lg:transition-all lg:duration-200 lg:hover:w-[70%]"
            onMouseOver={hoverState.handleMouseEnter(1)}
            onMouseLeave={hoverState.handleMouseLeave}
          >
            <div className="group absolute inset-0 flex size-full flex-col items-center justify-center self-start">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 2"
                className="size-full object-cover"
              />
            </div>
            <div className="group relative flex h-full min-h-[70vh] flex-col justify-end p-6 md:p-8 lg:p-12">
              <div className="lg:absolute lg:inset-0 lg:z-0 lg:transition-all lg:duration-300 lg:group-hover:bg-black/50" />
              <div className="z-10">
                <p className="mb-2 font-semibold text-text-alternative">
                  Facility-based
                </p>
                <h3 className="text-4xl font-bold leading-[1.2] text-text-alternative md:text-5xl lg:text-6xl">
                  Who we need
                </h3>
                <div className="lg:hidden">
                  <p className="mt-5 text-text-alternative md:mt-6">
                    Florida-licensed Psychologist, LCSW, LMHC, LPC, or LMFT in
                    Palm Beach, Martin, St. Lucie, or Okeechobee counties.
                  </p>
                  <div className="mt-6 md:mt-8">
                    <Button
                      variant="link"
                      size="link"
                      iconRight={<RxChevronRight />}
                      className="text-text-alternative"
                    >
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                <motion.div
                  className="z-10 hidden lg:block lg:w-[528px]"
                  variants={{
                    hidden: { opacity: 0, height: 0, y: 50 },
                    visible: { opacity: 1, height: "auto", y: 0 },
                  }}
                  initial="hidden"
                  animate={hoverState.startAnimation(1)}
                  exit="hidden"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <p className="mt-5 text-text-alternative md:mt-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros elementum tristique.
                  </p>
                  <div className="mt-6 md:mt-8">
                    <Button
                      variant="link"
                      size="link"
                      iconRight={<RxChevronRight />}
                      className="text-text-alternative"
                    >
                      Button
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
