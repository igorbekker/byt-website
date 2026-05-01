"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Cta36() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="mb-5 size-12 md:mb-6"
                alt="Relume logo"
              />
            </div>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Ready to apply?
            </h2>
            <p>Three minutes to submit. Same-day follow-up. No games.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <Button variant="primary">Apply now</Button>
              <Button variant="secondary">Learn</Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="mb-5 size-12 md:mb-6"
                alt="Relume logo"
              />
            </div>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Questions first?
            </h2>
            <p>Call us at 754-999-0011. We answer. We're therapists too.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <Button variant="primary">Call us</Button>
              <Button variant="secondary">Apply now</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
