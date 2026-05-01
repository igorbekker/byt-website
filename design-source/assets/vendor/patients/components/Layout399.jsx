"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout399() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Choose</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              What brings you here?
            </h2>
            <p className="md:text-md">Find the right path to care</p>
          </div>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="flex flex-col border border-border-primary">
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Families</p>
                <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
                  Seniors and families
                </h3>
                <p>
                  Your parent didn't stop having an inner life when they moved
                  into a facility.
                </p>
              </div>
              <div className="mt-5 md:mt-6">
                <Button
                  title="Explore"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Explore
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center self-start">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
          <div className="flex flex-col border border-border-primary">
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Adults</p>
                <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
                  Individual therapy
                </h3>
                <p>
                  You've already decided you want to talk to someone. The system
                  shouldn't be the reason you don't.
                </p>
              </div>
              <div className="mt-5 md:mt-6">
                <Button
                  title="Explore"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Explore
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center self-start">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
          <div className="flex flex-col border border-border-primary">
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Support</p>
                <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
                  Caregivers
                </h3>
                <p>
                  You've been taking care of everyone else. You deserve the same
                  access to care.
                </p>
              </div>
              <div className="mt-5 md:mt-6">
                <Button
                  title="Explore"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Explore
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center self-start">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
          <div className="flex flex-col border border-border-primary">
            <div className="flex flex-1 flex-col justify-center p-6">
              <div>
                <p className="mb-2 text-sm font-semibold">Español</p>
                <h3 className="mb-2 text-lg font-bold leading-[1.4] md:text-2xl">
                  Terapia en español
                </h3>
                <p>
                  Cuidar de tu familia empieza contigo. Buscar ayuda no es
                  debilidad.
                </p>
              </div>
              <div className="mt-5 md:mt-6">
                <Button
                  title="Explore"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Explore
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center self-start">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
