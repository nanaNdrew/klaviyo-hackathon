"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Lock } from "lucide-react";
import { User, PersonalityPrompt } from "../types/user";
import { cn } from "../lib/utils";

interface MatchCardProps {
  user: User;
  onNextProfile: () => void;
}

const MIN_CHARS = 10;
const UNBLUR_DURATION = 3;

export function MatchCard({ user, onNextProfile }: MatchCardProps) {
  const [response, setResponse] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pick the first prompt for this user
  const activePrompt: PersonalityPrompt = user.prompts[0] || { id: "default", question: "My most controversial opinion is..." };

  const canSubmit = response.length >= MIN_CHARS;

  const handleSubmit = () => {
    if (!canSubmit) return;

    setIsSuccess(true);
    setIsRevealed(true);

    // Auto-advance to next profile after the success state is shown for a few seconds
    setTimeout(() => {
      onNextProfile();
      // Reset state for next profile happens due to re-render with new user, but good to be safe
      setResponse("");
      setIsRevealed(false);
      setIsSuccess(false);
    }, (UNBLUR_DURATION + 2) * 1000); // Wait for unblur + 2s reading time
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-black">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ filter: "blur(20px)", scale: 1.1 }}
        animate={{
          filter: isRevealed ? "blur(0px)" : "blur(20px)",
          scale: isRevealed ? 1 : 1.1
        }}
        transition={{ duration: UNBLUR_DURATION, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Overlay Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Content Area */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="interaction-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="w-full space-y-4"
            >
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <Lock size={16} className="text-ditto" />
                <span className="text-sm font-medium tracking-wide uppercase">Photo Locked</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl">
                <h3 className="text-white font-semibold text-lg leading-tight mb-4 shadow-sm">
                  {activePrompt.question}
                </h3>

                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response to reveal..."
                  className="w-full bg-black/20 border border-white/10 text-white placeholder:text-white/40 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ditto-accent transition-all h-24"
                />

                <div className="flex justify-between items-center mt-3">
                  <span className={cn("text-xs", canSubmit ? "text-ditto-light/70" : "text-white/40")}>
                    {response.length}/{MIN_CHARS} chars min
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNextProfile()}
                      className="px-4 py-2 rounded-full font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all active:scale-95 text-sm"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                        canSubmit
                          ? "bg-ditto text-white hover:bg-ditto-accent shadow-lg shadow-ditto/30 transform hover:scale-105 active:scale-95"
                          : "bg-white/10 text-white/30 cursor-not-allowed"
                      )}
                    >
                      <span>Send to Reveal</span>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center text-center space-y-3 pb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-ditto rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(225,29,72,0.5)]"
              >
                <CheckCircle2 size={32} className="text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                {user.name}, {user.age}
              </h2>
              <p className="text-ditto-light/90 font-medium text-lg drop-shadow-sm">Match Sent!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
