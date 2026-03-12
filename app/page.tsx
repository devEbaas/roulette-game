"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import RouletteWheel from "./components/roulette-wheel";
import NameListEditor from "./components/name-list-editor";
import WinnerModal from "./components/winner-modal";
import SpinButton from "./components/spin-button";

/** Represents a single participant with a stable unique ID. */
interface Participant {
  id: string;
  name: string;
}

/** Generates a unique identifier for a participant. */
function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/** Default participants shown when the app first loads. */
const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: generateId(), name: "Fernando" },
  { id: generateId(), name: "Jesús" },
  { id: generateId(), name: "Luis" },
];

/**
 * Main page component for the interactive roulette application.
 * Manages all application state: participants, rotation, spin status,
 * winner selection, and modal visibility.
 */
export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>(DEFAULT_PARTICIPANTS);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinDuration, setSpinDuration] = useState(4);

  /** Tracks the winner's participant ID for removal after modal interaction. */
  const winnerIdRef = useRef<string | null>(null);

  /** Extracts the plain name array from participants (for the wheel). */
  const names = participants.map((p) => p.name);

  /**
   * Initiates a spin: picks a random winner, calculates the target rotation,
   * and triggers the animation.
   */
  const handleSpin = useCallback(() => {
    if (isSpinning || participants.length < 2) return;

    setIsSpinning(true);
    setShowModal(false);
    setWinner(null);
    setWinnerIndex(null);

    const total = participants.length;
    const segmentAngle = 360 / total;

    // Pick random winner
    const chosenIndex = Math.floor(Math.random() * total);
    const chosenParticipant = participants[chosenIndex];

    // Random position within the segment (20%-80% to avoid edges)
    const randomOffset = (Math.random() * 0.6 + 0.2) * segmentAngle;
    const targetAngle = chosenIndex * segmentAngle + randomOffset;

    // Calculate additional rotation needed so that `targetAngle` sits at the pointer (0°)
    const targetModulo = ((360 - targetAngle) % 360 + 360) % 360;
    const currentModulo = ((rotation % 360) + 360) % 360;
    let additionalRotation = ((targetModulo - currentModulo) % 360 + 360) % 360;

    // Add full spins for dramatic effect
    const fullSpins = 5 + Math.floor(Math.random() * 4);
    additionalRotation += fullSpins * 360;

    const duration = 3.5 + Math.random() * 2;

    // Store winner info
    setWinner(chosenParticipant.name);
    setWinnerIndex(chosenIndex);
    winnerIdRef.current = chosenParticipant.id;
    setSpinDuration(duration);
    setRotation((prev) => prev + additionalRotation);
  }, [isSpinning, participants, rotation]);

  /** Callback from the wheel when the spin animation completes. */
  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false);
    setShowModal(true);
  }, []);

  /** Removes the winner from the participant list and closes the modal. */
  const handleRemoveWinner = useCallback(() => {
    const targetId = winnerIdRef.current;
    if (targetId) {
      setParticipants((prev) => prev.filter((p) => p.id !== targetId));
    }
    setShowModal(false);
    setWinner(null);
    setWinnerIndex(null);
    winnerIdRef.current = null;
  }, []);

  /** Closes the modal while keeping the winner in the list. */
  const handleKeepWinner = useCallback(() => {
    setShowModal(false);
    setWinner(null);
    setWinnerIndex(null);
    winnerIdRef.current = null;
  }, []);

  /** Closes the modal without any participant changes. */
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setWinner(null);
    setWinnerIndex(null);
    winnerIdRef.current = null;
  }, []);

  /** Adds a new participant. */
  const handleAddName = useCallback((name: string) => {
    setParticipants((prev) => [...prev, { id: generateId(), name }]);
  }, []);

  /** Edits a participant's name by index. */
  const handleEditName = useCallback((index: number, newName: string) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  /** Removes a participant by index. */
  const handleRemoveName = useCallback((index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0a2e] via-[#1a1040] to-[#0a0a1a] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 p-4 sm:p-6 lg:p-8">
      {/* Left section: Title + Wheel + Spin Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-300 via-pink-300 to-rose-300 tracking-tight select-none">
          🎡 Spin Wheel
        </h1>

        {/* Wheel or placeholder */}
        {names.length >= 2 ? (
          <RouletteWheel
            names={names}
            rotation={rotation}
            isSpinning={isSpinning}
            spinDuration={spinDuration}
            highlightIndex={!isSpinning && showModal ? winnerIndex : null}
            onSpinEnd={handleSpinEnd}
          />
        ) : (
          <div className="w-[min(85vw,420px)] aspect-square rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
            <p className="text-white/30 text-center px-8 text-sm leading-relaxed">
              Agrega al menos <strong className="text-white/50">2 nombres</strong>
              <br />
              para habilitar la ruleta
            </p>
          </div>
        )}

        {/* Spin button */}
        <SpinButton
          onSpin={handleSpin}
          disabled={isSpinning || names.length < 2}
        />
      </motion.div>

      {/* Right section: Editor panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <NameListEditor
          participants={participants}
          onAdd={handleAddName}
          onEdit={handleEditName}
          onRemove={handleRemoveName}
        />
      </motion.div>

      {/* Winner modal */}
      <WinnerModal
        winner={winner}
        isOpen={showModal}
        onClose={handleCloseModal}
        onRemoveWinner={handleRemoveWinner}
        onKeepWinner={handleKeepWinner}
      />
    </div>
  );
}
