// src/app/_components/CopySectionButton.tsx
'use client'

import { useFormStatus } from 'react-dom';
import { copySection } from '../actions';

// A dedicated submit button to show pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-2 rounded disabled:opacity-50 transition-colors"
    >
      {pending ? '...' : 'Copy'}
    </button>
  );
}

export function CopySectionButton({ sectionId }: { sectionId: number }) {
  // We use .bind() to pre-fill the first argument of the Server Action.
  // The form itself doesn't need any inputs.
  const copySectionWithId = copySection.bind(null, sectionId);

  return (
    <form action={copySectionWithId}>
      <SubmitButton />
    </form>
  );
}