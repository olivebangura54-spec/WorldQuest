import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6 text-center">
      <h1 className="text-6xl font-extrabold text-blue-500 mb-4">WorldQuest</h1>
      <p className="text-xl text-gray-400 max-w-lg mb-10">
        Transform your learning into an epic adventure. Recover the Knowledge Crystals and become a World Scholar.
      </p>
      <Link 
        href="/auth/signup"
        className="rounded-full bg-blue-600 px-10 py-4 text-lg font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
      >
        Start Your Adventure
      </Link>
    </main>
  );
}
