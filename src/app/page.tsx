"use client";

import { useState } from "react";
import { MatchCard } from "../components/MatchCard";
import { MOCK_USERS } from "../lib/data";

export default function Home() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const handleNextProfile = () => {
    // Loop back to the beginning for the sake of the demo, or show a "No more profiles" state
    setCurrentUserIndex((prev) => (prev + 1) % MOCK_USERS.length);
  };

  const currentUser = MOCK_USERS[currentUserIndex];

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md mx-auto relative flex flex-col items-center">

        {/* App Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ditto to-ditto-light tracking-tight mb-2">
            ditto
          </h1>
          <p className="text-white/60 text-sm">Personality First.</p>
        </div>

        {/* Card Container */}
        <div className="w-full relative">
          <MatchCard
            key={currentUser.id} // Forces remount on new user
            user={currentUser}
            onNextProfile={handleNextProfile}
          />
        </div>

        {/* Decorative elements behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-ditto/20 blur-[100px] rounded-full pointer-events-none -z-10" />
      </div>
    </main>
  );
}
