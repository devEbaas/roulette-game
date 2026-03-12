"use client";

import { motion } from "framer-motion";

interface SpinButtonProps {
  /** Callback fired when the button is clicked. */
  onSpin: () => void;
  /** Whether the button is disabled (e.g. during a spin or too few names). */
  disabled: boolean;
}

/**
 * Large, animated "Spin" button with a gradient background and hover effects.
 */
export default function SpinButton({ onSpin, disabled }: SpinButtonProps) {
  return (
    <motion.button
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.06,
              boxShadow: "0 0 40px rgba(236, 72, 153, 0.4)",
            }
      }
      whileTap={disabled ? {} : { scale: 0.94 }}
      onClick={onSpin}
      disabled={disabled}
      className={`
        px-14 py-4 rounded-full text-xl font-bold text-white
        transition-all duration-300 shadow-lg select-none
        ${
          disabled
            ? "bg-gray-600/50 cursor-not-allowed opacity-50"
            : "bg-linear-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-500 hover:via-pink-400 hover:to-rose-400 cursor-pointer shadow-pink-500/25"
        }
      `}
    >
      {disabled ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            🎡
          </motion.span>
          Girando...
        </span>
      ) : (
        "🎰 ¡Girar!"
      )}
    </motion.button>
  );
}
