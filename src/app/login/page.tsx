// src/app/login/page.tsx
import { createUserAndSignIn } from '../actions';

export default function LoginPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-center text-gray-400 mb-8">Enter your username to continue</p>
        
        {/* This form calls a Server Action */}
        <form action={createUserAndSignIn} className="flex flex-col gap-4">
          <label htmlFor="username" className="sr-only">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="e.g., alice"
            className="bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Sign In / Create Account
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6">
          Try 'alice' or 'bob' to see seeded data. Any other name will create a new user in 'Acme Corporation'.
        </p>
      </div>
    </main>
  );
}