// src/lib/db/seed.ts

import 'dotenv/config';
import { db } from './index';
import { companies, profiles, projects, sections } from './schema';

async function main() {
  console.log("Seeding database...");

  // Clear existing data in reverse order of dependency
  await db.delete(sections);
  await db.delete(projects);
  await db.delete(profiles);
  await db.delete(companies);
  console.log("Cleared old data.");

  // --- Create Companies ---
  const [acmeCorp] = await db.insert(companies).values({ name: "Acme Corporation" }).returning();
  const [starkIndustries] = await db.insert(companies).values({ name: "Stark Industries" }).returning();

  // --- Create Profiles (Users) ---
  const [alice] = await db.insert(profiles).values({ username: 'alice', companyId: acmeCorp.id }).returning();
  const [bob] = await db.insert(profiles).values({ username: 'bob', companyId: starkIndustries.id }).returning();

  // --- Create Projects ---
  const [websiteRedesign] = await db.insert(projects).values({
    name: "2024 Website Redesign",
    companyId: acmeCorp.id,
  }).returning();
  
  const [marketingCampaign] = await db.insert(projects).values({
    name: "Q3 Marketing Campaign",
    companyId: acmeCorp.id,
  }).returning();

  const [ironManSuit] = await db.insert(projects).values({
    name: "Iron Man Mark V",
    companyId: starkIndustries.id,
  }).returning();

  // --- Create Sections for Projects ---
  // Sections for Website Redesign
  await db.insert(sections).values([
    { title: "Homepage Mockup", content: "Finalize the hero section and CTA.", projectId: websiteRedesign.id },
    { title: "About Us Page", content: "Gather team photos and bios.", projectId: websiteRedesign.id },
  ]);

  // Sections for Iron Man Suit
  await db.insert(sections).values([
    { title: "Arc Reactor", content: "Miniaturize the palladium core.", projectId: ironManSuit.id },
    { title: "Repulsor Tech", content: "Increase flight stability.", projectId: ironManSuit.id },
    { title: "Suit-up Sequence", content: "Needs to be faster. Less than 30 seconds.", projectId: ironManSuit.id },
  ]);

  console.log("Database seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});