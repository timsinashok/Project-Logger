// src/app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { companies, profiles, projects, sections } from '@/lib/db/schema'
import { and, eq, inArray } from 'drizzle-orm'; // Make sure to import 'and' and 'inArray'

// Action to "log in" a user by username
export async function createUserAndSignIn(formData: FormData) {
  const username = formData.get('username') as string;

  if (!username) {
    throw new Error('Username is required.');
  }

  // Check if user already exists
  let user = await db.query.profiles.findFirst({
    where: eq(profiles.username, username.toLowerCase()),
  });

  // If user doesn't exist, create one in the default company
  if (!user) {
    // Find a default company or create one if none exist
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

  // Set a cookie to remember the user
  (await cookies()).set('userId', String(user.id), { httpOnly: true, path: '/' });

  // Redirect to the dashboard
  redirect('/');
}

// Action to create a new project (now uses cookie for auth)
export async function createProject(formData: FormData) {
  const userId = cookies().get('userId')?.value;
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
  const userId = (await cookies()).get('userId')?.value;
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
  const userId = cookies().get('userId')?.value;
  if (!userId) redirect('/login');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title) {
    // You could return an error message here instead
    throw new Error('Section title is required.');
  }

  // Optional: Add a check to ensure the user has permission to add to this project
  // (For this app, we assume if they can see the project, they have permission)

  await db.insert(sections).values({
    title: title,
    content: content,
    projectId: projectId,
  });

  // Revalidate the path to refresh the UI and show the new section
  revalidatePath('/');
}

// Action to delete a single section
export async function deleteSection(sectionId: number) {
  const userId = cookies().get('userId')?.value;
  if (!userId) redirect('/login');

  // For extra security, you could check if the user's company owns the project
  // that this section belongs to. For this demo, we'll keep it simple.

  await db.delete(sections).where(eq(sections.id, sectionId));

  revalidatePath('/');
}

// Action to delete a whole project and all its sections
export async function deleteProject(projectId: number) {
  const userId = cookies().get('userId')?.value;
  if (!userId) redirect('/login');

  // Important: To maintain data integrity, we must delete the children (sections)
  // before deleting the parent (project).

  // 1. Delete all sections belonging to this project
  await db.delete(sections).where(eq(sections.projectId, projectId));

  // 2. Delete the project itself
  await db.delete(projects).where(eq(projects.id, projectId));

  revalidatePath('/');
}