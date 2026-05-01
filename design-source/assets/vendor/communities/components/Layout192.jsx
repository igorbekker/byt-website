"use client";

import React from "react";

export function Layout192() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-3 font-semibold md:mb-4">Service</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Facilities we serve in Southeast Florida
            </h2>
            <p className="md:text-md">
              We place licensed therapists at ALFs, SNFs, and CCRCs across Palm
              Beach, Martin, St. Lucie, and Okeechobee counties. Expanding
              coverage every quarter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
