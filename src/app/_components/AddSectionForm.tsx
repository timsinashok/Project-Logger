// src/app/_components/AddSectionForm.tsx
'use client'

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { addSection } from '../actions';

// A helper component to show a pending state on the button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md transition-colors disabled:opacity-50"
    >
      {pending ? 'Adding...' : 'Add'}
    </button>
  );
}

export function AddSectionForm({ projectId }: { projectId: number }) {
  // We use a ref to clear the form after successful submission
  const formRef = useRef<HTMLFormElement>(null);
  
  // We need to bind the projectId to our Server Action
  const addSectionWithId = addSection.bind(null, projectId);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addSectionWithId(formData);
        // Reset the form on successful submission
        formRef.current?.reset();
      }}
      className="p-3 bg-gray-700/50 rounded-md mt-2"
    >
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="title"
          placeholder="Section Title"
          required
          className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="content"
          placeholder="Section content (optional)..."
          rows={2}
          className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}