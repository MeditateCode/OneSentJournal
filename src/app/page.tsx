"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Smile, Calendar, Clock, Palette, Settings } from "lucide-react";
import confetti from "canvas-confetti";
import { Dialog } from "@headlessui/react";

// --- Fonts ---
const FONTS = [
  { name: "Poppins", class: "font-poppins" },
  { name: "Lobster", class: "font-lobster" },
  { name: "Pacifico", class: "font-pacifico" },
  { name: "Playfair Display", class: "font-playfair" },
  { name: "Shadows Into Light", class: "font-shadows" },
];

// --- Themes ---
const THEME_NAMES = [
  "Dreamy Purple",
  "Ocean Breeze",
  "Sunset Glow",
  "Night Sky",
  "Emerald Forest",
  "Golden Hour",
  "Aurora Lights",
  "Rose Bloom",
  "Cosmic Vibe",
  "Deep Space",
];

const GRADIENTS = [
  ["from-indigo-500 via-purple-500 to-pink-500", "from-indigo-200/40 via-purple-200/30 to-pink-200/20", "#4b0082"],
  ["from-cyan-400 via-teal-500 to-emerald-600", "from-cyan-200/40 via-teal-200/30 to-emerald-200/20", "#0d9488"],
  ["from-orange-400 via-pink-500 to-red-600", "from-orange-200/40 via-pink-200/30 to-red-200/20", "#b91c1c"],
  ["from-gray-900 via-gray-800 to-black", "from-gray-700/50 via-gray-800/40 to-black/30", "#111827"],
  ["from-green-300 via-emerald-400 to-teal-500", "from-green-200/40 via-emerald-200/30 to-teal-200/20", "#065f46"],
  ["from-yellow-300 via-orange-400 to-red-500", "from-yellow-200/40 via-orange-200/30 to-red-200/20", "#92400e"],
  ["from-green-400 via-blue-500 to-purple-600", "from-green-200/40 via-blue-200/30 to-purple-200/20", "#4338ca"],
  ["from-pink-300 via-rose-400 to-red-500", "from-pink-200/40 via-rose-200/30 to-red-200/20", "#9d174d"],
  ["from-fuchsia-500 via-purple-600 to-indigo-700", "from-fuchsia-200/40 via-purple-200/30 to-indigo-200/20", "#6d28d9"],
  ["from-black via-gray-900 to-indigo-900", "from-gray-800/40 via-gray-700/30 to-indigo-800/20", "#1e3a8a"],
];

const THEMES = Array.from({ length: 100 }, (_, i) => {
  const [bg, card, dark] = GRADIENTS[i % GRADIENTS.length];
  return {
    name: `${THEME_NAMES[i % THEME_NAMES.length]} ${Math.floor(i / 10) + 1}`,
    bg: `bg-gradient-to-br ${bg}`,
    card: `bg-gradient-to-br ${card}`,
    dark,
  };
});

