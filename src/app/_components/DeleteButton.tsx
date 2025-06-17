// src/app/_components/DeleteButton.tsx
'use client'

import { useFormStatus } from 'react-dom';
import { MouseEventHandler } from 'react';

// A helper component to show a pending state on the button
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      aria-label={label}
      title={label}
    >
      {pending ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}

interface DeleteButtonProps {
  action: () => Promise<void>;
  itemType: string;
}

export function DeleteButton({ action, itemType }: DeleteButtonProps) {
  const formAction = async () => {
    // A simple confirmation dialog
    if (confirm(`Are you sure you want to delete this ${itemType}? This cannot be undone.`)) {
      await action();
    }
  };

  return (
    <form action={formAction}>
      <SubmitButton label={`Delete ${itemType}`} />
    </form>
  );
}