// src/app/_components/ProjectCard.tsx
import { InferSelectModel } from 'drizzle-orm';
import { projects, sections } from '@/lib/db/schema';
import { CopySectionButton } from './CopySectionButton';
import { AddSectionForm } from './AddSectionForm';
// 1. Import the new actions and the DeleteButton component
import { deleteProject, deleteSection } from '../actions';
import { DeleteButton } from './DeleteButton';

// ... (type definitions remain the same)
type Section = InferSelectModel<typeof sections>;
type ProjectWithSections = InferSelectModel<typeof projects> & {
  sections: Section[]
};

export function ProjectCard({ project }: { project: ProjectWithSections }) {
  // 2. Bind the deleteProject action with the project's ID
  const deleteProjectAction = deleteProject.bind(null, project.id);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col relative">
      {/* 3. Add the DeleteButton for the entire project */}
      <div className="absolute top-2 right-2">
        <DeleteButton action={deleteProjectAction} itemType="project" />
      </div>

      <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2 pr-8">{project.name}</h3>
      
      <div className="mb-4">
        <AddSectionForm projectId={project.id} />
      </div>
      
      <div className="space-y-3 mt-auto">
        <h4 className="font-semibold text-gray-300">Sections:</h4>
        {project.sections.map((section) => {
          // 4. Bind the deleteSection action for each specific section
          const deleteSectionAction = deleteSection.bind(null, section.id);

          return (
            <div key={section.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center gap-2">
              <div className="flex-grow">
                <p className="font-semibold">{section.title}</p>
                <p className="text-sm text-gray-400">{section.content?.substring(0, 30)}...</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CopySectionButton sectionId={section.id} />
                {/* 5. Add the DeleteButton for this section */}
                <DeleteButton action={deleteSectionAction} itemType="section" />
              </div>
            </div>
          );
        })}
        {project.sections.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No sections yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}