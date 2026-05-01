"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header84() {
  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 border border-border-primary lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Every resident deserves mental health support
            </h1>
            <p className="md:text-md">
              We place licensed therapists—Psychologists, LCSWs, LMHCs, LPCs,
              and LMFTs—on-site at your facility weekly. We handle Medicare
              billing, scheduling, and all documentation. Zero cost to your
              facility.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Refer" variant="primary">
                Refer
              </Button>
              <Button title="754-999-0011" variant="secondary">
                754-999-0011
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
