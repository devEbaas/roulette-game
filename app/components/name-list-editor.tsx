"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Represents a single participant in the roulette. */
interface Participant {
  id: string;
  name: string;
}

interface NameListEditorProps {
  /** Current list of participants. */
  participants: Participant[];
  /** Callback to add a new name. */
  onAdd: (name: string) => void;
  /** Callback to edit an existing participant's name by index. */
  onEdit: (index: number, newName: string) => void;
  /** Callback to remove a participant by index. */
  onRemove: (index: number) => void;
}

/**
 * Side panel component that lets the user add, edit, and remove participant names.
 * Updates propagate in real time to the roulette wheel.
 */
export default function NameListEditor({
  participants,
  onAdd,
  onEdit,
  onRemove,
}: NameListEditorProps) {
  const [newName, setNewName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  /** Adds a new participant and clears the input. */
  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onAdd(trimmed);
      setNewName("");
    }
  };

  /** Submits the add input on Enter key. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  /** Opens inline editing mode for the given index. */
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(participants[index].name);
  };

  /** Confirms the inline edit and exits editing mode. */
  const confirmEdit = () => {
    if (editingIndex !== null) {
      const trimmed = editValue.trim();
      if (trimmed) {
        onEdit(editingIndex, trimmed);
      }
      setEditingIndex(null);
      setEditValue("");
    }
  };

  /** Handles keyboard shortcuts while editing (Enter to confirm, Escape to cancel). */
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmEdit();
    if (e.key === "Escape") {
      setEditingIndex(null);
      setEditValue("");
    }
  };

  return (
    <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm border border-white/[0.12] shadow-2xl">
      {/* Header */}
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">✏️</span>
        Participantes
        <span className="ml-auto text-sm font-normal text-white/40 bg-white/10 px-2.5 py-0.5 rounded-full">
          {participants.length}
        </span>
      </h2>

      {/* Add input row */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nuevo nombre..."
          className="flex-1 bg-white/[0.08] text-white placeholder-white/30 rounded-xl px-4 py-2.5 border border-white/[0.12] focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/30 transition-all text-sm"
          maxLength={30}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="bg-purple-500/80 hover:bg-purple-500 disabled:bg-white/10 disabled:text-white/20 text-white w-10 h-10 rounded-xl font-bold text-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          +
        </motion.button>
      </div>

      {/* Scrollable list */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 30, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl px-3 py-2.5 group transition-colors"
            >
              {/* Color indicator dot */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    [
                      "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
                      "#1abc9c", "#e67e22", "#2c3e50", "#e84393", "#00b894",
                      "#0984e3", "#6c5ce7", "#d35400", "#16a085", "#c0392b",
                      "#006266", "#5758BB", "#EE5A24", "#009432", "#1289A7",
                      "#A3CB38", "#D980FA", "#B53471", "#FDA7DF", "#12CBC4",
                      "#ED4C67", "#0652DD", "#9AECDB", "#FFC312", "#1B1464",
                    ][index % 30],
                }}
              />

              {editingIndex === index ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={confirmEdit}
                  autoFocus
                  className="flex-1 bg-white/[0.08] text-white rounded-lg px-3 py-1 border border-purple-400/50 focus:outline-none text-sm"
                  maxLength={30}
                />
              ) : (
                <>
                  <span className="flex-1 text-white/90 text-sm truncate">
                    {participant.name}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(index)}
                    className="text-white/20 hover:text-blue-400 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer text-sm"
                    title="Editar"
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(index)}
                    className="text-white/20 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer text-sm"
                    title="Eliminar"
                  >
                    ✕
                  </motion.button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {participants.length === 0 && (
        <p className="text-white/25 text-center py-6 text-sm">
          No hay participantes.
          <br />
          ¡Agrega algunos para comenzar!
        </p>
      )}
    </div>
  );
}
