"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Cta35() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-16">
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
              className="mb-5 size-12 md:mb-6"
              alt="Relume logo"
            />
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Access care that works
            </h2>
            <p>
              On-site at your facility or from anywhere in Florida. Licensed
              therapists. Insurance accepted. Available this week.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button variant="primary">Book</Button>
              <Button variant="secondary">Call</Button>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
              className="mb-5 size-12 md:mb-6"
              alt="Relume logo"
            />
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              You deserve better
            </h2>
            <p>
              Licensed therapists placed at your facility or available via
              secure video. Medicare, private insurance, and cash-pay options.
              No waiting.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button variant="primary">Book</Button>
              <Button variant="secondary">Call</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
