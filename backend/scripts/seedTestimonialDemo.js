require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { createHash } = require("crypto");
const Testimonial = require("../models/portfolio/testimonialModel");

// Fictional preview content. Deterministic IDs make repeat runs additive and idempotent.
const examples = [
  ["Aarav Shah", "Commerce founder", "The product pages feel clear and easy to explore. I especially liked how the checkout stayed simple, even on a smaller screen."],
  ["Maya Chen", "Product designer", "The React components matched the design details closely. Spacing, focus states, and responsive behavior all felt considered."],
  ["Noah Wilson", "Startup founder", "Seeing a working version early made it easier to discuss the next steps. The feedback process felt collaborative from the first review."],
  ["Priya Sharma", "Course creator", "The course library is easy to navigate, and lessons feel organized. It is the kind of experience I would want my students to use every day."],
  ["Oliver Reed", "Operations lead", "The dashboard puts the information we need in one place. Clear filters and a straightforward layout make everyday tasks easier to follow."],
  ["Sofia Martinez", "Creative director", "There is a lovely balance between personality and clarity. The movement adds character while leaving the content easy to read."],
  ["Ethan Park", "Engineering lead", "The API structure is understandable and the handover is practical. It gives a future team a clear place to start when adding features."],
  ["Aisha Khan", "Community organizer", "The site feels welcoming on both phone and laptop. Forms are clear, navigation is predictable, and the small details make a difference."],
  ["Lucas Bennett", "Independent maker", "The project turned a rough idea into something I could actually explore. Each milestone made the product easier to understand."],
  ["Emma Taylor", "Content strategist", "Publishing and finding content feels straightforward. The layout gives articles room to breathe without making the pages feel empty."],
];

async function seed() {
  if (!process.env.DATABASE_CLOUD) throw new Error("DATABASE_CLOUD is not configured.");
  await mongoose.connect(process.env.DATABASE_CLOUD, { serverSelectionTimeoutMS: 15000 });
  let inserted = 0;
  for (const [index, [name, position, quote]] of examples.entries()) {
    const _id = new mongoose.Types.ObjectId(createHash("sha256").update(`portfolio-testimonial-demo-v1-${index}`).digest("hex").slice(0,24));
    const existing = await Testimonial.findById(_id).lean();
    if (existing) {
      if (!existing.isDemo) throw new Error("Seed ID is occupied by a non-demo record; stopped without overwriting it.");
      continue;
    }
    await Testimonial.create({ _id, type: "feedback", isDemo: true, fullname: `${name} (Demo)`, position, company: "Fictional preview project", content: `Demo review — ${quote}`, rating: index % 4 === 0 ? 4 : 5 });
    inserted++;
  }
  console.log(JSON.stringify({ inserted, demoRecords: examples.length, label: "Fictional preview data; not customer endorsements" }));
}

seed().catch(error => { console.error(error.name === "MongoServerSelectionError" ? "Database connection failed; check connectivity." : error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
