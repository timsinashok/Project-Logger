// src/app/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { profiles } from '@/lib/db/schema'
import { CreateProjectForm } from './_components/CreateProjectForm'
import { ProjectCard } from './_components/ProjectCard'
import { SignOutButton } from './_components/SignOutButton'

export default async function HomePage() {
  const userId = (await cookies()).get('userId')?.value

  // Temporarily comment out auth redirect for testing
  // if (!userId) {
  //   redirect('/login')
  // }

  // For now, show a demo page if no user
  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400">Confyde Demo</h1>
              <p className="text-gray-300">Welcome to the demo!</p>
            </div>
          </header>
          <p className="text-gray-400">This is a demo page. Authentication is temporarily disabled.</p>
          <div className="mt-4">
            <a href="/login" className="text-cyan-400 hover:text-cyan-300 underline">
              Go to Login Page
            </a>
          </div>
        </div>
      </main>
    )
  }

  try {
    // Fetch the current user's data, including their company and its projects
    const userData = await db.query.profiles.findFirst({
      where: eq(profiles.id, parseInt(userId)),
      with: {
        company: {
          with: {
            projects: {
              with: {
                sections: {
                  orderBy: (sections, { desc }) => [desc(sections.createdAt)],
                },
              },
            },
          },
        },
      },
    });

    if (!userData || !userData.company) {
      // This could happen if a user was deleted but their cookie remains
      (await cookies()).delete('userId'); // <--- THIS IS THE FIX
      redirect('/login');
    }

    const { company, username } = userData;

    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400">{company.name}</h1>
              <p className="text-gray-300">Welcome back, <span className="font-semibold">{username}</span>!</p>
            </div>
            <SignOutButton />
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
            <CreateProjectForm />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Company's Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {company.projects.length > 0 ? (
                company.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <p className="text-gray-400">Your company hasn't created any projects yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Database error:', error);
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-red-400">Database Connection Error</h1>
              <p className="text-gray-300">There was an issue connecting to the database.</p>
            </div>
          </header>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Error Details:</h2>
            <p className="text-gray-300 mb-4">
              {error instanceof Error ? error.message : 'Unknown database error'}
            </p>
            <p className="text-gray-400 text-sm">
              This could be due to missing environment variables or database connection issues.
              Please check your DATABASE_URL configuration in Vercel.
            </p>
          </div>
        </div>
      </main>
    );
  }
}