export default function Home() {
  const [entry, setEntry] = useState("");
  const [emoji, setEmoji] = useState("😊");
  const [entries, setEntries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState(0);
  const [font, setFont] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        listenToEntries(u.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const listenToEntries = (uid: string) => {
    const q = query(
      collection(db, "entries"),
      where("userId", "==", uid),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.7 },
    });
  };

  const submitEntry = async () => {
    if (!entry || !user) return;
    await addDoc(collection(db, "entries"), {
      userId: user.uid,
      content: entry,
      mood: emoji,
      date: serverTimestamp(),
    });
    setEntry("");
    setEmoji("😊");
    triggerConfetti();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col md:flex-row items-start md:items-center justify-between relative px-4 md:px-20 py-6 gap-6 md:gap-0 ${THEMES[theme].bg} ${FONTS[font].class} transition-all duration-700`}
    >
      {/* Custom scrollbar */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Lobster&family=Pacifico&family=Playfair+Display:wght@500&family=Poppins:wght@400;600&family=Shadows+Into+Light&display=swap");

        .font-poppins { font-family: "Poppins", sans-serif; }
        .font-lobster { font-family: "Lobster", cursive; }
        .font-pacifico { font-family: "Pacifico", cursive; }
        .font-playfair { font-family: "Playfair Display", serif; }
        .font-shadows { font-family: "Shadows Into Light", cursive; }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.15); border-radius: 8px; }
        ::-webkit-scrollbar-thumb { background: ${THEMES[theme].dark}; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: ${THEMES[theme].dark}cc; }
      `}</style>

      {/* ✅ Logo (Top-Left) */}
      <div
        className="absolute top-6 left-8 md:left-20 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg cursor-pointer select-none"
        style={{
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(10px)",
          color: THEMES[theme].dark,
        }}
      >
        <span className="font-bold text-lg tracking-wide">OneSentJournal</span>
      </div>

      {/* Theme + Settings */}
      <div className="absolute top-6 right-4 md:right-20 flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg"
          style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)" }}
        >
          <Palette className="text-white" size={18} />
          <select
            value={theme}
            onChange={(e) => setTheme(Number(e.target.value))}
            className={`px-2 py-1 rounded-lg text-white font-medium text-sm cursor-pointer outline-none ${THEMES[theme].bg}`}
          >
            {THEMES.map((t, i) => (
              <option key={i} value={i} className="text-gray-900">{t.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white shadow"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow"
        >
          Logout
        </button>
      </div>

      {/* Input Card */}
      <div className={`w-full max-w-sm ${THEMES[theme].card} backdrop-blur-lg rounded-2xl p-6 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Daily One Line</h1>

        </div>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value.slice(0, 200))}
          maxLength={200}
          placeholder="Write today’s thought..."
          className="w-full h-20 rounded-xl p-3 mb-3 bg-white/70 placeholder-gray-500 border border-gray-200 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none text-sm"
        />

        <div className="flex items-center gap-2 mb-4">
          <Smile className="text-white" size={18} />
          <select
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="p-2 rounded-lg bg-white/80 border border-gray-200 shadow text-sm"
          >
            <option>😊</option>
            <option>😔</option>
            <option>😡</option>
            <option>😴</option>
            <option>🤩</option>
            <option>🤔</option>
            <option>❤️</option>
          </select>
        </div>

        <button
          onClick={submitEntry}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 rounded-xl shadow-md text-sm transition-all"
        >
          Save Entry
        </button>
      </div>

      {/* Timeline */}
      <div className={`w-full md:w-[55%] h-[60vh] md:h-[75%] ${THEMES[theme].card} backdrop-blur-lg rounded-2xl p-6 shadow-2xl overflow-y-auto`}>
        <h2 className="text-2xl font-bold text-white mb-6">Your Timeline</h2>
        {entries.length === 0 ? (
          <p className="text-gray-200">No entries yet. Start writing!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-4 p-4 rounded-xl shadow-md hover:shadow-xl transition-all"
                style={{ backgroundColor: THEMES[theme].dark }}
              >
                {/* Emoji */}
                <div className="text-2xl">{e.mood || "📝"}</div>
                {/* Content */}
                <div className="flex-1">
                  <p className="text-white font-medium text-base">{e.content}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-200 mt-2">
                    <Calendar size={14} />
                    {e.date?.toDate ? e.date.toDate().toLocaleDateString() : "—"}
                    <Clock size={14} />
                    {e.date?.toDate
                      ? e.date.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[350px]">
            <h3 className="text-lg font-bold mb-4">Settings</h3>
            <div className="space-y-3">
              <label className="block font-medium">Choose Font:</label>
              <select
                value={font}
                onChange={(e) => setFont(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              >
                {FONTS.map((f, i) => (
                  <option key={i} value={i} className={f.class}>{f.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setSettingsOpen(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
