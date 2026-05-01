"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout521() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Process</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              How the in-facility therapy program works
            </h2>
            <p className="md:text-md">
              Four simple steps from referral to care.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="relative p-6">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="size-full object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <div className="relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                  className="size-12"
                  alt="Relume logo"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-text-alternative md:text-2xl">
                You submit a resident referral
              </h3>
              <p className="text-text-alternative">
                Your staff identifies a resident needing support.
              </p>
              <div className="mt-5 flex items-center md:mt-6">
                <Button
                  variant="link-alt"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <div className="relative p-6">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="size-full object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <div className="relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                  className="size-12"
                  alt="Relume logo"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-text-alternative md:text-2xl">
                We credential, schedule, and assign a therapist
              </h3>
              <p className="text-text-alternative">
                BYT verifies licensure and coordinates placement.
              </p>
              <div className="mt-5 flex items-center md:mt-6">
                <Button
                  variant="link-alt"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <div className="relative p-6">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="size-full object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <div className="relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                  className="size-12"
                  alt="Relume logo"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-text-alternative md:text-2xl">
                Your therapist arrives on-site weekly
              </h3>
              <p className="text-text-alternative">
                Consistent, in-person sessions begin immediately.
              </p>
              <div className="mt-5 flex items-center md:mt-6">
                <Button
                  variant="link-alt"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <div className="relative p-6">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50" />
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="size-full object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <div className="relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                  className="size-12"
                  alt="Relume logo"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-text-alternative md:text-2xl">
                We bill Medicare and private insurances directly
              </h3>
              <p className="text-text-alternative">
                No claims for your team to process.
              </p>
              <div className="mt-5 flex items-center md:mt-6">
                <Button
                  variant="link-alt"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
