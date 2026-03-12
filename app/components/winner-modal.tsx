"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface WinnerModalProps {
  /** Name of the winner (null when no winner). */
  winner: string | null;
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Callback to close the modal without any action. */
  onClose: () => void;
  /** Callback to remove the winner from the participant list. */
  onRemoveWinner: () => void;
  /** Callback to keep the winner in the list. */
  onKeepWinner: () => void;
}

/**
 * Celebration modal shown when the roulette spin ends.
 * Displays the winner name with a confetti animation and provides
 * options to remove or keep the winner in the list.
 */
export default function WinnerModal({
  winner,
  isOpen,
  onClose,
  onRemoveWinner,
  onKeepWinner,
}: WinnerModalProps) {
  /** Fires a confetti burst from both sides of the screen. */
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#ff4757", "#ffd32a"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });

    frame();
  }, []);

  useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen, fireConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-to-br from-[#1a1a3e]/95 to-[#0f0a2e]/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 max-w-md w-full mx-4 border border-white/15 shadow-[0_0_80px_rgba(139,92,246,0.2)] text-center"
          >
            {/* Celebration emoji */}
            <motion.div
              animate={{
                rotate: [0, 12, -12, 12, -8, 0],
                scale: [1, 1.3, 1.1, 1.25, 1],
              }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-7xl mb-4 select-none"
            >
              🎉
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-white/60 text-lg mb-2"
            >
              ¡Tenemos un ganador!
            </motion.p>

            {/* Winner name */}
            <motion.h3
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.25,
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
              className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-pink-300 to-purple-400 mb-10 leading-tight py-1"
            >
              {winner}
            </motion.h3>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRemoveWinner}
                className="w-full py-3.5 rounded-2xl bg-red-500/70 hover:bg-red-500/90 text-white font-semibold transition-colors cursor-pointer text-sm"
              >
                🗑️ Eliminar de la lista
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onKeepWinner}
                className="w-full py-3.5 rounded-2xl bg-emerald-500/70 hover:bg-emerald-500/90 text-white font-semibold transition-colors cursor-pointer text-sm"
              >
                ✅ Conservar en la lista
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/8 hover:bg-white/[0.14] text-white/50 hover:text-white/70 font-medium transition-colors cursor-pointer text-sm"
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
