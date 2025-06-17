// src/app/_components/CreateProjectForm.tsx
'use client'

import { useFormStatus } from 'react-dom';
import { createProject } from '../actions';

// A helper component to show a pending state on the button
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}


export function CreateProjectForm() {
  return (
    // The `action` prop on a form can directly take a Server Action
    <form action={createProject} className="flex gap-2 p-4 bg-gray-800 rounded-lg">
      <input
        type="text"
        name="projectName"
        placeholder="Enter new project name..."
        required
        className="flex-grow bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <SubmitButton />
    </form>
  );
}