"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout526() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Included</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              No cost to your facility
            </h2>
            <p className="md:text-md">
              We bill Medicare and private insurance directly.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="relative flex flex-col justify-center p-6 md:p-8 lg:min-h-[32rem]">
              <div className="absolute inset-0 z-10">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10">
                <div>
                  <p className="mb-2 inline-block text-sm font-semibold text-text-alternative">
                    Sessions
                  </p>
                  <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    Weekly on-site therapy sessions
                  </h3>
                  <p className="text-text-alternative">
                    Licensed therapist visits residents on consistent schedule.
                  </p>
                </div>
                <div className="mt-5 flex items-center md:mt-6">
                  <Button
                    variant="link-alt"
                    size="link"
                    iconRight={<RxChevronRight />}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col p-6 md:p-8">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10 flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-5 md:mb-6">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                      className="size-12"
                      alt="Relume logo"
                    />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    HIPAA-compliant documentation
                  </h3>
                  <p className="text-text-alternative">
                    Progress notes and treatment plans in secure EHR.
                  </p>
                </div>
                <div className="mt-5 flex items-center md:mt-6">
                  <Button
                    variant="link-alt"
                    size="link"
                    iconRight={<RxChevronRight />}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="relative flex flex-col p-6 md:p-8">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10 flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-5 md:mb-6">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                      className="size-12"
                      alt="Relume logo"
                    />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    Medicare and private insurance billing
                  </h3>
                  <p className="text-text-alternative">
                    All claims filed by our billing team.
                  </p>
                </div>
                <div className="mt-5 flex items-center md:mt-6">
                  <Button
                    variant="link-alt"
                    size="link"
                    iconRight={<RxChevronRight />}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col justify-center p-6 md:p-8 lg:min-h-[32rem]">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10">
                <p className="mb-2 inline-block text-sm font-semibold text-text-alternative">
                  Coordination
                </p>
                <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  Clinical team communication and care planning
                </h3>
                <p className="text-text-alternative">
                  Your therapist integrates with nursing and wellness staff.
                </p>
                <div className="mt-5 flex items-center md:mt-6">
                  <Button
                    variant="link-alt"
                    size="link"
                    iconRight={<RxChevronRight />}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="relative flex flex-col justify-center p-6 md:p-8 lg:min-h-[32rem]">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10">
                <p className="mb-2 inline-block text-sm font-semibold text-text-alternative">
                  Education
                </p>
                <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  Staff training on mental health recognition
                </h3>
                <p className="text-text-alternative">
                  In-service resources available upon request.
                </p>
                <div className="mt-5 flex items-center md:mt-6">
                  <Button
                    variant="link-alt"
                    size="link"
                    iconRight={<RxChevronRight />}
                  >
                    Learn
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col p-6 md:p-8">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  className="size-full object-cover"
                  alt="Relume placeholder image"
                />
              </div>
              <div className="relative z-10 flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-5 md:mb-6">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon-white.svg"
                      className="size-12"
                      alt="Relume logo"
                    />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-text-alternative md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    Zero cost to your residents
                  </h3>
                  <p className="text-text-alternative">
                    Medicare and insurance cover all therapy sessions.
                  </p>
                  <div className="mt-5 flex items-center md:mt-6">
                    <Button
                      variant="link-alt"
                      size="link"
                      iconRight={<RxChevronRight />}
                    >
                      Learn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
