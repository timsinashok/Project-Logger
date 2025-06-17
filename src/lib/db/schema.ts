// src/lib/db/schema.ts

import { relations } from 'drizzle-orm';
// We need to import integer for this fix
import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  // CORRECT WAY: Define as an integer that is a generated identity column.
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),
});

export const profiles = pgTable('profiles', {
  // CORRECT WAY: Define as an integer that is a generated identity column.
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  companyId: integer('company_id').notNull().references(() => companies.id),
});

export const projects = pgTable('projects', {
  // CORRECT WAY: Define as an integer that is a generated identity column.
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 256 }).notNull(),
  companyId: integer('company_id').notNull().references(() => companies.id),
});

export const sections = pgTable('sections', {
  // CORRECT WAY: Define as an integer that is a generated identity column.
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content'),
  imageUrl: varchar('image_url', { length: 1024 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  projectId: integer('project_id').notNull().references(() => projects.id),
});

// ----- Drizzle Relations (No changes needed here) -----

export const companyRelations = relations(companies, ({ many }) => ({
  profiles: many(profiles),
  projects: many(projects),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  company: one(companies, {
    fields: [profiles.companyId],
    references: [companies.id],
  }),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
  sections: many(sections),
}));

export const sectionRelations = relations(sections, ({ one }) => ({
  project: one(projects, {
    fields: [sections.projectId],
    references: [projects.id],
  }),
}));