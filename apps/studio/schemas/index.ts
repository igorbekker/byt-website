/**
 * Purpose: Sanity schema registry — exports all 21 schema types
 * Context: Imported by apps/studio/sanity.config.ts
 * Source: apps/studio/sanity.config.ts
 */

// Objects
import { imageWithAlt } from './objects/imageWithAlt';
import { seoFields } from './objects/seoFields';
import { ctaLink } from './objects/ctaLink';
import { audienceCard } from './objects/audienceCard';
import { serviceTrack } from './objects/serviceTrack';
import { processStep } from './objects/processStep';

// Singletons
import { siteSettings } from './singletons/siteSettings';
import { homePage } from './singletons/homePage';
import { aboutPage } from './singletons/aboutPage';
import { patientsPage } from './singletons/patientsPage';
import { communitiesPage } from './singletons/communitiesPage';
import { providersPage } from './singletons/providersPage';
import { careersPage } from './singletons/careersPage';
import { contactPage } from './singletons/contactPage';
import { blogIndexPage } from './singletons/blogIndexPage';

// Documents
import { testimonial } from './documents/testimonial';
import { condition } from './documents/condition';
import { blogPost } from './documents/blogPost';
import { blogCategory } from './documents/blogCategory';
import { author } from './documents/author';
import { jobPosting } from './documents/jobPosting';

export const schemaTypes = [
  // Objects
  imageWithAlt,
  seoFields,
  ctaLink,
  audienceCard,
  serviceTrack,
  processStep,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  patientsPage,
  communitiesPage,
  providersPage,
  careersPage,
  contactPage,
  blogIndexPage,
  // Documents
  testimonial,
  condition,
  blogPost,
  blogCategory,
  author,
  jobPosting,
];
