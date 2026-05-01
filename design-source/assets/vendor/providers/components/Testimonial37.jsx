"use client";

import React from "react";
import { BiSolidStar } from "react-icons/bi";

export function Testimonial37() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              What therapists are saying
            </h1>
            <p className="md:text-md">
              Hear from providers already working with us.
            </p>
          </div>
        </div>
        <div className="gid-cols-1 grid gap-6 sm:grid-rows-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:grid-rows-2">
          <div className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
              alt="Relume logo 1"
              className="max-h-12"
            />
          </div>
          <div className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
              alt="Webflow logo 1"
              className="max-h-12"
            />
          </div>
          <div className="flex flex-col items-start justify-between border border-border-primary p-6 sm:col-span-2 md:p-8 order-last lg:order-none">
            <div className="mb-5 flex md:mb-6">
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
            </div>
            <p className="md:text-md">
              "I stopped worrying about billing and scheduling the day I started
              with BYT. I see patients. That's it. That's the job."
            </p>
            <div className="mt-5 flex w-full flex-col items-start md:mt-6 md:w-fit md:flex-row md:items-center">
              <div>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial image 1"
                  className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
                />
              </div>
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p>LCSW, facility-based, Palm Beach County</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between border border-border-primary p-6 sm:col-span-2 md:p-8">
            <div className="mb-5 flex md:mb-6">
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
              <BiSolidStar className="size-6" />
            </div>
            <p className="md:text-md">
              "I stopped worrying about billing and scheduling the day I started
              with BYT. I see patients. That's it. That's the job."
            </p>
            <div className="mt-5 flex w-full flex-col items-start md:mt-6 md:w-fit md:flex-row md:items-center">
              <div>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial image 2"
                  className="mb-4 size-12 min-h-12 min-w-12 rounded-full object-cover md:mb-0 md:mr-4"
                />
              </div>
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p>LCSW, facility-based, Palm Beach County</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
              alt="Relume logo 2"
              className="max-h-12"
            />
          </div>
          <div className="flex items-center justify-center border border-border-primary p-6 md:p-8 lg:p-6">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
              alt="Webflow logo 2"
              className="max-h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
