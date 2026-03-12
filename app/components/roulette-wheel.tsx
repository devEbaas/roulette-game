"use client";

import { motion } from "framer-motion";

/**
 * Vibrant segment colors designed for good visual contrast on the wheel.
 * Supports up to 30 unique colors before cycling.
 */
const SEGMENT_COLORS = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#2c3e50",
  "#e84393",
  "#00b894",
  "#0984e3",
  "#6c5ce7",
  "#d35400",
  "#16a085",
  "#c0392b",
  "#006266",
  "#5758BB",
  "#EE5A24",
  "#009432",
  "#1289A7",
  "#A3CB38",
  "#D980FA",
  "#B53471",
  "#FDA7DF",
  "#12CBC4",
  "#ED4C67",
  "#0652DD",
  "#9AECDB",
  "#FFC312",
  "#1B1464",
];

interface RouletteWheelProps {
  /** List of participant names to display on the wheel. */
  names: string[];
  /** Current cumulative rotation in degrees. */
  rotation: number;
  /** Whether the wheel is currently spinning. */
  isSpinning: boolean;
  /** Duration of the spin animation in seconds. */
  spinDuration: number;
  /** Index of the winning segment to highlight (null if no winner). */
  highlightIndex: number | null;
  /** Callback fired when the spin animation completes. */
  onSpinEnd: () => void;
}

/** Center X of the SVG wheel. */
const CX = 200;
/** Center Y of the SVG wheel. */
const CY = 200;
/** Radius of the wheel. */
const RADIUS = 175;

/**
 * Computes the SVG path `d` attribute for a single pie-slice segment.
 *
 * @param index - Zero-based segment index.
 * @param total - Total number of segments.
 * @returns SVG path data string.
 */
function getSegmentPath(index: number, total: number): string {
  const segmentAngle = (2 * Math.PI) / total;
  const startAngle = index * segmentAngle;
  const endAngle = (index + 1) * segmentAngle - 0.001;

  const x1 = CX + RADIUS * Math.cos(startAngle);
  const y1 = CY + RADIUS * Math.sin(startAngle);
  const x2 = CX + RADIUS * Math.cos(endAngle);
  const y2 = CY + RADIUS * Math.sin(endAngle);

  const largeArc = segmentAngle > Math.PI ? 1 : 0;

  return `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * Computes text position and rotation for the label inside a segment.
 *
 * @param index - Zero-based segment index.
 * @param total - Total number of segments.
 * @returns Object with x, y coordinates and rotation angle in degrees.
 */
function getTextTransform(
  index: number,
  total: number
): { x: number; y: number; angle: number } {
  const segmentAngle = (2 * Math.PI) / total;
  const midAngle = index * segmentAngle + segmentAngle / 2;
  const textRadius = RADIUS * 0.62;

  const x = CX + textRadius * Math.cos(midAngle);
  const y = CY + textRadius * Math.sin(midAngle);
  let angle = (midAngle * 180) / Math.PI;

  // Flip text on the left half so it remains readable
  if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
    angle += 180;
  }

  return { x, y, angle };
}

/**
 * Interactive roulette wheel component rendered as an SVG.
 * Supports smooth rotation animation via Framer Motion and segment highlighting.
 */
export default function RouletteWheel({
  names,
  rotation,
  isSpinning,
  spinDuration,
  highlightIndex,
  onSpinEnd,
}: RouletteWheelProps) {
  const total = names.length;
  const fontSize = total > 20 ? 7 : total > 14 ? 9 : total > 8 ? 11 : total > 5 ? 13 : 15;
  const maxChars = total > 20 ? 5 : total > 14 ? 7 : total > 8 ? 9 : total > 5 ? 12 : 16;

  return (
    <div className="relative w-[min(85vw,420px)] aspect-square">
      {/* Pointer triangle — fixed at the right edge */}
      <div className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 drop-shadow-lg">
        <svg width="28" height="40" viewBox="0 0 28 40">
          <polygon
            points="0,20 28,2 28,38"
            fill="#ff4757"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Glow ring behind the wheel */}
      <div
        className="absolute inset-[-12px] rounded-full transition-all duration-1000"
        style={{
          background: isSpinning
            ? "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Rotating wheel */}
      <motion.div
        className="w-full h-full"
        animate={{ rotate: rotation }}
        transition={
          isSpinning
            ? { duration: spinDuration, ease: [0.0, 0.45, 0.1, 1.0] }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (isSpinning) onSpinEnd();
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            {/* Drop shadow for the outer ring */}
            <filter
              id="wheelShadow"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="10"
                floodColor="rgba(0,0,0,0.4)"
              />
            </filter>
            {/* Text outline for readability */}
            <filter id="textOutline" x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology
                in="SourceAlpha"
                result="dilated"
                operator="dilate"
                radius="1.5"
              />
              <feFlood floodColor="rgba(0,0,0,0.6)" result="color" />
              <feComposite in="color" in2="dilated" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer decorative ring */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS + 8}
            fill="none"
            stroke="#1a1a3e"
            strokeWidth="12"
            filter="url(#wheelShadow)"
          />
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS + 4}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />

          {/* Segments */}
          {names.map((name, i) => {
            const text = getTextTransform(i, total);
            const displayName =
              name.length > maxChars
                ? name.substring(0, maxChars) + "\u2026"
                : name;

            return (
              <g key={i}>
                {/* Segment fill */}
                <path
                  d={getSegmentPath(i, total)}
                  fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1"
                />
                {/* Winner highlight overlay */}
                {highlightIndex === i && (
                  <path
                    d={getSegmentPath(i, total)}
                    fill="rgba(255,255,255,0.35)"
                    className="animate-pulse-glow"
                  />
                )}
                {/* Segment label */}
                <text
                  x={text.x}
                  y={text.y}
                  transform={`rotate(${text.angle}, ${text.x}, ${text.y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize={fontSize}
                  fontWeight="bold"
                  fontFamily="var(--font-geist-sans), Arial, sans-serif"
                  filter="url(#textOutline)"
                >
                  {displayName}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle
            cx={CX}
            cy={CY}
            r={26}
            fill="#1a1a3e"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <circle cx={CX} cy={CY} r={14} fill="#2d2d5e" />
          <circle
            cx={CX}
            cy={CY}
            r={6}
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
