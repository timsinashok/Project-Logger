// src/app/_components/SignOutButton.tsx
'use client'

import { signOut } from '../actions';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
        Sign Out
      </button>
    </form>
  );
}