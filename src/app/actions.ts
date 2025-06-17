// src/app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { companies, profiles, projects, sections } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Action to "log in" a user by username
export async function createUserAndSignIn(formData: FormData) {
  const username = formData.get('username') as string;
  if (!username) {
    throw new Error('Username is required.');
  }

  let user = await db.query.profiles.findFirst({
    where: eq(profiles.username, username.toLowerCase()),
  });

  if (!user) {
    let defaultCompany = await db.query.companies.findFirst({
        where: eq(companies.name, "Acme Corporation"),
    });

    if (!defaultCompany) {
      [defaultCompany] = await db.insert(companies).values({ name: "Acme Corporation" }).returning();
    }

    [user] = await db.insert(profiles).values({
      username: username.toLowerCase(),
      companyId: defaultCompany.id,
    }).returning();
  }

  (await cookies()).set('userId', String(user.id), { httpOnly: true, path: '/' });
  redirect('/');
}

// Action to create a new project (now uses cookie for auth)
export async function createProject(formData: FormData) {
  const userId = (await cookies()).get('userId')?.value; // FIX APPLIED HERE
  if (!userId) redirect('/login');

  const projectName = formData.get('projectName') as string;

  const userProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, parseInt(userId)),
  });

  if (!userProfile) throw new Error("User profile not found.");

  await db.insert(projects).values({
    name: projectName,
    companyId: userProfile.companyId,
  });

  revalidatePath('/');
}

// Action to copy a section (now uses cookie for auth)
export async function copySection(sectionId: number) {
  const userId = (await cookies()).get('userId')?.value; // FIX APPLIED HERE
  if (!userId) redirect('/login');

  const originalSection = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
  });

  if (!originalSection) throw new Error("Section not found.");

  await db.insert(sections).values({
    title: `${originalSection.title} (Copy)`,
    content: originalSection.content,
    imageUrl: originalSection.imageUrl,
    projectId: originalSection.projectId,
  });

  revalidatePath('/');
}

// Action to sign out
export async function signOut() {
  (await cookies()).delete('userId');
  redirect('/login');
}

// Action to add a new section to a specific project
export async function addSection(projectId: number, formData: FormData) {
  const userId = (await cookies()).get('userId')?.value; // FIX APPLIED HERE
  if (!userId) redirect('/login');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title) {
    throw new Error('Section title is required.');
  }

  await db.insert(sections).values({
    title: title,
    content: content,
    projectId: projectId,
  });

  revalidatePath('/');
}

// Action to delete a single section
export async function deleteSection(sectionId: number) {
  const userId = (await cookies()).get('userId')?.value; // FIX APPLIED HERE
  if (!userId) redirect('/login');

  await db.delete(sections).where(eq(sections.id, sectionId));

  revalidatePath('/');
}

// Action to delete a whole project and all its sections
export async function deleteProject(projectId: number) {
  const userId = (await cookies()).get('userId')?.value; // FIX APPLIED HERE
  if (!userId) redirect('/login');

  await db.delete(sections).where(eq(sections.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));

  revalidatePath('/');
}