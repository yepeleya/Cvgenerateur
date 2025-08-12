"use client";
import { useRouter } from "next/navigation";

const countries = [
  { code: "Canada", flag: "🇨🇦" },
  { code: "France", flag: "🇫🇷" },
  { code: "Côte d'Ivoire", flag: "🇨🇮" },
];

export default function ChooseCountry() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-blue-700 drop-shadow-lg">Choisissez le pays pour votre CV</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-3xl">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => router.push(`/cv-builder?country=${encodeURIComponent(c.code)}`)}
            className="group p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span className="text-6xl mb-2 group-hover:animate-bounce">{c.flag}</span>
            <p className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{c.code}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
