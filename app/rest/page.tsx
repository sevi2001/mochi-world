
import Link from "next/link";

export default function RestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-100 to-pink-100 text-center p-6">
      <div className="text-7xl mb-6">🌙</div>

      <h1 className="text-4xl font-black text-purple-700 mb-4">
        Mochi's Rest Room
      </h1>

      <p className="text-purple-500 mb-8">
        A magical sleeping adventure is coming soon! 😴
      </p>

      <Link
        href="/"
        className="rounded-full bg-purple-500 px-7 py-4 font-bold text-white"
      >
        Back Home
      </Link>
    </main>
  );
}
